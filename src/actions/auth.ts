"use server";

import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signInSchema, type SignInFormValues } from "@/app/[locale]/(auth)/signin/schema";
import { APIError } from "better-auth";
import { SignUpFormValues, signUpSchema } from "@/app/[locale]/(auth)/signup/schema";

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect({ href: "/", locale: "" });
}
