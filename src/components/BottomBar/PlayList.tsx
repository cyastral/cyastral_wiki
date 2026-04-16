import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ListMusic, Pause, Play, Trash2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useShallow } from "zustand/react/shallow";
import SongCard from "../SongCard";
import { useEffect, useState } from "react";
import { AnimatePresence, Variants } from "motion/react";
import { createPortal } from "react-dom";

export function PlayList() {
    const { queue, removeList } = usePlayerStore(
        useShallow((state) => ({
            queue: state.queue,
            removeList: state.actions.removeList,
        })),
    );

    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const listVariant: Variants = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
                delayChildren: 1.5,
                staggerChildren: 0.1,
            },
        },
        exit: { opacity: 0, x: 30 },
    };
    const itemVariant: Variants = {
        hidden: { opacity: 0, x: 0 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 3,
            },
        },
    };

    return (
        <div>
            <Button
                variant="ghost"
                size="padIcon"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                <ListMusic className="size-5" />
            </Button>
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                variants={listVariant}
                                className="bg-accent fixed top-[calc(var(--height-navbar)+var(--spacing-playlistgap))] right-0 bottom-[calc(var(--height-bottombar)+var(--spacing-playlistgap))] z-50 rounded-xl p-2"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-lg">播放列表({queue.length})</span>
                                    <Button variant="ghost" size="padIcon" className="" onClick={removeList}>
                                        <Trash2 className="size-6"></Trash2>
                                    </Button>
                                </div>
                                <div>
                                    {queue.map((song) => (
                                        <SongCard song={song} variant="playList" variants={itemVariant} key={song.id} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
}
