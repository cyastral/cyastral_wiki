'use client'
import { Button} from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";


export default function SearchBox(){
    const router = useRouter();
    const query = useState("");

    const handleSearch = () => {
        router.push('')
    }

    return(
        <div className="flex items-center gap-4 w-120">
            <Input></Input>
            <Button variant="ghost" onClick={handleSearch}>
                <Search className="size-6"/>
            </Button>
        </div>
    )
}