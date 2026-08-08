import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { CustomPrismaAdapter } from "@/lib/auth/adapter";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";

export const authConfig: NextAuthConfig = {
  adapter: CustomPrismaAdapter(),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(
          password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified
            ? new Date()
            : null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Store the user's role in the JWT.
        token.role = user.role ?? "PARENT";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // NextAuth types token.id as unknown, so narrow it first.
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

        // token.role is also unknown, so only assign a string value.
        if (typeof token.role === "string") {
          session.user.role = token.role;
        }
      }

      return session;
    },

    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);

      const isProtectedRoute = [
        "/dashboard",
        "/profile",
        "/settings",
      ].some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );

      const isAuthPage = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
      ].some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(
          new URL("/dashboard", request.nextUrl)
        );
      }

      return true;
    },
  },
};