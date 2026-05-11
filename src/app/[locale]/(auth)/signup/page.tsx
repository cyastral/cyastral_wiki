import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignUp() {
    return (
        <div className="mr-60 flex w-full justify-center">
            <Card className="w-200">
                <form action={signUpAction}>
                    <Field className="">
                        <FieldLabel>email</FieldLabel>
                        <Input name="email" required></Input>
                    </Field>
                    <Field className="">
                        <FieldLabel>name</FieldLabel>
                        <Input name="name" required></Input>
                    </Field>
                    <Field className="">
                        <FieldLabel>password</FieldLabel>
                        <Input name="password" required></Input>
                    </Field>
                    <Button type="submit">Sign Up!</Button>
                </form>
            </Card>
        </div>
    );
}
