import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Prisma } from "@prisma/client"
import { Play } from "lucide-react";

export type SongResponse = Prisma.SongGetPayload<{
    include:{
        singers: true;
    };
}>;

interface SongProps {
    song: SongResponse;
}

export default function SongCard({song} : SongProps) {
    return (
        <Card className="w-4/5 flex flex-row items-center hover:bg-black/10 group p-2">
            <div className="w-18 h-18 relative shrink-0">
                <img
                    src="https://placehold.co/120x120/333/FFF?text=Music"
                    alt={song.songName}
                    className="w-full h-full object-cover rounded-md"/>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10">
                    <Play className="text-white fill-white opacity-50 size-8 hover:size-10"/>
                </div>
            </div>
            
            <div className="flex flex-col ">
                <span className="text-2xl text-black">{song.songName}</span>
                <span className="text-gray-400">{song.singers.map(s => s.name).join("/")}</span>
            </div>
        </Card>
    )
}