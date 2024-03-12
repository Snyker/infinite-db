'use client';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {TypographyMuted, TypographySmall} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import React from "react";
import {useForm} from "react-hook-form";
import {AuthenticationSchema} from "@/components/authentication/authentication";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

export default function Signup() {
  
  const form = useForm<z.infer<typeof AuthenticationSchema>>({
    resolver: zodResolver(AuthenticationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  function onSubmit(values: z.infer<typeof AuthenticationSchema>) {
    console.log(values)
  }
  
  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Vous permet de sauvegarder vos travaux gratuitement.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <FormField name={"email"}
                       control={form.control}
                       render={({field}) => (
                         <FormItem className="space-y-1">
                           <FormLabel htmlFor="email">Email</FormLabel>
                           <FormControl>
                             <Input {...field} placeholder="example@gmail.com"/>
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
            />
            <FormField name={"password"}
                       control={form.control}
                       render={({field}) => (
                         <FormItem className="space-y-1">
                           <FormLabel htmlFor="password">Mot de passe</FormLabel>
                           <FormControl>
                             <Input {...field} type={'password'} />
                           </FormControl>
                           <FormDescription>8 caractères minimum, 1 caractère spécial, 1 chiffre.</FormDescription>
                           <FormMessage />
                         </FormItem>
                       )}
            />
            <div>
              <TypographySmall>En créeant un compte vous acceptez les CGU et Mentions Légales</TypographySmall>
            </div>
          </CardContent>
          <CardFooter>
            <Button type={'submit'}>Créer un compte</Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
)
}
