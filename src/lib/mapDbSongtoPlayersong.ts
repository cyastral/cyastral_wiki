import type { Prisma } from "@prisma/client";
import { AppSong, AppSinger } from "./types/music";

type DbSong = Prisma.SongGetPayload<{ include: { singers: true } }>;

export function mapDbSongtoPlayerSong(DbSong: DbSong): AppSong {
    return {
        title: DbSong.songName,
        audioUrl: DbSong.audioUrl,
        id: DbSong.id,
        singers:
            DbSong.singers && DbSong.singers.length > 0
                ? DbSong.singers.map((s) => ({
                      id: s.id,
                      name: s.name,
                  }))
                : [],
    };
}
