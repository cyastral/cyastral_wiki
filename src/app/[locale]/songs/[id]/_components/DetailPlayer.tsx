"use client";

import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/player-store";
import type { Song as PlayerSong } from "@/store/player-store";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DetailPlayer({ song }: { song: PlayerSong }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekTime, setSeekTime] = useState(0);
    const [volume, setVolume] = useState(0.2);
    const player = usePlayerStore((state) => state);

    //格式化时间
    function formatTime(sec: number) {
        if (!sec) return "0:00";
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        if (h > 0)
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    /*
    //创建audio对象,绑定监听
    useEffect(() => {
        const audio = new Audio(src);

        audioRef.current = audio;
        audio.volume = volume;
        const onLoadedMetadata = () => setDuration(audio.duration || 0);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
        const onPlay = () => setPaused(false);
        const onPause = () => setPaused(true);

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);

        return() => {
            audio.pause();    
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);    
            audioRef.current = null;
        }
    },[src]);
    */

    async function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
            } catch (e) {
                console.error(e);
            }
        } else {
            audio.pause();
        }
    }

    const handlePlay = () => {
        player.actions.playSong(song);
    };

    return (
        <div>
            <div className="min-h-40 rounded-xl border-3 border-red-200 p-3">
                <Button onClick={togglePlay} size="icon">
                    {paused ? <Play /> : <Pause />}
                </Button>
                <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={isSeeking ? seekTime : currentTime}
                    onPointerDown={() => {
                        setIsSeeking(true);
                        setSeekTime(currentTime);
                    }}
                    onPointerUp={() => {
                        if (audioRef.current)
                            audioRef.current.currentTime = seekTime;
                        setIsSeeking(false);
                    }}
                    onChange={(e) => {
                        setSeekTime(Number(e.target.value));
                    }}
                    disabled={!duration}
                    className="w-4/5"
                />
                <div>
                    {formatTime(isSeeking ? seekTime : currentTime)} /{" "}
                    {formatTime(duration)}
                </div>

                <div>
                    <input
                        type="range"
                        min={0}
                        max={1.0}
                        step={0.01}
                        value={volume}
                        onChange={(e) => {
                            setVolume(Number(e.target.value));
                            if (audioRef.current) {
                                audioRef.current.volume = Number(
                                    e.target.value,
                                );
                            }
                        }}
                        className="w-24"
                    />
                </div>

                <div>
                    <Button onClick={handlePlay}>addsong to global list</Button>
                </div>
            </div>
        </div>
    );
}
