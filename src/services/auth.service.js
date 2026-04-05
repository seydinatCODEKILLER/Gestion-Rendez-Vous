import authRepo from "../repositories/auth.repository.js";
import bcrypt from "bcryptjs";
import TokenGenerator from "../config/jwt.js";
import HttpError from "../exceptions/http-error.exception.js";
import { env } from "../config/env.js";

// Instanciation de ta classe
const tokenGenerator = new TokenGenerator();

const getRefreshTokenExpiryDate = () => {
  const days = parseInt(env.JWT_REFRESH_DURATION) || 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

const register = async (data) => {
  const existing = await authRepo.findByEmail(data.email);
  if (existing) throw new HttpError("Cet email est déjà utilisé.", 409);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = await authRepo.createUser({
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    password: hashedPassword,
  });

  // Utilisation de ta classe pour générer les tokens
  const payload = { id: user.id, email: user.email };
  const accessToken = tokenGenerator.sign(payload);
  const refreshToken = tokenGenerator.signRefresh(payload);
  const expiresAt = getRefreshTokenExpiryDate();

  // On stocke quand même le refreshToken en base pour pouvoir le supprimer au logout
  await authRepo.saveRefreshToken(user.id, refreshToken, expiresAt);

  return { accessToken, refreshToken };
};

const login = async (data) => {
  const user = await authRepo.findByEmail(data.email);
  if (!user) throw new HttpError("Identifiants invalides.", 401);

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new HttpError("Identifiants invalides.", 401);

  const payload = { id: user.id, email: user.email };
  const accessToken = tokenGenerator.sign(payload);
  const refreshToken = tokenGenerator.signRefresh(payload);
  const expiresAt = getRefreshTokenExpiryDate();

  await authRepo.saveRefreshToken(user.id, refreshToken, expiresAt);

  return { accessToken, refreshToken };
};

const logout = async (refreshTokenString) => {
  const tokenDoc = await authRepo.findRefreshToken(refreshTokenString);
  if (tokenDoc) {
    await authRepo.deleteRefreshToken(tokenDoc.id);
  }
  return true;
};

const refreshToken = async (refreshTokenString) => {
  // 1. Le token existe-t-il en base (pour vérifier qu'il n'a pas été révoqué/loggé out) ?
  const tokenDoc = await authRepo.findRefreshToken(refreshTokenString);
  if (!tokenDoc) throw new HttpError("Refresh token invalide.", 401);

  // 2. Le token est-il expiré ?
  if (new Date() > tokenDoc.expiresAt) {
    await authRepo.deleteRefreshToken(tokenDoc.id);
    throw new HttpError(
      "Refresh token expiré. Veuillez vous reconnecter.",
      401,
    );
  }

  // 3. L'utilisateur existe-t-il toujours ?
  const user = await authRepo.findById(tokenDoc.userId);
  if (!user) throw new HttpError("Utilisateur introuvable.", 401);

  // 4. Rotation du Refresh Token (Sécurité)
  await authRepo.deleteRefreshToken(tokenDoc.id);

  const payload = { id: user.id, email: user.email };
  const newAccessToken = tokenGenerator.sign(payload);
  const newRefreshToken = tokenGenerator.signRefresh(payload);
  const expiresAt = getRefreshTokenExpiryDate();

  await authRepo.saveRefreshToken(user.id, newRefreshToken, expiresAt);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const getMe = async (userId) => {
  const user = await authRepo.findById(userId);
  if (!user) throw new HttpError("Utilisateur introuvable.", 404);
  return user;
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getMe,
};
