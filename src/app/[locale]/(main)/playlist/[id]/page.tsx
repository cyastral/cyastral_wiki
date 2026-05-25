import { getPlaylist } from "@/actions/playlist";
import SongCard from "@/components/SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PlayListInfo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const playlist = await getPlaylist(Number(id));
    console.log(playlist);
    console.log(playlist?.coverUrl);
    return (
        <div className="mx-20 w-full">
            {/* 标题区 */}
            <div className="flex h-60 w-full items-start gap-4 bg-amber-500 p-8">
                {/* 封面区域 */}
                <div className="my-auto size-40 overflow-hidden rounded-2xl">
                    {playlist?.coverUrl ? <img></img> : <div className="h-full w-full bg-red-100"></div>}
                </div>
                {/* 文字区 */}
                <div className="mt-4 flex flex-col justify-start">
                    <span className="text-2xl font-extrabold">{playlist?.title}123</span>
                    <span className="text-md text-muted-foreground">{playlist?.songs.length} 首歌曲</span>
                </div>
            </div>

            {/* 标签页 */}
            <Tabs defaultValue="songs">
                <TabsList variant="line">
                    <TabsTrigger value="songs">歌曲</TabsTrigger>
                    <TabsTrigger value="comments">评论</TabsTrigger>
                </TabsList>
                <TabsContent value="songs">
                    {playlist && playlist.songs.length > 0 ? (
                        playlist.songs.map((s) => <SongCard song={s.song} key={s.song.id}></SongCard>)
                    ) : (
                        <div>本歌单没有歌曲</div>
                    )}
                </TabsContent>
                <TabsContent value="comments">这里是评论区</TabsContent>
            </Tabs>
        </div>
    );
}
