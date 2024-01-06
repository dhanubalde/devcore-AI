"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Category, Companion } from "@prisma/client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { PREAMBLE, SEED_CHAT, formSchema } from "./constant";




interface CompanionFormProps {
  categories: Category[];
  initialData: Companion | null;
};

export const CompanionForm = ({
  categories,
  initialData
}: CompanionFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await axios.patch(`/api/companion/${initialData.id}`, values)
      } else { 
        await axios.post(`/api/companion`, values)
      }

      toast({
        title: "Hi !",
        description: "Successully Created.",
      });

      router.refresh()
      router.push("/")
    } catch (error) { 
      toast({
        variant: "destructive",
        description: "Something went wrong"
        })
      
    }
  };
    
  return ( 
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Devcore
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                <FormControl>
                  <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Elon Musk" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your AI Devcore will be named.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="CEO & Founder of Tesla, SpaceX" {...field} />
                  </FormControl>
                  <FormDescription>
                    Short description for your Devcore 
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed instructions for AI Behaviour
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea disabled={isLoading} rows={7} className="bg-background resize-none" placeholder={PREAMBLE} {...field} />
                </FormControl>
                <FormDescription>
                  Describe in detail your devcore&apos;s backstory and relevant details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea disabled={isLoading} rows={7} className="bg-background resize-none" placeholder={SEED_CHAT} {...field} />
                </FormControl>
                <FormDescription>
                  Write couple of examples of a human chatting with your AI devcore, write expected answers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />  
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
   );
};