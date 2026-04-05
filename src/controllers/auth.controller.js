import authService from "../services/auth.service.js";
import { success } from "../utils/reponse.utils.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 201, "Compte créé avec succès");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, 200, "Connexion réussie");
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    return success(res, null, 200, "Déconnexion réussie");
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    return success(res, result, 200, "Tokens rafraîchis avec succès");
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return success(res, user, 200, "Informations utilisateur");
  } catch (err) {
    next(err);
  }
};
