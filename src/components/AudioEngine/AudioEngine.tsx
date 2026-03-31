"use client";

import { usePlayerStore } from "@/store/player-store";
import { useEffect, useRef, useState } from "react";

export function AudioEngine() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentLoadedId = useRef<number | null>(null);

    const queue = usePlayerStore((state) => state.queue);
    const currentIndex = usePlayerStore((state) => state.currentIndex);
    const isPlaying = usePlayerStore((state) => state.isPlaying);

    //初始化
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.2;
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
    return null;
}
