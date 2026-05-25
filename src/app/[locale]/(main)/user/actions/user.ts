"use server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { randomUUID } from "crypto";
import { getPrisma } from "@/lib/prisma";

export async function getAvatarUpLoadUrl(filename: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("未登录");

    const ext = path.extname(filename);
    const fileKey = `user/avatar/${session.user.id}-${randomUUID()}${ext}`;
    const UpLoadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileKey,
        }),
        {
            expiresIn: 900,
        },
    );
    return { UpLoadUrl, fileKey };
}

export async function updateAvatar(fileKey: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("未登录");

    const prisma = await getPrisma();
    const url = `${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`;
    const result = await prisma.user.update({
        where: { id: session.user.id },
        data: { image: url },
    });
    return { success: true, imageUrl: url };
}
