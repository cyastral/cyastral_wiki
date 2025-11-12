"use server"

import { getPrisma } from "@/lib/prisma"
import { formSchema } from "./FormSchema";
import z from "zod";

export async function SubmitAction(data: z.infer<typeof formSchema>){

    const prisma = await getPrisma();
    const valiResult = formSchema.safeParse(data);
    if(!valiResult.success){
        return{
            error: "illegal data!"
        }
    }
    try{
        await prisma.vcSinger.create({
            data: valiResult.data
        })
    }
    catch(error){
        console.log(error);
        return{
            error: "something goes wrong"
        }
    }
    
}