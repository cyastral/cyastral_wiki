"use client";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { AppSong } from "@/lib/types/music";

export type PlayMode = "list-order" | "list-loop" | "single-loop" | "shuffle";

export interface PlayerState {
    //持久化
    queue: AppSong[];
    currentIndex: number;
    volume: number;
    playMode: PlayMode;
    shuffledIndexQueue: number[];

    //非持久化
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isSeeking: boolean;
    seekTarget: number | null;
}

export interface PlayerActions {
    playSong: (song: AppSong) => void;
    nextSong: () => void;
    prevSong: () => void;
    togglePlay: () => void;
    switchPlayMode: () => void;
    autoNext: () => void;
    removeSong: (id: number) => void;
    removeList: () => void;

    setVolume: (volume: number) => void;
    setTimeUpdate: (time: number) => void;
    setDuration: (time: number) => void;
    setIsSeeking: (isSeeking: boolean) => void;
    setSeekTarget: (time: number | null) => void;

    _rebuildShuffleQueue: () => void;
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
    shuffledIndexQueue: [],
};

//洗牌算法
function shuffle<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

/*
    shuffle模式下，保留currentIndex和列表数组，并用以控制播放。
    维护一个shuffledIndexQueue，保存打乱后的Index映射，作为切歌时计算currentIndex的基准。
*/

