-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN "coverUrl" TEXT;

-- CreateIndex
CREATE INDEX "PlaylistSong_playlistId_idx" ON "PlaylistSong"("playlistId");
