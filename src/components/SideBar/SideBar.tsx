import { getAllPlaylist} from "@/actions/playlist";
import PlayListCard from "./PlayListCard";
import PlaylistHydration from "./PlaylistHydration";

export default async function SideBar() {
    const playlist = await getAllPlaylist();
    return (
        <div className="w-60 border-2 rounded-md">
            <PlaylistHydration PlaylistData={playlist}></PlaylistHydration>
            {playlist?.map((s) => (<PlayListCard item={s} key={s.id}></PlayListCard>))}
        </div>
    )
}