"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { formSchema } from "./schema"
import { submitAction } from "./action"
import { Button } from "@/components/ui/button"


export default function CreatVcsingerPage(){

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const result = await submitAction(data);
        if(result?.error){
            alert(`error! Message: ${result.error}`)
        }else {
            alert(`success!`)
        }
    }

    return(
        <div>
            <Card>
                <CardHeader>Create Your Vcsinger!</CardHeader>
                <CardContent>
                    <form id="Creat-Vcsinger-Form" onSubmit={form.handleSubmit(onSubmit)}>
                        <Controller 
                            name="name"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field>
                                    <FieldLabel htmlFor="name">VcsingerName</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                    />
                                </Field>
                            )}
                            />
                        <Button type="submit">
                            Submit
                        </Button>
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}