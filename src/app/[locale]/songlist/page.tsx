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
            singer: true,
        },
        where: {
            song_name: {    
                contains: query || "",
            },
        },
    });
    
    return(
        <>
            <div>
                {songs.map((song) => (
                    <SongCard key={song.id} songName={song.song_name} singer={song.singer.map((singer)=> singer.name.toString()).join(", ")} />
                ))}
            </div>
        </>
    )
}