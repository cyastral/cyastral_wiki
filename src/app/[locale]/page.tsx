import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { createPlaylist } from "@/actions/playlist";

export default function SimpleLayout() {
    const t = useTranslations("HomePage");

    return (
        <div className="bg-amber-200 h-screen">
            <h1 className="text-3xl text-red-500">Hello World</h1>
            <Button asChild>
                <Link href="/admin/createvcsinger">Create A Vcsinger</Link>
            </Button>
            <Button asChild>
                <Link href="/songs/add">Submit New Song!</Link>
            </Button>
            <Button onClick={() => {createPlaylist("1")}}>
                Create a Playlist 
            </Button>
        </div>
    );
}
