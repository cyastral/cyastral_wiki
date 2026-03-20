-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "songName" TEXT NOT NULL,
    "coverUrl" TEXT,
    "audioUrl" TEXT,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "songID" INTEGER NOT NULL,
    CONSTRAINT "Link_songID_fkey" FOREIGN KEY ("songID") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VirtualSinger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Producer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProducerOnSongs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "producerId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    CONSTRAINT "ProducerOnSongs_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProducerOnSongs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SongToVirtualSinger" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SongToVirtualSinger_A_fkey" FOREIGN KEY ("A") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SongToVirtualSinger_B_fkey" FOREIGN KEY ("B") REFERENCES "VirtualSinger" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualSinger_name_key" ON "VirtualSinger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SongToVirtualSinger_AB_unique" ON "_SongToVirtualSinger"("A", "B");

-- CreateIndex
CREATE INDEX "_SongToVirtualSinger_B_index" ON "_SongToVirtualSinger"("B");
