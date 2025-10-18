import { Link } from "@/i18n/navigation";
import { List, Search } from "lucide-react";
import  SearchBox  from "./_components/SearchBox";

export default function NavBar() {
    return (
        <div>
            <header className=" h-14">
                <div className="items-center justify-between px-4 flex h-full">
                    <Link href="/" className="">
                        <List />
                    </Link>

                    <div>
                        <SearchBox />
                    </div>

                    <div>
                        <List />
                    </div>
                </div>
            </header>
        </div>

        
    )
}