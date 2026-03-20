import { Link } from "@/i18n/navigation";
import { List, Search, Plus, Ghost } from "lucide-react";
import  SearchBox  from "./_components/SearchBox";
import { Button } from "../ui/button";


export default function NavBar() {
    return (
        <div>
            <header className="h-14">
                <div className="items-center justify-between px-4 flex h-full">
                    <Link href="/" className="block rounded-md p-2 hover:bg-accent group">
                        <List className="group-hover:scale-125 transition-transform duration-125"/>
                    </Link>

                    <div>
                        <SearchBox />
                    </div>

                    <Link href="/songs/add" className="rounded-md p-2 hover:bg-accent">
                        <Plus />
                    </Link>

                </div>
            </header>
        </div>

        
    )
}
