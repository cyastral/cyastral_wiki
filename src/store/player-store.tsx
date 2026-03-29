"use client";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export interface Song {
    name: string;
    audioUrl: string | null;
}

export interface PlayerState {
    //持久化
    queue: Song[];
    currentIndex: number;
    volume: number;

    //非持久化
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}

export interface PlayerActions {
    playSong: (song: Song) => void;
    nextSong: () => void;
    prevSong: () => void;
    togglePlay: () => void;

    setVolume: (volume: number) => void;
    seek: (time: number) => void;
}

export type PlayerStore = PlayerState & PlayerActions;

const defaultInitState: PlayerState = {
    queue: [],
    currentIndex: 0,
    volume: 0.2,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
};

// 工厂函数
export const createPlayerStore = (
    initState: PlayerState = defaultInitState,
) => {
    return createStore<PlayerStore>()(
        persist(
            (set) => ({
                ...initState,

                playSong: (song) => {
                    set((state) => {
                        const newQueue = [...state.queue, song];
                        return {
                            queue: newQueue,
                            currentIndex: newQueue.length - 1,
                            isPlaying: true,
                        };
                    });
                },
                nextSong: () => {},
                prevSong: () => {},
                togglePlay: () => {
                    set((state) => ({ isPlaying: !state.isPlaying }));
                },
                setVolume(volume) {
                    set(() => ({ volume: volume }));
                },
                seek(time) {
                    set(() => ({ currentTime: time }));
                },
            }),
            {
                name: "player-storage",
                partialize: (state) => ({
                    queue: state.queue,
                    volume: state.volume,
                    currentIndex: state.currentIndex,
                }),
            },
        ),
    );
};

// 创建 Context
export const PlayerStoreContext = createContext<ReturnType<
    typeof createPlayerStore
> | null>(null);

// 导出 Provider 组件
export const PlayerStoreProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const storeRef = useRef<ReturnType<typeof createPlayerStore> | null>(null);

    //如果没有store，创建一个
    if (!storeRef.current) {
        storeRef.current = createPlayerStore();
    }

    return (
        <PlayerStoreContext.Provider value={storeRef.current}>
            {children}
        </PlayerStoreContext.Provider>
    );
};

//自定义hook
export function usePlayerStore<T>(selector: (store: PlayerStore) => T): T {
    const storeContext = useContext(PlayerStoreContext);

    if (!storeContext) {
        throw new Error("usePlayerStore 必须在 PlayerStoreProvider 内部使用");
    }

    return useStore(storeContext, selector);
}
