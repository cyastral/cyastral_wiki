"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { VirtualSinger } from "@prisma/client"
import { submitSong } from "../action"
import { startTransition } from "react"
import { FormType, formSchema } from "../schema"
import { toast } from "sonner"
import { motion } from "motion/react"

type AddSongFormProps = {
    singers: VirtualSinger[];
}

export function AddSongForm({singers} : AddSongFormProps){

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            songName: "",
            link:"",
            singers:[],
        }
    })

    async function onSubmit(data:FormType) {
            const result = await submitSong(data);
            
            if (result.success){
                toast(
                    "提交成功！",
                    {description: result.message},
                )
            } else{
                toast(  
                    "提交失败",
                    {description:result.message},
                )
            }
    }

    return (
        <div className="flex justify-center">
            <Card className="w-1/2">    
                <CardHeader>
                    <CardTitle>Submit Song</CardTitle>
                    <CardDescription>This is Carddescription</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Controller
                            name="songName"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field>
                                    <FieldLabel htmlFor="songName">歌曲名称</FieldLabel>
                                    <Input
                                        {...field}
                                        id="songName"
                                    />
                                    <div className="mb-2 h-5">
                                        {fieldState && <span className="text-red-500 text-sm">{fieldState.error?.message}</span>}
                                    </div>
                                </Field>
                            )}/>
                        <Controller
                            name="link"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field>
                                    <FieldLabel htmlFor="link">Song Link</FieldLabel>
                                    <Input
                                    {...field}
                                    id="link"
                                    />
                                </Field>
                            )}
                        />
                        <Controller
                            name="singers"
                            control={form.control}
                            render={({field,fieldState}) => (
                                <div className="flex flex-wrap gap-2 my-4">
                                    {singers.map((singer) => {
                                        const isChecked = field.value.includes(singer.id.toString());
                                        return (
                                            <motion.div
                                            className={`cursor-pointer px-4 py-1.5 rounded-full transition-colors select-none
                                            ${isChecked ? "bg-green-500" : "bg-accent"}`}
                                            onClick={() => {
                                                if (isChecked){
                                                    field.onChange(field.value.filter((id:string) => id !== singer.id.toString()))
                                                } else {
                                                    field.onChange([...field.value, singer.id.toString()])
                                                }
                                            }}
                                            key={singer.name}
                                            whileHover={{
                                                scale: 1.05
                                            }}
                                            whileTap={{
                                                scale: 0.9
                                            }}
                                            >{singer.name}</motion.div>
                                        )
                                    })}
                                </div>
                            )}/>
                        <Button type="submit" className="select-none">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

