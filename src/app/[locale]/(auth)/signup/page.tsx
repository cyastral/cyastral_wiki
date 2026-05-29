"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { SignUpFormValues, signUpSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";


export default function SignUp() {
    const [submitError, setSubmitError] = useState<null | string>(null);
    const [step, setStep] = useState<"form" | "OTP">("form");
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
        mode: "onBlur",
    });

    async function onSubmit(values: SignUpFormValues) {
        //尝试注册
        const { error } = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.username,
        });
        if (error) {
            setSubmitError(error.message || "注册失败，请检查您的输入。");
            return;
        }

        //给新用户发送验证邮件
        const { error: otperror } = await authClient.emailOtp.sendVerificationOtp({
            email: values.email,
            type: "email-verification",
        });
        if (otperror) {
            setSubmitError(otperror.message || "邮件服务出错");
            return;
        }

        setSubmitError("");
        setStep("OTP");
    }

    async function onVerify() {
        //验证otp
        const { data, error } = await authClient.emailOtp.verifyEmail({
            email: form.getValues("email"),
            otp: otp,
        });
        if (error) {
            setSubmitError("验证码错误，请重试。");
            return;
        }

        //验证otp后自动登录
        const { error: signInError } = await authClient.signIn.email({
            email: form.getValues("email"),
            password: form.getValues("password"),
        });
        if (signInError) {
            setSubmitError("您的邮箱已验证，登录时出现了问题，请重新登录。");
            return;
        }

        router.push("/user");
    }

    return (
        <div className="flex w-full justify-center">
            {step === "form" && (
                <Card className="flex w-100 flex-col items-center px-6">
                    <p className="text-3xl font-bold">注册账号</p>
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
                            name="username"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>用户名</FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your username"
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
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "处理中..." : "注册"}
                        </Button>

                        {/* interpolate-size动画，safari&firefox不兼容 */}
                        <div
                            className={`overflow-hidden transition-all duration-200 ease-in-out ${submitError ? "mt-1 h-auto opacity-100" : "mt-0 h-0 opacity-0"}`}
                        >
                            <p className="text-red-500">{submitError}</p>
                        </div>

                        <a className="">已有账号？</a>
                        <Link
                            href="/signin"
                            className="inline-block font-semibold transition-all duration-75 ease-in-out hover:scale-110"
                        >
                            登录
                        </Link>
                    </form>
                </Card>
            )}
            {step === "OTP" && (
                <Card className="flex w-100 flex-col items-center px-6">
                    <p className="text-3xl font-bold">{`我们已经向${form.getValues("email")}发送了一封邮件。`}</p>
                    <InputOTP maxLength={6} id="otp" onComplete={onVerify} onChange={setOtp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${submitError ? "mt-1 h-auto opacity-100" : "mt-0 h-0 opacity-0"}`}
                    >
                        <p className="text-red-500">{submitError}</p>
                    </div>
                </Card>
            )}
        </div>
    );
}