// 工厂函数
export const createPlayerStore = (initState: PlayerState = defaultInitState) => {
    return createStore<PlayerStore>()(
        persist(
            (set, get) => ({
                ...initState,
                actions: {
                    _rebuildShuffleQueue: () => {
                        const { queue, playMode, currentIndex } = get();
                        const queueLength = queue.length;
                        if (playMode !== "shuffle" || queueLength === 0) {
                        }

                        //建立真实queue的位置索引
                        const queueIndex = Array.from({ length: queueLength }, (_, i) => i);

                        //剔除当前播放
                        const filtedQueueIndex = queueIndex.filter((i) => i !== currentIndex);

                        //打乱后把当前播放放回首位
                        const shuffledQueue = [currentIndex, ...shuffle(filtedQueueIndex)];

                        //存入打乱的影子列表
                        set({ shuffledIndexQueue: shuffledQueue });
                    },
                    playSong: (song) => {
                        const state = get();
                        const { queue, playMode } = state;

                        //查找是否已有该歌曲,没有返回-1
                        let targetIndex = queue.findIndex((s) => s.id === song.id);
                        //处理播放新歌逻辑
                        if (targetIndex == -1) {
                            const newQueue = [...queue, song];
                            targetIndex = newQueue.length - 1; //新插入的歌总在列表最后
                            set({ queue: newQueue });
                        }

                        //无论是否插入新歌，同步播放状态
                        set({
                            currentIndex: targetIndex,
                            isPlaying: true,
                            seekTarget: 0,
                        });

                        if (playMode === "shuffle") {
                            get().actions._rebuildShuffleQueue();
                        }
                    },

                    nextSong: () => {
                        const state = get();
                        const { queue, currentIndex, playMode, shuffledIndexQueue } = state;
                        const listLength = queue.length;

                        if (listLength === 0) return {};
                        if (listLength === 1) {
                            set({ seekTarget: 0, isPlaying: true });
                            return;
                        }

                        let newIndex = 0;

                        //处理shuffle下的切换逻辑
                        if (playMode === "shuffle") {
                            //shadow序列里找到现在播放的index
                            let shadowIndex = shuffledIndexQueue.indexOf(currentIndex);

                            if (shadowIndex === -1) shadowIndex = 0;

                            //shadow序列里的下一首index
                            const newShadowIndex = (shadowIndex + 1) % listLength;

                            //查询下一首对应实际序列的index,并写入准备更新
                            newIndex = state.shuffledIndexQueue[newShadowIndex];
                        } else {
                            //非shuffle逻辑
                            newIndex = (currentIndex + 1) % listLength;
                        }

                        //统一处理提交
                        set({
                            currentIndex: newIndex,
                            isPlaying: true,
                            seekTarget: 0,
                        });
                    },

                    autoNext: () => {
                        const state = get();
                        const { queue, currentIndex, playMode, shuffledIndexQueue } = state;
                        const listLength = queue.length;

                        if (state.queue.length === 0) return {};

                        let newIndex = currentIndex;

                        switch (playMode) {
                            case "list-loop":
                                newIndex = (currentIndex + 1) % listLength;
                                break;
                            case "list-order":
                                newIndex = (currentIndex + 1) % listLength;
                                if (newIndex === 0) {
                                    set({ isPlaying: false, currentTime: 0 });
                                    return;
                                }
                                break;
                            case "single-loop":
                                return;
                            case "shuffle":
                                const shadowIndex = shuffledIndexQueue.indexOf(currentIndex);
                                const newShadowIndex = (shadowIndex + 1) % listLength;
                                const realQueueIndex = shuffledIndexQueue[newShadowIndex];
                                newIndex = realQueueIndex;
                        }
                        //统一处理提交
                        set({
                            currentIndex: newIndex,
                            isPlaying: true,
                            seekTarget: 0,
                        });
                    },
                    // 💡 在 PlayerActions 中
                    prevSong: () => {
                        const state = get();
                        const { queue, currentIndex, playMode, shuffledIndexQueue } = state;
                        const listLength = queue.length;

                        if (listLength === 0) return;
                        if (listLength === 1) {
                            set({
                                seekTarget: 0,
                                isPlaying: true,
                            });
                            return;
                        }

                        let newIndex = 0;

                        if (playMode === "shuffle") {
                            let shadowIndex = shuffledIndexQueue.indexOf(currentIndex);

                            if (shadowIndex === -1) shadowIndex = 0;

                            const newShadowIndex = (shadowIndex - 1 + listLength) % listLength;

                            newIndex = shuffledIndexQueue[newShadowIndex];
                        } else {
                            newIndex = (currentIndex - 1 + listLength) % listLength;
                        }

                        set({
                            currentIndex: newIndex,
                            isPlaying: true,
                            seekTarget: 0,
                        });
                    },

                    removeSong: (id) => {
                        const state = get();
                        const { queue, currentIndex, playMode } = state;
                        const listLength = queue.length;
                        let newIndex = currentIndex;
                        const targetIndex = queue.findIndex((s) => s.id === id);
                        if (targetIndex === -1) return;
                        const newQueue = queue.filter((song) => song.id !== id);
                        if (newQueue.length === 0) {
                            state.actions.removeList();
                            return;
                        }
                        if (targetIndex < currentIndex) {
                            newIndex = currentIndex - 1;
                        } else if (targetIndex === currentIndex) {
                            newIndex = currentIndex;
                            if (currentIndex === listLength - 1) newIndex = 0;
                        }

                        set({
                            queue: newQueue,
                            currentIndex: newIndex,
                        });
                    },

                    removeList: () => {
                        set({
                            queue: [],
                            currentIndex: 0,
                            isPlaying: false,
                            currentTime: 0,
                            shuffledIndexQueue: [],
                        });
                    },

                    togglePlay: () => {
                        set((state) => ({ isPlaying: !state.isPlaying }));
                    },

                    switchPlayMode: () => {
                        const state = get();

                        const modes: PlayMode[] = ["list-order", "list-loop", "single-loop", "shuffle"];
                        const nowIndex = modes.indexOf(state.playMode);
                        const newIndex = (nowIndex + 1) % modes.length;
                        const nextMode = modes[newIndex];

                        // 处理空列表
                        if (state.queue.length === 0 || state.currentIndex === undefined) {
                            set({ playMode: nextMode });
                            return;
                        }

                        set({ playMode: nextMode });

                        //处理shuffle模式
                        if (nextMode === "shuffle") {
                            get().actions._rebuildShuffleQueue();
                        }
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
                    shuffledIndexQueue: state.shuffledIndexQueue,
                }),
            },
        ),
    );
};

// 创建 Context
export const PlayerStoreContext = createContext<ReturnType<typeof createPlayerStore> | null>(null);

// 导出 Provider 组件
export const PlayerStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<ReturnType<typeof createPlayerStore> | null>(null);

    //如果没有store，创建一个
    if (!storeRef.current) {
        storeRef.current = createPlayerStore();
    }

    return <PlayerStoreContext.Provider value={storeRef.current}>{children}</PlayerStoreContext.Provider>;
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
        throw new Error("usePlayerStoreApi 必须在 PlayerStoreProvider 内部使用");
    }

    return storeContext;
}
