import prisma from "../src/db/client";
import { createChat, listChats } from "../src/repositories/chatRepository";
import { createUser, getUserByUsername } from "../src/repositories/userRepository";
import { getDefaultConfig } from "../src/repositories/configRepository";

async function main() {
  const cfg = await getDefaultConfig();
  console.log("Default config:", cfg?.settings);

  const user = await createUser("alice").catch(async () => {
    const existing = await getUserByUsername("alice");
    return existing!;
  });
  console.log("User:", user);

  const chat = await createChat("General");
  console.log("Chat:", chat);

  const chats = await listChats();
  console.log("All chats:", chats.map((c) => c.name));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
