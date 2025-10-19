import prisma from "../db/client";

export type User = {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function createUser(username: string) {
  return prisma.user.create({ data: { username } });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function listUsers() {
  return prisma.user.findMany({ orderBy: { id: "asc" } });
}
