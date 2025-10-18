'use client'
import { Button} from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";


export default function SearchBox(){
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        router.push(`/songlist?query=${query}`)
    }
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    return(
        <div className="flex items-center gap-4 w-120">
            <Input value={query} onChange={handleChange}></Input>
            <Button variant="ghost" onClick={handleSearch}>
                <Search className="size-6"/>
            </Button>
        </div>
    )
}