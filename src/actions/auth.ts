"use server";

import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signInSchema, type SignInFormValues } from "@/app/[locale]/(auth)/signin/schema";

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
    });
    redirect({ href: "/", locale: "user" });
}

export async function signInAction(formvalues: SignInFormValues) {
    const result = signInSchema.safeParse(formvalues);
    if (!result.success) return { error: "验证失败" };
    const { email, password } = result.data;
    let isSuccess = false;
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });
        isSuccess = true;
    } catch (error) {
        return { error: "登录出错" };
    }
    if (isSuccess) redirect({ href: "/", locale: "user" });
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect({ href: "/", locale: "" });
}
