"use server";
import { getPrisma } from "@/lib/prisma";

export async function addsinger() {
    const prisma = await getPrisma();
    try {
        await prisma.virtualSinger.create({
            data: {
                name: "Hatsune Miku",
            },
        });
    } catch (error) {
        console.error(error);
    }
}
