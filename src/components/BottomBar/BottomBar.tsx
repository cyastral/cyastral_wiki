"use client";
import { usePlayerStore } from "@/store/player-store";
import { Button } from "../ui/button";

export default function BottomBar() {
    const player = usePlayerStore((state) => state);
    return (
        <div className="fixed bottom-0 left-0 flex max-h-1/8 w-full justify-center bg-gray-200">
            <Button className="m-3" onClick={player.togglePlay}>
                Play
            </Button>
            <div>{player.queue.toString()}</div>
        </div>
    );
}
