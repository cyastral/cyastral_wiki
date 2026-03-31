"use client";
import { usePlayerStore } from "@/store/player-store";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";

export default function BottomBar() {
    const queue = usePlayerStore((state) => state.queue);
    const currentIndex = usePlayerStore((state) => state.currentIndex);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const togglePlay = usePlayerStore((state) => state.togglePlay);
    return (
        <div className="fixed bottom-0 left-0 flex max-h-1/8 w-full justify-center bg-gray-200">
            <div>Now Playing : {queue[currentIndex]?.name}</div>
            <Button className="m-3" onClick={togglePlay}>
                {isPlaying ? <Pause /> : <Play />}
            </Button>
            <div>
                {queue.map((song, index) => (
                    <div>{song.name}</div>
                ))}
            </div>
        </div>
    );
}
