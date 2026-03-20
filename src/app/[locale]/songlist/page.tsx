export const dynamic = "force-dynamic";
import SongCard from "@/components/SongCard";
import { getPrisma } from "@/lib/prisma";


export default async function SongList({
    searchParams,
} :{
    searchParams: Promise<{query : string}>,
}) {
    const prisma = await getPrisma();
    const {query} = await searchParams;
    const songs = await prisma.song.findMany({
        include: {
            singers: true,
        },
        where: {
            songName: {    
                contains: query || "",
            },
        },
    });

    return(
        <>
            <div className="flex flex-col items-center w-full">
                {songs.map((song) => (
                    <SongCard key={song.id} song={song} />
                ))}
            </div>
        </>
    )
}