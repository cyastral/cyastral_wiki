import { z } from "zod";

export const formSchema = z.object({
    songName: z.string()
            .min(1,{ message : "歌名至少1个字符"}),
    link: z.string(),
    singers: z.array(z.string())
})

export type FormType = z.infer<typeof formSchema>;
