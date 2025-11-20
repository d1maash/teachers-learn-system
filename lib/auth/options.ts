import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { loginSchema } from "./validators";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" }
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const teacher = await prisma.teacher.findUnique({
          where: { email: parsed.data.email }
        });

        if (!teacher) {
          return null;
        }

        const match = await bcrypt.compare(parsed.data.password, teacher.passwordHash);

        if (!match) {
          return null;
        }

        return {
          id: teacher.id,
          email: teacher.email,
          name: teacher.name ?? undefined
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    }
  }
};

