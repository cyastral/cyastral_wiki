'use client'

import { usePlayerStore } from "@/store/player-store";
import { useEffect, useRef, useState } from "react"

export function AudioEngine() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const queue = usePlayerStore(state => state.queue);
    const currentIndex = usePlayerStore(state => state.currentIndex);
    const isPlaying = usePlayerStore(state => state.isPlaying);

    //初始化
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.2; 
    }, [])

    //监听队列变化
    useEffect(() => {
        if(!audioRef.current) return;

        const currentSong = queue[currentIndex];
        if(currentSong?.audioUrl) {
                audioRef.current.src = currentSong.audioUrl;
        }
    }, [queue, currentIndex])

    //监听播放状态
    useEffect(() => {
        const audio = audioRef.current;
        if(!audio) return;
        if(!audio.src) return;

        if(isPlaying) {
            const PlayPromise = audio.play();
            if(PlayPromise !== undefined) {
                PlayPromise.catch((error) => {
                    console.error("播放失败", error);
                })
            }
        } else {
            audio.pause();
        }
    },[isPlaying])
    return null;
}