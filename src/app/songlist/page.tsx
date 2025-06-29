import SongCard from "@/components/SongCard";
import { prisma } from "@/lib/prisma";
import { Box } from "@mui/material";

export default async function SongList({
    searchParams,
} :{
    searchParams: Promise<{query : string}>,
}) {
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
            <Box sx={{ display:"flex", flexDirection:"column", gap:2, justifyContent:"center", alignItems:"center"}}>
                {songs.map((song) => (
                    <SongCard key={song.id} songName={song.song_name} singer={song.singer.map((singer)=> singer.name.toString()).join(", ")} />
                ))}
            </Box>
        </>
    )
}