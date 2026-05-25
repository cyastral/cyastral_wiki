export const dynamic = "force-dynamic";
import SongCard from "@/components/SongCard";
import { mapDbSongtoPlayerSong } from "@/lib/mapDbSongtoPlayersong";
import { getPrisma } from "@/lib/prisma";

export default async function SongList({
    searchParams,
}: {
    searchParams: Promise<{ query: string }>;
}) {
    const prisma = await getPrisma();
    const { query } = await searchParams;
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

    const appSong = songs.map((s) => mapDbSongtoPlayerSong(s));
    return (
        <>
            <div className="flex w-full flex-col items-center">
                {appSong.map((song) => (
                    <SongCard key={song.id} song={song} variant="default"/>
                ))}
            </div>
        </>
    );
}
