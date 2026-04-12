"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Prisma } from "@prisma/client";
import { Pause, Play, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AppSong } from "@/lib/types/music";
import { usePlayerStore } from "@/store/player-store";
import { useShallow } from "zustand/react/shallow";

interface SongProps {
    song: AppSong;
    variant?: "default" | "playList";
}

export default function SongCard({ variant = "default", ...restProps }: SongProps) {
    if (variant === "default") return <DefaultSongCard {...restProps} />;
    else return <PlayListSongCard {...restProps} />;
}

function DefaultSongCard({ song }: SongProps) {
    return (
        <Card className="group relative flex w-4/5 flex-row items-center p-2 hover:bg-black/10">
            <div className="relative h-18 w-18 shrink-0">
                <button
                    className="relative z-10"
                    onClick={(e) => {
                        console.log("Play clicked!");
                    }}
                >
                    <img
                        src="https://placehold.co/120x120/333/FFF?text=Music"
                        alt={song.title}
                        className="h-full w-full rounded-md object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100">
                        <Play className="size-8 fill-white text-white opacity-50 hover:size-10" />
                    </div>
                </button>
            </div>

            <div className="flex flex-col">
                <Link className="text-2xl text-black after:absolute after:inset-0" href={`/songs/${song.id}`}>
                    {song.title}
                </Link>
                <span className="text-gray-400">{song.singers.map((s) => s.name).join("/")}</span>
            </div>
        </Card>
    );
}

function PlayListSongCard({ song }: SongProps) {
    const { playSong, togglePlay } = usePlayerStore((state) => state.actions);

    const { isPlaying, isActive } = usePlayerStore(
        useShallow((state) => ({
            isPlaying: state.isPlaying,
            isActive: state.queue[state.currentIndex]?.id === song.id,
        })),
    );

    const handleAction = () => {
        if (isActive) {
            togglePlay();
        } else {
            playSong(song);
        }
    };
    return (
        <div
            className="hover:bg-accent flex p-2 select-none"
            onDoubleClick={(e) => {
                handleAction(); 
                console.log("双击");
            }}
        >
            <button
                className="relative"
                onClick={(e) => {
                    e.stopPropagation();
                    handleAction();
                    console.log("单击");
                }}
            >
                <img src="https://placehold.co/60x60/333/FFF?text=Music" alt={song.title} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {isActive && isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white" />}
                </div>
            </button>
            <div>
                <span className="select-none">{song.title}</span>
                <span className="select-none">artisit</span>
            </div>
        </div>
    );
}
