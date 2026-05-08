"use client";

import { getAllPlaylist } from "@/actions/playlist";
import { Link } from "@/i18n/navigation";
import { Prisma } from "@prisma/client";
import { Play } from "lucide-react";

type playlist = Prisma.PromiseReturnType<typeof getAllPlaylist>[number]

export default function PlayListCard({ item }: { item: playlist }) {
    return (
        <Link href={`/playlist/${item.id}`}>
            <div className="group hover:bg-accent flex flex-1 items-center gap-2 rounded-md p-2 transition-colors duration-50">
                {/* 图片区域 */}
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                    <img
                        src="https://placehold.co/50x50/333/FFF?text=PLayList"
                        className="size-full object-cover transition-all duration-50 group-hover:brightness-80"
                    ></img>
                    <Play
                        size={20}
                        className="absolute fill-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    ></Play>
                </div>

                {/* 文字区域 */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="font-600 text-md truncate">ID {item.id}</span>
                    <span className="text-muted-foreground truncate text-sm">歌单</span>
                </div>
            </div>
        </Link>
    );
}
