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
import { Play } from "lucide-react";
import { Button } from "./ui/button";

export type SongResponse = Prisma.SongGetPayload<{
    include: {
        singers: true;
    };
}>;

interface SongProps {
    song: SongResponse;
}

export default function SongCard({ song }: SongProps) {
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
                        alt={song.songName}
                        className="h-full w-full rounded-md object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100">
                        <Play className="size-8 fill-white text-white opacity-50 hover:size-10" />
                    </div>
                </button>
            </div>

            <div className="flex flex-col">
                <Link
                    className="text-2xl text-black after:absolute after:inset-0"
                    href={`/songs/${song.id}`}
                >
                    {song.songName}
                </Link>
                <span className="text-gray-400">
                    {song.singers.map((s) => s.name).join("/")}
                </span>
            </div>
        </Card>
    );
}
