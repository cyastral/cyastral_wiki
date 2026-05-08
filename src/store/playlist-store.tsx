"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { Prisma } from "@prisma/client";
import { getAllPlaylist } from "@/actions/playlist";

type Playlist = Prisma.PromiseReturnType<typeof getAllPlaylist>[number];

export interface PlaylistState {
    playlists: Playlist[];
}

export interface PlayListAction {
    updateAllPlaylist: (data: Playlist[]) => void;
}

export type PlaylistStore = PlaylistState & { actions: PlayListAction };

const defaultInitState: PlaylistState = {
    playlists: [],
};

export const createPlaylistStore = (initState: PlaylistState = defaultInitState) => {
    return createStore<PlaylistStore>()((set, get) => ({
        ...initState,
        actions: {
            updateAllPlaylist: (data) => {
                set({ playlists: data });
            },
        },
    }));
};

export const PlaylistStoreContext = createContext<ReturnType<typeof createPlaylistStore> | null>(null);

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<ReturnType<typeof createPlaylistStore> | null>(null);

    if (!storeRef.current) {
        storeRef.current = createPlaylistStore();
    }

    return <PlaylistStoreContext.Provider value={storeRef.current}>{children}</PlaylistStoreContext.Provider>;
};

export function usePlaylistStore<T>(selector: (store: PlaylistStore) => T): T {
    const storeContext = useContext(PlaylistStoreContext);
    if (!storeContext) {
        throw new Error("usePlayerStore 必须在 Provider 内部使用");
    }
    return useStore(storeContext, selector);
}

export function usePlaylistApi() {
    const storeContext = useContext(PlaylistStoreContext);

    if (!storeContext) {
        throw new Error("usePlayerStoreApi 必须在 Provider 内部使用");
    }

    return storeContext;
}
