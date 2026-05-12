import { Link } from "@/i18n/navigation";
import { List, Search, Plus, Ghost, User } from "lucide-react";
import SearchBox from "./_components/SearchBox";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NavBar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return (
        <div>
            <header className="h-navbar">
                <div className="flex h-full items-center justify-between px-4">
                    <Link href="/" className="hover:bg-accent group block rounded-md p-2">
                        <List className="transition-transform duration-125 group-hover:scale-125" />
                    </Link>

                    <div>
                        <SearchBox />
                    </div>

                    <div className="flex">
                        <Link href="/songs/add" className="hover:bg-accent rounded-md p-2">
                            <Plus />
                        </Link>
                        <Link href={session ? "/user" : "/signin"} className="hover:bg-accent rounded-md p-2">
                            <User />
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    );
}
