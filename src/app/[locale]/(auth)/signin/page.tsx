import { signInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignIn() {
    return (
        <div className="mr-60 flex w-full justify-center">
            <Card className="w-200">
                <form action={signInAction}>
                    <Field className="">
                        <FieldLabel>email</FieldLabel>
                        <Input name="email" required></Input>
                    </Field>
                    <Field className="">
                        <FieldLabel>password</FieldLabel>
                        <Input name="password" required></Input>
                    </Field>
                    <Button type="submit">Sign In!</Button>
                </form>
            </Card>
        </div>
    );
}
