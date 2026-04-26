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

export function QueuePanel() {
    const { queue, clearQueue } = usePlayerStore(
        useShallow((state) => ({
            queue: state.queue,
            clearQueue: state.actions.clearQueue,
        })),
    );

    const initialLoadQueue = useRef<number[]>([]);

    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    //绕过ssr服务端预渲染
    useEffect(() => {
        setMounted(true);
    }, []);

    const queueVariant: Variants = {
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

    const itemVariant: Variants = {
        close: { opacity: 0, x: 120 },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.3,
            },
        },
        exit: { opacity: 0 },
    };

    const scheduleVariant = {
        close: {},
        open: {},
    };

    //实时更新列表，保证打开后的增删动画仍然生效
    useEffect(() => {
        initialLoadQueue.current = queue.map((s) => s.id);
    }, [queue]);

    return (
        <div>
            <Button
                variant="ghost"
                size="padIcon"
                onClick={() => {
                    if (!isOpen) {
                        initialLoadQueue.current = queue.map((s) => s.id);
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
                                variants={queueVariant}
                                className="bg-background border-border fixed top-[calc(var(--height-navbar)+var(--spacing-queuegap))] right-0 bottom-[calc(var(--height-bottombar)+var(--spacing-queuegap))] z-50 w-90 rounded-xl border-2 p-2 shadow-md"
                                initial="close"
                                animate="open"
                                exit="exit"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-lg">播放队列({queue.length})</span>
                                    <Button variant="ghost" size="padIcon" className="" onClick={clearQueue}>
                                        <Trash2 className="size-6"></Trash2>
                                    </Button>
                                </div>
                                <div>
                                    <AnimatePresence mode="popLayout">
                                        {queue.map((song) => {
                                            const isExist = initialLoadQueue.current.includes(song.id);
                                            return (
                                                <motion.div
                                                    variants={itemVariant}
                                                    initial={isExist ? undefined : "close"}
                                                    animate={isExist ? undefined : "open"}
                                                    key={song.id}
                                                    layout
                                                >
                                                    <SongCard song={song} variant="queue" />
                                                </motion.div>
                                            );
                                        })}
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
