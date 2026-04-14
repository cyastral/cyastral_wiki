import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ListMusic, Pause, Play, Trash2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useShallow } from "zustand/react/shallow";
import SongCard from "../SongCard";
export function PlayList() {
    const { queue, removeList } = usePlayerStore(
        useShallow((state) => ({
            queue: state.queue,
            removeList: state.actions.removeList
        })),
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="padIcon" >
                    <ListMusic className="size-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" sideOffset={24} className="w-100">
                <div className="flex flex-col">
                    <div className="flex w-full items-center justify-between">
                        <span className="text-lg">播放列表({queue.length})</span>
                        <Button variant="ghost" size="padIcon" className="" onClick={removeList}>
                            <Trash2 className="size-6"></Trash2>
                        </Button>
                    </div>
                    <div>
                        {queue.map((song, index) => (
                            <SongCard key={index} song={song} variant="playList" />
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
