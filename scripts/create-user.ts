import { db } from "../src/lib/db";
import { users, accounts } from "../drizzle/schema";
import { nanoid } from "nanoid";
import * as crypto from "crypto";

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

async function createUser() {
  const userId = nanoid();
  const hashedPassword = await hashPassword("1515g3genki65003");

  // Create user
  await db.insert(users).values({
    id: userId,
    name: "Jin",
    email: "beecome003@bebeecome.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create credential account
  await db.insert(accounts).values({
    id: nanoid(),
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("User created successfully!");
  console.log("Email: beecome003@bebeecome.com");
  console.log("Password: 1515g3genki65003");
}

createUser().catch(console.error);
