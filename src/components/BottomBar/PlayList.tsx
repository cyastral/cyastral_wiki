import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ListMusic, Pause, Play, Trash2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useShallow } from "zustand/react/shallow";
import SongCard from "../SongCard";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, Variants } from "motion/react";
import { createPortal } from "react-dom";
import { number } from "zod";

export function PlayList() {
    const { queue, removeList } = usePlayerStore(
        useShallow((state) => ({
            queue: state.queue,
            removeList: state.actions.removeList,
        })),
    );

    const initialLoadList = useRef<number[]>([]);

    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    //绕过ssr服务端预渲染
    useEffect(() => {
        setMounted(true);
    }, []);

    const listVariant: Variants = {
        close: { opacity: 0, x: 60 },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                staggerChildren: 0.1,
            },
        },
        exit: { opacity: 0, x: 60 },
    };

    //实时更新列表，保证打开后的增删动画仍然生效
    useEffect(() => {
        initialLoadList.current = queue.map((s) => s.id);
    }, [queue]);

    return (
        <div>
            <Button
                variant="ghost"
                size="padIcon"
                onClick={() => {
                    if (!isOpen) {
                        initialLoadList.current = queue.map((s) => s.id);
                    }
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
                                className="bg-accent fixed top-[calc(var(--height-navbar)+var(--spacing-playlistgap))] right-0 bottom-[calc(var(--height-bottombar)+var(--spacing-playlistgap))] z-50 w-90 rounded-xl p-2"
                                initial="close"
                                animate="open"
                                exit="exit"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-lg">播放列表({queue.length})</span>
                                    <Button variant="ghost" size="padIcon" className="" onClick={removeList}>
                                        <Trash2 className="size-6"></Trash2>
                                    </Button>
                                </div>
                                <div>
                                    <AnimatePresence>
                                        {queue.map((song) => (
                                            <SongCard
                                                song={song}
                                                variant="playList"
                                                key={song.id}
                                                isExist={initialLoadList.current.includes(song.id)}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
}
