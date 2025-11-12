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


const formSchema = z.object({
    songname: z.string(),
    description: z.string(),
})


export function AddSongForm(){

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            songname: "",
            description:"",
        }
    })

    function onSubmit(){
        
    }

    return (
        <div className="flex justify-center">
            <Card className="w-1/2">
                <CardHeader>
                    <CardTitle>Submit Song</CardTitle>
                    <CardDescription>This is Carddescription</CardDescription>
                </CardHeader>
                <CardContent>
                    <Controller
                        name="songname"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel htmlFor="songName">Song Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="songName"
                                />
                            </Field>
                        )}/>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Input
                                {...field}
                                id="description"
                                />
                            </Field>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

