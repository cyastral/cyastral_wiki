"use client";
import { usePlayerStore } from "@/store/player-store";
import { Button } from "../ui/button";
import { ListMusic, Pause, Play, SkipBack, SkipForward, Trash2, Volume1 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { timeFormat } from "@/lib/timeFormat";

import SongCard from "../SongCard";
import { PlayList } from "./PlayList";

export default function BottomBar() {
    const { queue, currentIndex, isPlaying, volume, currentTime, isSeeking, duration, palyMode } = usePlayerStore(
        useShallow((state) => ({
            queue: state.queue,
            currentIndex: state.currentIndex,
            isPlaying: state.isPlaying,
            volume: state.volume,
            currentTime: state.currentTime,
            isSeeking: state.isSeeking,
            duration: state.duration,
            palyMode: state.playMode,
        })),
    );

    const { togglePlay, nextSong, prevSong, setVolume, setIsSeeking, setTimeUpdate, setSeekTarget, switchPlayMode } =
        usePlayerStore((state) => state.actions);
    const song = queue[currentIndex];
    return (
        <div className="bg-background/90 border-border fixed bottom-0 left-0 flex h-24 w-full items-center justify-between border-t-2 px-4 backdrop-blur-md">
            <div className="flex w-1/3 items-center justify-start gap-3">
                <img
                    src="https://placehold.co/60x60/333/FFF?text=Music"
                    alt="1234"
                    className="rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <span className="text-md truncate">{queue[currentIndex]?.title || "Not Playing"}</span>
                    <span className="truncate text-sm">Hatsune Miku / Luo TianYi</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                    <Button className="" variant="ghost" size="padIcon" onClick={prevSong}>
                        <SkipBack className="size-5" />
                    </Button>
                    <Button className="rounded-full" size="padIcon" variant="default" onClick={togglePlay}>
                        {isPlaying ? <Pause /> : <Play />}
                    </Button>
                    <Button className="" variant="ghost" size="padIcon" onClick={nextSong}>
                        <SkipForward className="size-5" />
                    </Button>
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                    <span className="w-10 text-right">{timeFormat(currentTime)}</span>
                    <input
                        className="flex-1"
                        type="range"
                        value={currentTime}
                        max={duration}
                        onMouseDown={() => {
                            setIsSeeking(true);
                        }}
                        onMouseUp={(e) => {
                            setIsSeeking(false);
                            setSeekTarget(Number(e.currentTarget.value));
                        }}
                        onChange={(e) => {
                            setTimeUpdate(Number(e.target.value));
                        }}
                    />
                    <span className="w-10 text-left">{timeFormat(duration)}</span>
                </div>
            </div>
            <div className="flex w-1/3 items-center justify-end gap-2">
                <div className="flex w-36 items-center">
                    <Volume1 className="shrink-0" />
                    <input
                        className="flex-1"
                        type="range"
                        min={0}
                        max={1.0}
                        step={0.01}
                        value={volume}
                        onChange={(e) => {
                            setVolume(Number(e.target.value));
                        }}
                    />
                </div>
                <PlayList />
                <Button onClick={switchPlayMode} variant="ghost" className="w-20">
                    {palyMode}
                </Button>
            </div>
        </div>
    );
}
