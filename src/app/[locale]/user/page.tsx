import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default async function User() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });


    if (!session) {
        return (
            <div>
                <div>未登录</div>
                <Link href={"/signup"}>SignUp</Link>
                <Link href={"/signin"}>SignIn</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div>已登录</div>
            <p>userId: {session.user.id}</p>
            <form action={signOutAction}>
                <Button type="submit">logOut</Button>
            </form>
        </div>
    );
}
