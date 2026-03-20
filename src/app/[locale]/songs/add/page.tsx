import { getPrisma } from "@/lib/prisma";
import { AddSongForm } from "./_components/AddSongForm";

export default async function AddSongPage() {

    const prisma = await getPrisma();

    const singers = await prisma.virtualSinger.findMany();
    console.log(singers);
    return (
        <div>
            <AddSongForm singers={singers}/>
        </div>
    )
}