"use server";

import { signOut } from "@/lib/auth/session";

export async function signOutAction() {
  await signOut({ redirectTo: "/auth/login" });
}

