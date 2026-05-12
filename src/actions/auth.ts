"use server";

import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signUpAction(formdata: FormData) {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;
    const name = formdata.get("name") as string;

    await auth.api.signUpEmail({
        body: {
            email,
            name,
            password,
        },
    });0
    redirect({ href: "/", locale: "user" });
}

export async function signInAction(formdata: FormData) {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });
    redirect({ href: "/", locale: "user" });
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers()
    })
    redirect({ href: "/", locale: "" });
}