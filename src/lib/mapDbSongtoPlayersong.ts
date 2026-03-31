import type { Song as PrismaSong } from "@prisma/client";

export function mapDbSongtoPlayerSong(dbSong: PrismaSong) {
    return {
        name: dbSong.songName,
        audioUrl: dbSong.audioUrl,
        id: dbSong.id,
    };
}
