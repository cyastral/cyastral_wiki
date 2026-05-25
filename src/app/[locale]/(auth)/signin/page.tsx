"use client";

import { signInAction } from "@/actions/auth";

import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { SignInFormValues, signInSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

export default function SignIn() {
    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
    });
    async function onSubmit(values: SignInFormValues) {
        const result = await signInAction(values);
        if (result?.error) {
            alert("error");
        }
    }
    return (
        <div className="flex w-full justify-center">
            <Card className="flex w-100 flex-col items-center px-6">
                <p className="text-3xl font-bold">欢迎回来</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>电子邮件地址</FieldLabel>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your email"
                                    className="border-ring/40 hover:border-ring/80 border-2"
                                ></Input>

                                {/* Grid 1fr动画 */}
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${fieldState.invalid ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="min-h-[1.5rem] text-red-500">{fieldState.error?.message}</p>
                                    </div>
                                </div>
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>密码</FieldLabel>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    type="password"
                                    className="border-ring/40 hover:border-ring/80 border-2"
                                ></Input>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${fieldState.invalid ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="min-h-[1.5rem] text-red-500">{fieldState.error?.message}</p>
                                    </div>
                                </div>
                            </Field>
                        )}
                    />
                    <Button type="submit" className="h-12 w-full rounded-full">
                        登录
                    </Button>
                </form>
            </Card>
        </div>
    );
}
