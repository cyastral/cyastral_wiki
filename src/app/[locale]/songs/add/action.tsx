'use server'
import { getPrisma } from "@/lib/prisma";

export async function addSongAction(prevState: any, formData: FormData) {
    const Prisma = await getPrisma();

    const songName = formData.get('songName')?.toString();
    const selectedSingers = formData.getAll('singers').map(id => parseInt(id.toString()));

        if(!songName || songName.trim().length === 0) {
            return { error : "Songname is required"}
        } else if(selectedSingers.length === 0) {
            return { error : "At least one singer is required"}
        }
        try {
            await Prisma.song.create({
                data: {
                    song_name: songName,
                    singer: {
                        connect: selectedSingers.map((id) => ({id: id}))
                    }
                }
            })
            return { message : "Add song success!"}
        } catch (error) {
            return { error : error?.toString()}
        }
}

