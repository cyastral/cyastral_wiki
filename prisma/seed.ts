import { prisma } from "../src/lib/prisma";

async function main(){
    const v_singers = ["Hatsune Miku", "Kagamine Rin","Kagamine Ren","Meiko","Kaito"];
    
    await Promise.all(
        v_singers.map(singerName => {
            return prisma.vcSinger.upsert({
                where: { name : singerName },
                update:{},
                create:{ name: singerName },
            });
        })
    )

    const songs = ["Tell your world", "melt"];
    await Promise.all(
        songs.map(songName => {
            return prisma.song.upsert({
                where: { song_name: songName },
                update: {},
                create: { song_name: songName,
                    singer: {
                        connect: {
                            name: "Hatsune Miku",
                        },
                    },
                }
            })
        })
    )

}
main().then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });