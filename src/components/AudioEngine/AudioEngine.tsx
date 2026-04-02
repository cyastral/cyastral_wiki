"use client";

import { usePlayerStore, usePlayerStoreApi } from "@/store/player-store";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export function AudioEngine() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentLoadedId = useRef<number | null>(null);

    const { queue, currentIndex, isPlaying, volume, seekTarget, playMode } =
        usePlayerStore(
            useShallow((state) => ({
                queue: state.queue,
                currentIndex: state.currentIndex,
                isPlaying: state.isPlaying,
                volume: state.volume,
                seekTarget: state.seekTarget,
                playMode: state.playMode,
            })),
        );

    const { setTimeUpdate, setDuration, setSeekTarget, autoNext } =
        usePlayerStore((state) => state.actions);
    const storeApi = usePlayerStoreApi();
    //初始化
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.2;

        //绑定audio监听，同步当前时间与总长度
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", () => {
            //检查拖动状态
            if (!storeApi.getState().isSeeking) {
                setTimeUpdate(audio.currentTime);
            }
        });
        audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration);
        });

        //监听播放完毕跳转
        audio.addEventListener("ended", () => {
            autoNext();
        });
    }, []);

    //状态同步
    useEffect(() => {
        const audio = audioRef.current;
        const currentAudio = queue[currentIndex];
        if (!audio || !currentAudio) return;

        //当前播放不一致，更新当前src
        if (
            currentAudio.id != currentLoadedId.current &&
            currentAudio.audioUrl
        ) {
            audio.src = currentAudio.audioUrl;
            currentLoadedId.current = currentAudio.id;
        }

        if (isPlaying == true) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [queue, currentIndex, isPlaying]);

    //音量同步
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    //拖动跳转
    useEffect(() => {
        const audio = audioRef.current;
        if (audio && seekTarget !== null) {
            audio.currentTime = seekTarget;
            setSeekTarget(null);
        }
    }, [seekTarget]);

    //同步loop状态
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.loop = playMode === "single-loop";
        }
    }, [playMode]);
    return null;
}
