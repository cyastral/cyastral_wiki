"use client";
import { usePlayerStore } from "@/store/player-store";
import { Button } from "../ui/button";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { timeFormat } from "@/lib/timeFormat";

export default function BottomBar() {
    const {
        queue,
        currentIndex,
        isPlaying,
        volume,
        currentTime,
        isSeeking,
        duration,
        palyMode
    } = usePlayerStore(
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

    const {
        togglePlay,
        nextSong,
        prevSong,
        setVolume,
        setIsSeeking,
        setTimeUpdate,
        setSeekTarget,
        switchPlayMode
    } = usePlayerStore((state) => state.actions);
    return (
        <div className="fixed bottom-0 left-0 flex max-h-1/8 w-full justify-center bg-gray-200">
            <div>Now Playing : {queue[currentIndex]?.name}</div>
            <Button className="m-3" onClick={prevSong}>
                <SkipBack />
            </Button>
            <Button className="m-3" onClick={togglePlay}>
                {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button className="m-3" onClick={nextSong}>
                <SkipForward />
            </Button>
            <input
                type="range"
                min={0}
                max={1.0}
                step={0.01}
                value={volume}
                onChange={(e) => {
                    setVolume(Number(e.target.value));
                }}
            />
            <input
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
            <div>
                {queue.map((song, index) => (
                    <div key={index}>{song.name}</div>
                ))}
            </div>
            <div>{`${timeFormat(currentTime)}:${timeFormat(duration)}`}</div>
            <Button onClick={switchPlayMode}>
                {palyMode}
            </Button>
        </div>
    );
}
