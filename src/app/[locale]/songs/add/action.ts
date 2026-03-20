'use server'
import { getPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { formSchema, FormType } from "./schema";

type ActionState = {
    success: boolean;
    message: string;
}

export async function submitSong(formdata: FormType): Promise<ActionState> {
    const validatedData = formSchema.safeParse(formdata);

    if (!validatedData.success){
        return {
            success: false,
            message: "格式有误"
        }
    }

    const prisma = await getPrisma();
    const {songName, link, singers} = validatedData.data;

    try {
        await prisma.song.create({
        data:{
            songName: songName,
            singers: {
                connect:singers.map((singerID) => ({
                    id: Number(singerID)
                }))
            },  
            links: {
                create:[
                    {url: link}
                ]
            },
            source: "Manual",
            sourceId: "114514"
        }
    })
    return {
        success:true,
        message:"添加成功！"
    }
    } catch(e){
        if (e instanceof Prisma.PrismaClientKnownRequestError){
            if (e.code == "P2002") {
                return {
                    success: false,
                    message: "数据库中已有同名歌曲"
                }
            } else {
                return {
                    success: false,
                    message: e.message
                }
            }
        } else {
            return {
                success: false,
                message: "数据库未知错误"
            }
        }
    }

}

