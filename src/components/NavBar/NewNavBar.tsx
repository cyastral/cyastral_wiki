import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import  SearchBox  from "./_components/SearchBox";

export default function NewNavBar() {
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