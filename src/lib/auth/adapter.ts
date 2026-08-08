import type { Adapter, AdapterUser } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

function splitName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  const parts = (fullName ?? "New User").trim().split(" ");
  const firstName = parts[0] || "New";
  const lastName = parts.slice(1).join(" ") || "User";
  return { firstName, lastName };
}

function toAdapterUser(user: {
  id: string;
  email: string;
  emailVerified: Date | null;
  firstName: string;
  lastName: string;
  image: string | null;
}): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    name: `${user.firstName} ${user.lastName}`,
    image: user.image,
  };
}

/**
 * Wraps @auth/prisma-adapter to bridge Auth.js's single `name` field
 * with our existing `firstName`/`lastName` User model — the rest of
 * the base adapter's behavior (accounts, sessions) is unchanged.
 */
export function CustomPrismaAdapter(): Adapter {
  const base = PrismaAdapter(db);

  return {
    ...base,
    async createUser(user) {
      const { firstName, lastName } = splitName(user.name);
      const created = await db.user.create({
        data: {
          firstName,
          lastName,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        },
      });
      return toAdapterUser(created);
    },
    async getUser(id) {
      const user = await db.user.findUnique({ where: { id } });
      return user ? toAdapterUser(user) : null;
    },
    async getUserByEmail(email) {
      const user = await db.user.findUnique({ where: { email } });
      return user ? toAdapterUser(user) : null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await db.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      return account ? toAdapterUser(account.user) : null;
    },
    async updateUser(user) {
      const existing = await db.user.findUnique({ where: { id: user.id } });
      const { firstName, lastName } = user.name
        ? splitName(user.name)
        : { firstName: existing?.firstName ?? "New", lastName: existing?.lastName ?? "User" };

      const updated = await db.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
          emailVerified: user.emailVerified,
        },
      });
      return toAdapterUser(updated);
    },
  };
}