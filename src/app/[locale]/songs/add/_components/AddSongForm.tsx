'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
    songname: z.string(),
})

const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
})

export function AddSongForm(){
    return (
        <div>
            <form action="">    
                
            </form>
        </div>
    )
}

