import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ListMusic, Pause, Play, Trash2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useShallow } from "zustand/react/shallow";
import SongCard from "../SongCard";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
export function PlayList() {
    const { queue, removeList } = usePlayerStore(
        useShallow((state) => ({
            queue: state.queue,
            removeList: state.actions.removeList,
        })),
    );

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="padIcon">
                    <ListMusic className="size-5" />
                </Button>
            </PopoverTrigger>
            <AnimatePresence>
                {isOpen && (
                    <PopoverContent side="top" align="end" sideOffset={24} className="w-100" forceMount asChild>
                        <motion.div
                            className="flex flex-col"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex w-full items-center justify-between">
                                <span className="text-lg">播放列表({queue.length})</span>
                                <Button variant="ghost" size="padIcon" className="" onClick={removeList}>
                                    <Trash2 className="size-6"></Trash2>
                                </Button>
                            </div>
                            <div>
                                {queue.map((song) => (
                                    <SongCard key={song.id} song={song} variant="playList" />
                                ))}
                            </div>
                        </motion.div>
                    </PopoverContent>
                )}
            </AnimatePresence>
        </Popover>
    );
}
