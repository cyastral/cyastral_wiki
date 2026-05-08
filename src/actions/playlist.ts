"use server";

import { getPrisma } from "@/lib/prisma";
import { AppSong } from "@/lib/types/music";

export async function createPlaylist(title: string, isPublic?: boolean) {
    const prisma = await getPrisma();
    const newPlaylist = await prisma.playlist.create({
        data: {
            title: title,
            isPublic: isPublic,
        },
    });
    return newPlaylist.id;
}
export async function addSongToPlaylist(playlistId: number, songId: number) {
    const prisma = await getPrisma();

    const lastOrder = await prisma.playlistSong.findFirst({
        where: {
            playlistId: playlistId,
        },
        orderBy: { order: "desc" },
        select: { order: true },
    });

    const targetOrder = lastOrder ? lastOrder.order + 1 : 1;

    const newLog = await prisma.playlistSong.create({
        data: {
            playlistId: playlistId,
            songId: songId,
            order: targetOrder,
        },
    });
    return newLog;
}

export async function getPlaylist(playlistId: number) {
    const prisma = await getPrisma();
    const Result = await prisma.playlist.findUnique({
        where: {
            id: playlistId,
        },
        include: {
            songs: {
                orderBy: {
                    order: "desc",
                },
                include: {
                    song: {
                        include: {
                            singers: true,
                        },
                    },
                },
            },
        },
    });
    if (!Result) {
        return null;
    }

    return {
        ...Result,
        songs: Result.songs.map((s) => {
            const song: AppSong = {
                id: s.song.id,
                title: s.song.songName,
                audioUrl: s.song.audioUrl,
                singers: s.song.singers,
            };
            return {
                song,
            };
        }),
    };
}

export async function getAllPlaylist() {
    const prisma = await getPrisma();

    const AllPlayList = await prisma.playlist.findMany();

    return AllPlayList;
}
