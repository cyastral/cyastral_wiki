"use client";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export interface Song {
    name: string;
    audioUrl: string | null;
    id: number;
}

export type PlayMode = "list-order" | "list-loop" | "single-loop" | "random";

export interface PlayerState {
    //持久化
    queue: Song[];
    currentIndex: number;
    volume: number;
    playMode: PlayMode;

    //非持久化
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isSeeking: boolean;
    seekTarget: number | null;
}

export interface PlayerActions {
    playSong: (song: Song) => void;
    nextSong: () => void;
    prevSong: () => void;
    togglePlay: () => void;
    switchPlayMode: () => void;
    autoNext: () => void;

    setVolume: (volume: number) => void;
    setTimeUpdate: (time: number) => void;
    setDuration: (time: number) => void;
    setIsSeeking: (isSeeking: boolean) => void;
    setSeekTarget: (time: number | null) => void;
}

export type PlayerStore = PlayerState & { actions: PlayerActions };

const defaultInitState: PlayerState = {
    playMode: "list-order",
    queue: [],
    currentIndex: 0,
    volume: 0.2,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isSeeking: false,
    seekTarget: null,
};

// 工厂函数
export const createPlayerStore = (
    initState: PlayerState = defaultInitState,
) => {
    return createStore<PlayerStore>()(
        persist(
            (set) => ({
                ...initState,
                actions: {
                    playSong: (song) => {
                        set((state) => {
                            //查找是否已有该歌曲,没有返回-1
                            const exitingIndex = state.queue.findIndex(
                                (s) => s.id === song.id,
                            );
                            if (exitingIndex == -1) {
                                const newQueue = [...state.queue, song];
                                return {
                                    queue: newQueue,
                                    currentIndex: newQueue.length - 1,
                                    isPlaying: true,
                                };
                            }
                            return {
                                currentIndex: exitingIndex,
                                isPlaying: true,
                            };
                        });
                    },

                    nextSong: () => {
                        set((state) => {
                            const playMode = state.playMode;
                            const listLength = state.queue.length;
                            const nowIndex = state.currentIndex;
                            if (state.queue.length === 0) return {};
                            let newIndex = 0;
                            newIndex = (nowIndex + 1) % listLength;
                            return { currentIndex: newIndex, isPlaying: true };
                        });
                    },

                    autoNext: () => {
                        set((state) => {
                            const playMode = state.playMode;
                            const listLength = state.queue.length;
                            const nowIndex = state.currentIndex;
                            if (state.queue.length === 0) return {};
                            let newIndex = 0;
                            switch (playMode) {
                                case "list-loop":
                                    newIndex = (nowIndex + 1) % listLength;
                                    break;
                                case "list-order":
                                    newIndex = (nowIndex + 1) % listLength;
                                    if (newIndex === 0) {
                                        return {
                                            isPlaying: false,
                                        };
                                    }
                                    break;
                                case "single-loop":
                                    return {};
                                    break;
                                case "random":
                                    newIndex = Math.floor(
                                        Math.random() * listLength,
                                    );
                                    break;
                            }
                            return {
                                currentIndex: newIndex,
                                isPlaying: true,
                            };
                        });
                    },
                    prevSong: () => {
                        set((state) => {
                            let newIndex = 0;
                            if (state.currentIndex == 0) {
                                newIndex = state.queue.length - 1;
                            } else {
                                newIndex = state.currentIndex - 1;
                            }
                            return {
                                currentIndex: newIndex,
                                isPlaying: true,
                            };
                        });
                    },

                    togglePlay: () => {
                        set((state) => ({ isPlaying: !state.isPlaying }));
                    },

                    switchPlayMode: () => {
                        set((state) => {
                            const modes: PlayMode[] = [
                                "list-order",
                                "list-loop",
                                "single-loop",
                                "random",
                            ];
                            const nowIndex = modes.indexOf(state.playMode);
                            const newIndex = (nowIndex + 1) % modes.length;
                            return {
                                playMode: modes[newIndex],
                            };
                        });
                    },
                    setVolume(volume) {
                        set(() => ({ volume: volume }));
                    },
                    //更新时间,
                    setTimeUpdate(time) {
                        set(() => {
                            return { currentTime: time };
                        });
                    },
                    setDuration(time) {
                        set(() => ({ duration: time }));
                    },
                    setIsSeeking(isSeeking) {
                        set(() => ({ isSeeking: isSeeking }));
                    },
                    setSeekTarget(time) {
                        set(() => ({ seekTarget: time }));
                    },
                },
            }),
            {
                name: "player-storage",
                partialize: (state) => ({
                    queue: state.queue,
                    volume: state.volume,
                    currentIndex: state.currentIndex,
                    playMode: state.playMode,
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
// 返回普通api
export function usePlayerStoreApi() {
    const storeContext = useContext(PlayerStoreContext);

    if (!storeContext) {
        throw new Error(
            "usePlayerStoreApi 必须在 PlayerStoreProvider 内部使用",
        );
    }

    return storeContext;
}
