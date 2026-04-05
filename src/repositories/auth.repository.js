import prisma from '../config/prisma.js';

const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const findById = async (id) => {
  return prisma.user.findUnique({ 
    where: { id },
    select: { id: true, prenom: true, nom: true, email: true, createdAt: true, updatedAt: true }
  });
};

const createUser = async (data) => {
  return prisma.user.create({ data });
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  return prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  });
};

const findRefreshToken = async (token) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

const deleteRefreshToken = async (id) => {
  await prisma.refreshToken.delete({ where: { id } });
};

export default {
  findByEmail,
  findById,
  createUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};