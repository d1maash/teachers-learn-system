import { authConfig } from "./options";
import NextAuth from "next-auth";

const { auth, signIn, signOut } = NextAuth(authConfig);

export { auth, signIn, signOut };

