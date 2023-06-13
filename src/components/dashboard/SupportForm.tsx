"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "../ui/LoadingSpinner";
import { env } from "~/env.mjs";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  support_id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  // select
  product: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export function SupportForm({
  support_id,
  name,
  email,
  products,
}: {
  support_id: string;
  name: string;
  email: string;
  products: string[];
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      support_id,
      name: name,
      email: email,
      product: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitted, isSubmitting } = useFormState({ control: form.control });

  const { toast } = useToast();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // reset form
    //form.reset();
    //fetch()
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const data = {
      ...values,
      subject: `SUPPORT TICKET: ${values.subject}`,
      access_key: env.NEXT_PUBLIC_WEB3_FORMS_KEY,
    };

    // const res = await fetch("https://api.web3forms.com/submit", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });
    const res = { ok: true };
    if (res.ok) {
      toast({
        title: "Petición Enviada Correctamente",
        description:
          "Nos pondremos en contacto contigo lo antes posible para resolver tu consulta.",
        className: "sm:right-1/2 sm:translate-x-1/2",
      });
    } else {
      toast({
        title: "Error",
        description:
          "Huy, parece que ha habido un problema. Mejor nos escribes por el chat.",
        variant: "destructive",
      });
    }

    // form.reset();
  }

  return (
    <>
      <div className="">
        {/* FORM */}
        {!isSubmitting && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="support_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pin de Soporte</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} disabled />
                    </FormControl>
                    {/* <FormDescription>Nombre</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} disabled />
                    </FormControl>
                    {/* <FormDescription>Nombre</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} disabled />
                    </FormControl>
                    {/* <FormDescription>Nombre</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto/Servicio</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(s) => {
                          field.onChange(s);
                        }}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Selecciona el producto con el que tienes el problema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Producto</SelectLabel>
                            <SelectItem value="none" className="cursor-pointer">
                              No tengo problema con un producto
                            </SelectItem>
                            {products.map((p, idx) => (
                              <SelectItem
                                value={p}
                                key={idx}
                                className="cursor-pointer"
                              >
                                {p}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {/* <FormDescription>Nombre</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Asunto" {...field} />
                    </FormControl>
                    {/* <FormDescription>Nombre</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    {/* <FormDescription>Nombre</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700"
              >
                Enviar Petición
              </Button>
            </form>
          </Form>
        )}
        {/* Submitting Spinner */}
        {isSubmitting && <LoadingSpinner />}
      </div>
    </>
  );
}
