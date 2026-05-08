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
import { Pause, Play, PlayIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { AppSong } from "@/lib/types/music";
import { usePlayerStore } from "@/store/player-store";
import { useShallow } from "zustand/react/shallow";
import { AnimatePresence, motion, Variants } from "motion/react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "./ui/context-menu";
import { usePlaylistStore } from "@/store/playlist-store";
import { addSongToPlaylist } from "@/actions/playlist";

interface SongProps {
    song: AppSong;
    variant?: "default" | "queue";
}

export default function SongCard({ variant = "default", ...restProps }: SongProps) {
    if (variant === "default") return <DefaultSongCard {...restProps} />;
    else return <QueueSongCard {...restProps} />;
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

function QueueSongCard({ song }: SongProps) {
    const { playSong, togglePlay, removeSong } = usePlayerStore((state) => state.actions);

    const { isPlaying, isActive } = usePlayerStore(
        useShallow((state) => ({
            isPlaying: state.isPlaying,
            isActive: state.queue[state.currentIndex]?.id === song.id,
        })),
    );

    const playlists = usePlaylistStore((state) => state.playlists);

    const handleAction = () => {
        if (isActive) {
            togglePlay();
        } else {
            playSong(song);
        }
    };
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <motion.div
                    className="hover:bg-accent flex gap-1 rounded-lg p-1 select-none"
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.03 }}
                    onDoubleClick={(e) => {
                        handleAction();
                        console.log("双击");
                    }}
                >
                    <button
                        className="relative size-16 shrink-0 rounded-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction();
                            console.log("单击");
                        }}
                    >
                        <img
                            src="https://placehold.co/60x60/333/FFF?text=Music"
                            className="rounded-md"
                            alt={song.title}
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            {isActive && isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white" />}
                        </div>
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col py-2">
                        <span className="text-foreground truncate text-sm select-none">{song.title}</span>
                    </div>
                    <button
                        className="relative shrink-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeSong(song.id);
                        }}
                    >
                        <Trash2></Trash2>
                    </button>
                </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => playSong(song)}>播放</ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>添加到歌单</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        {playlists.map((s) => (
                            <ContextMenuItem key={s.id} onClick={() => addSongToPlaylist(s.id, song.id)}>添加到歌单{s.id}</ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    );
}
