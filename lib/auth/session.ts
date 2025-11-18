import NextAuth from "next-auth";
import { authConfig } from "./options";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST }
} = NextAuth(authConfig);

