import prisma from "../db/client";

export type Chat = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function createChat(name: string) {
  return prisma.chat.create({ data: { name } });
}

export async function getChatById(id: number) {
  return prisma.chat.findUnique({ where: { id } });
}

export async function listChats() {
  return prisma.chat.findMany({ orderBy: { id: "asc" } });
}

export async function deleteChat(id: number) {
  return prisma.chat.delete({ where: { id } });
}

export async function setMemberStatus(
  userId: number,
  chatId: number,
  status: string
) {
  return prisma.memberStatus.upsert({
    where: { userId_chatId: { userId, chatId } },
    update: { status },
    create: { userId, chatId, status },
  });
}

export async function warnUser(
  userId: number,
  chatId: number,
  reason?: string
) {
  return prisma.warn.create({
    data: { userId, chatId, reason },
  });
}

export async function sanctionUser(
  userId: number,
  chatId: number,
  type: string,
  reason?: string,
  expiresAt?: Date | null
) {
  return prisma.sanction.create({
    data: { userId, chatId, type, reason, expiresAt: expiresAt ?? undefined },
  });
}
