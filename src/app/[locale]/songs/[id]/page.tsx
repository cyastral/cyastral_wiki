import { getPrisma } from "@/lib/prisma"
import { DetailPlayer } from "./_components/DetailPlayer";
import { ProducerInfo } from "./_components/ProducerInfo";
import { SongInfo } from "./_components/SongInfo";
import { notFound } from "next/navigation";
import { mapDbSongtoPlayerSong } from "@/lib/mapDbSongtoPlayersong";

export default async function songInfoPage ({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const songID = Number(id);
    if (!Number.isInteger(songID) || songID <= 0) {
        notFound();
    }

    const prisma = await getPrisma();
    const song = await prisma.song.findUnique({
        where: {
            id: songID
        }
    })
    if(!song) notFound();

    //mapper转换
    const playerSong = mapDbSongtoPlayerSong(song);

    if(!playerSong.audioUrl) {
        return (
        <div className="space-y-6 px-4 py-2">
            <div className="rounded-xl border p-4">这首歌还没有音频文件</div>

            <div className="grid grid-cols-2 gap-6">
            <ProducerInfo />
            <SongInfo />
            </div>
        </div>
        );
    }

    return (
    <div className="space-y-6 px-4 py-2">
        <DetailPlayer song={playerSong}></DetailPlayer>

        <div className="grid grid-cols-2 gap-6">
            <ProducerInfo></ProducerInfo>
            <SongInfo></SongInfo>
        </div>

    </div>
  )
}   
