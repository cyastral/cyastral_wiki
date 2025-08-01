/*
  Warnings:

  - A unique constraint covering the columns `[song_name]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Song_song_name_key" ON "Song"("song_name");
