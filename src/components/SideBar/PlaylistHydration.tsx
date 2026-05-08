"use client";

import { useEffect } from "react";
import { Prisma } from "@prisma/client";
import { getAllPlaylist } from "@/actions/playlist";
import { usePlaylistStore } from "@/store/playlist-store";

type Playlist = Prisma.PromiseReturnType<typeof getAllPlaylist>[number];

export default function PlaylistHydration({ PlaylistData }: { PlaylistData: Playlist[] }) {
    const { updateAllPlaylist } = usePlaylistStore((state) => state.actions);
    useEffect(() => {
        updateAllPlaylist(PlaylistData);
    }, []);
    return null;
}
