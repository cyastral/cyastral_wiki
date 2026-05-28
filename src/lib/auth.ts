import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { getPrisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendOTPEmail } from "@/lib/email/sendemail";
import { emailOTP } from "better-auth/plugins";

const prisma = await getPrisma();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID as string,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    //     },
    // },
    plugins: [
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type == "sign-in") {
                    await sendOTPEmail({
                        email: email,
                        otp: otp,
                    });
                } else if (type == "email-verification") {
                    await sendOTPEmail({
                        email: email,
                        otp: otp,
                    });
                } else {
                }
            },
        }),
        nextCookies(),
    ],
});
