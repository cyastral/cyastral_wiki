-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "song_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "vcSinger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SongTovcSinger" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SongTovcSinger_A_fkey" FOREIGN KEY ("A") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SongTovcSinger_B_fkey" FOREIGN KEY ("B") REFERENCES "vcSinger" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_song_name_key" ON "Song"("song_name");

-- CreateIndex
CREATE UNIQUE INDEX "vcSinger_name_key" ON "vcSinger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SongTovcSinger_AB_unique" ON "_SongTovcSinger"("A", "B");

-- CreateIndex
CREATE INDEX "_SongTovcSinger_B_index" ON "_SongTovcSinger"("B");
