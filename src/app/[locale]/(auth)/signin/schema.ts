import { z } from "zod";

export const signInSchema = z.object({
    email: z.email("无效的邮件地址。"),
    password: z
        .string()
        .min(7, "密码长度大于7个字符。")
        .max(64, "密码长度不能超过64个字符。")
        .regex(/[a-zA-Z]/, "密码必须包含至少一个英文字母。")
        .regex(/[0-9]/, "密码必须包含至少一个数字。"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
