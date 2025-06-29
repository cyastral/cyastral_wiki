/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "song_name" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vcSinger" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "vcSinger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SongTovcSinger" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SongTovcSinger_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "vcSinger_name_key" ON "vcSinger"("name");

-- CreateIndex
CREATE INDEX "_SongTovcSinger_B_index" ON "_SongTovcSinger"("B");

-- AddForeignKey
ALTER TABLE "_SongTovcSinger" ADD CONSTRAINT "_SongTovcSinger_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongTovcSinger" ADD CONSTRAINT "_SongTovcSinger_B_fkey" FOREIGN KEY ("B") REFERENCES "vcSinger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
