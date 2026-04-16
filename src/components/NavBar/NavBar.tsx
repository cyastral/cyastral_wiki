import { Link } from "@/i18n/navigation";
import { List, Search, Plus, Ghost } from "lucide-react";
import SearchBox from "./_components/SearchBox";
import { Button } from "../ui/button";

export default function NavBar() {
    return (
        <div>
            <header className="h-navbar">
                <div className="flex h-full items-center justify-between px-4">
                    <Link
                        href="/"
                        className="hover:bg-accent group block rounded-md p-2"
                    >
                        <List className="transition-transform duration-125 group-hover:scale-125" />
                    </Link>

                    <div>
                        <SearchBox />
                    </div>

                    <Link
                        href="/songs/add"
                        className="hover:bg-accent rounded-md p-2"
                    >
                        <Plus />
                    </Link>
                </div>
            </header>
        </div>
    );
}
