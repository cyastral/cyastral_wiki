'use client'
import { useState } from "react";
import { useActionState } from "react";
import { addSongAction } from "./action";

export default function AddSong() {

    const [songName, setSongName] = useState('');

    const availableVcsingers =[
        { id: 1, name: 'Miku'},
        { id: 2, name: 'Luka'},
        { id: 3, name: 'Rin'},
        { id: 4, name: 'Len'}
    ]

    const initialStates = {
        message: null,
        error: null
    }

    const [selectedSingers, setSelectedSingers] = useState<number[]>([]);
    const [formState, formAction, isPending] = useActionState(addSongAction, null);

    const handleSingerSelect = (singerId:number) => {
        if(selectedSingers.includes(singerId)) {
            setSelectedSingers(selectedSingers.filter((id) => id !== singerId));
        } else {
            setSelectedSingers([...selectedSingers, singerId]);
        }
    }



    return (
        <div>
            <div className="flex justify-center bg-slate-200 mx-20 rounded-xl shadow-md">
                <h1 className="text-5xl text-cyan-400">Add Song</h1>
                    
            </div>
        </div>
    )
}