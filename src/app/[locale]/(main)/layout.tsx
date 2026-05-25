import NavBar from "@/components/NavBar/NavBar";

import { PlayerStoreProvider } from "@/store/player-store";
import { PlaylistProvider } from "@/store/playlist-store";
import BottomBar from "@/components/BottomBar/BottomBar";
import { AudioEngine } from "@/components/AudioEngine/AudioEngine";
import SideBar from "@/components/SideBar/SideBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-background flex h-screen w-full flex-1 flex-col overflow-hidden">
            <NavBar />
            <PlaylistProvider>
                <PlayerStoreProvider>
                    <div className="flex gap-x-2 overflow-hidden">
                        <SideBar></SideBar>
                        <main className="flex flex-1 overflow-y-auto">{children}</main>
                    </div>
                    <AudioEngine />
                    <BottomBar />
                </PlayerStoreProvider>
            </PlaylistProvider>
        </div>
    );
}
