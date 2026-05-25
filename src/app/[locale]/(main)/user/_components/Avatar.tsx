"use client";

import { Camera, User } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { getAvatarUpLoadUrl, updateAvatar } from "../actions/user";
import { useRouter } from "@/i18n/navigation";

export default function Avatar({ fileurl }: { fileurl: string | null | undefined }) {
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const handleInput = () => {
        inputRef.current?.click();
    };
    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log("取消选择");
            return;
        }
        console.log(file);              
        try {
            const { UpLoadUrl, fileKey } = await getAvatarUpLoadUrl(file.name);
            const response = await fetch(UpLoadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    //之后在getAvatarUpLoadUrl指定
                },
            });
            if (!response.ok) throw Error("上传失败"); 
            const updateRes = await updateAvatar(fileKey);
            if (!updateRes.success) throw Error("更新失败");
            router.refresh();
        } catch (error) {
            alert(error);
        } finally {
            if (e.target) e.target.value = "";
        }
    };
    return (
        <div
            className="group relative size-36 cursor-pointer overflow-hidden rounded-full border-2"
            onClick={handleInput}
        >
            <input type="file" className="hidden" ref={inputRef} accept="image/*" onChange={handleAvatarChange} />
            <div>
                {fileurl ? (
                    <img src={fileurl} className="size-full object-cover" alt="Avatar"></img>
                ) : (
                    <User className="size-full text-gray-400" />
                )}
            </div>

            {/* 遮罩层 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition duration-150 group-hover:opacity-100">
                <Camera className="size-12"></Camera>
                <span>选择照片</span>
            </div>
        </div>
    );
}
