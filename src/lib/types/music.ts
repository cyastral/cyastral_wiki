export interface AppSong {
    id: number;
    title: string;
    audioUrl: string | null;
    singers: AppSinger[];
}

export interface AppSinger {
    id: number;
    name: string;
}
