"use server";

import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect({ href: "/", locale: "" });
}
