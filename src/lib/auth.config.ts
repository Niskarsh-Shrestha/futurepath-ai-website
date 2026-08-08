import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "PARENT";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

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