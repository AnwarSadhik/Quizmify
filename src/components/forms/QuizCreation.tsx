"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/Quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BookOpen, CopyCheck, Ghost } from "lucide-react";
import { Separator } from "../ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import LoadingQuestions from "../LoadingQuestions";
import { useToast } from "../ui/use-toast";

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

export default function QuizCreation({}: Props) {
  const router = useRouter();
  const [showLoading, setShowLoading] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();

  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post(`/api/game`, {
        amount,
        topic,
        type,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "multiple",
    },
  });


  const onSubmit = async (data: Input) => {
    setShowLoading(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "multiple") {
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues("type") === "boolean") {
            router.push(`/play/boolean/${gameId}`);
          }
        }, 2000);
      },
    });
  };

  form.watch();
  if (showLoading) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[400px]">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">
            Quiz Creation
          </CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {form.getValues("topic")
                              ? form.getValues("topic").split(":")[1]
                              : "Select a Topic"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="relative max-h-60 overflow-y-visible custom-scrollbar-style">
                          <SelectItem value="9:General Knowledge">
                            General Knowledge
                          </SelectItem>
                          <SelectItem value="10:Books">Books</SelectItem>
                          <SelectItem value="11:Film">Film</SelectItem>
                          <SelectItem value="12:Music">Music</SelectItem>
                          <SelectItem value="13:Musical and Theatre">
                            Musicals and theatre
                          </SelectItem>
                          <SelectItem value="14:Television">
                            Televison
                          </SelectItem>
                          <SelectItem value="15:Video Games">
                            Video Games
                          </SelectItem>
                          <SelectItem value="16:Board Games">
                            Board Games
                          </SelectItem>
                          <SelectItem value="17:Science and Nature">
                            Sciene and Nature
                          </SelectItem>
                          <SelectItem value="18:Computers">
                            Computers
                          </SelectItem>
                          <SelectItem value="19:Maths">Maths</SelectItem>
                          <SelectItem value="20:Mythology">
                            Mythology
                          </SelectItem>
                          <SelectItem value="21:Sports">Sports</SelectItem>
                          <SelectItem value="22:Geography">
                            Geography
                          </SelectItem>
                          <SelectItem value="23:History">History</SelectItem>
                          <SelectItem value="24:Politics">Politics</SelectItem>
                          <SelectItem value="25:Art">Art</SelectItem>
                          <SelectItem value="26:Celebrities">
                            Celebrities
                          </SelectItem>
                          <SelectItem value="27:Animals">Animals</SelectItem>
                          <SelectItem value="28:Vehicles">Vehicles</SelectItem>
                          <SelectItem value="29:Comics">Comics</SelectItem>
                          <SelectItem value="30:Gadgets">Gadgets</SelectItem>
                          <SelectItem value="31:Anime and Manga">
                            Anime and manga
                          </SelectItem>
                          <SelectItem value="32:Cartoon and Animation">
                            Cartoon and Animation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                      here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an amount..."
                        {...field}
                        type="number"
                        min={1}
                        max={10}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "multiple");
                  }}
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "multiple"
                      ? "default"
                      : "secondary"
                  }
                >
                  <CopyCheck className="w-4 h-4 mr-2" />
                  Mutliple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "boolean");
                  }}
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "boolean"
                      ? "default"
                      : "secondary"
                  }
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  True / False
                </Button>
              </div>

              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
