//该脚本只在本地运行
import { getPrisma } from "@/lib/prisma";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";

const downloadPath = "public/downloads/songs"
const Base = "http://127.0.0.1:3000";
const COOKIE_PATH = ".cache/ncm_cookie.txt";

type SongList = {
    id: string;
    name: string;
    artists: string[];
}

//通用带cookie请求
async function getJson<T>(
    path: string,
    params: Record<string, any> = {},
    opts: { useCookie?: boolean } = {}
): Promise<T> {
    const url = new URL(path, Base);

    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, String(v));
    }

    if (opts.useCookie) {
        const cookie = await getCookie();
        url.searchParams.set("cookie", cookie);
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    
    return res.json();
}

async function getCookie() {
    return (await readFile(COOKIE_PATH, "utf-8")).trim();
}

function HandleSongList(data: any): SongList[] {
    return data.songs.map((song: any) => ({
        id: String(song.id),
        name: song.name,
        artists: song.ar.map((ar: any) => ar.name)
    }));
}

async function downloadToFile(url: string, path: string, id: string) {
    await mkdir(path, { recursive: true });
    const filePath = join(path, `netease_${id}.mp3`);

    //下载mp3
    const res = await fetch(url);
    const fileStream = createWriteStream(filePath);

    if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
    if (!res.body) throw new Error("No response body");

    //写入数据流
    await pipeline(Readable.fromWeb(res.body as unknown as ReadableStream), fileStream);

    return filePath;
}   

async function main(){
    const prisma = await getPrisma();
    const songListRes = HandleSongList(await getJson("/playlist/track/all", {id: 17630605716}))//这里改歌单id

    for (const song of songListRes){
        
        const exists = await prisma.song.findFirst({
        where: { source: "Netease", sourceId: song.id },
        select: { id: true },
        });

        if(exists) continue;

        const singers = await prisma.virtualSinger.findMany({
            where: { name: { in: song.artists } },
            select: { id: true },
        });

        const url = (await getJson<{data: Array<{url: string | null}>}>("/song/url", {id: song.id}, {useCookie: true})).data[0]?.url;
        if (!url) throw new Error(`No mp3 url for song ${song.id}`)

        const audioUrl = await downloadToFile(url, downloadPath, song.id);

        await prisma.song.create({
            data: {
                songName: song.name,
                singers: {
                    connect: singers
                },
                audioUrl: audioUrl.split("public")[1],//去掉public头
                source: "Netease",
                sourceId: song.id
            }
        })

    }
}

main();