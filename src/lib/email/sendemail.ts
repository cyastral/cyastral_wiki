import ResetCodeEmail from "../../../emails/testemail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail({ email, otp }: { email: string; otp: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Cyastral <no-reply@astesola.top>",
            to: email,
            subject: `Your Code is: ${otp}`,
            react: ResetCodeEmail({ code: otp }),
        });

        if (error) {
            console.error(error);
            throw Error(error.message);
        }
    } catch (error) {
        console.error("邮件服务异常:", error);
        throw error;
    }
}
