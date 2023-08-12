"use client";
import { Game, Question } from "@prisma/client";
import React from "react";
import { useToast } from "./ui/use-toast";
import { Button, buttonVariants } from "./ui/button";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import MCQCounter from "./MCQCounter";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/questions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  game: Game & {
    questions: Pick<Question, "id" | "question" | "answer">[];
  };
};

export default function Bool({ game }: Props) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const [now, setNow] = React.useState<Date>(new Date());

  const { toast } = useToast();
  const options: string[] = ["True", "False"];

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selected],
      };
      const res = await axios.post(`/api/checkAnswer`, payload);
      return res.data;
    },
  });

  const handleNext = React.useCallback(() => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Correct!",
            description: "You got it right!",
            variant: "success",
          });
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: "Incorrect!",
            description: "You got it Wrong",
            variant: "destructive",
          });
          setWrongAnswers((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }

        setQuestionIndex((prev) => prev + 1);
      },
    });
  }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        setSelected(0);
      } else if (event.key === "2") {
        setSelected(1);
      } else if (event.key === "3") {
        setSelected(2);
      } else if (event.key === "4") {
        setSelected(3);
      } else if (event.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  // const options = React.useMemo(() => {
  //   if (!currentQuestion) return [];
  //   if (!currentQuestion.options) return [];
  //   return JSON.parse(currentQuestion.options as string) as string[];
  // }, [currentQuestion]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col  justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), "mt-2")}
        >
          view statistics
          <BarChart className="w-4 h-4 mt-2 ml-2" />
        </Link>
      </div>
    );
  }

  const encodedString = currentQuestion?.question;
  const decodedString = encodedString
    ?.replace(/&quot;/g, '"')
    ?.replace(/&#039;/g, "'");

  return (
    <main className="py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400 mr-2">Topic</span>
            <span className="py-1 px-2 text-white rounded-lg bg-slate-800">
              {game.topic !== "" ? game.topic.split(":")[1] : "random"}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correct_answers={correctAnswers}
          wrong_answers={wrongAnswers}
        />
      </div>

      <Card className="w-full mt-4 ">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400 ">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg ">
            {/* {JSON.stringify(currentQuestion?.question)} */}
            {/* {currentQuestion?.question} */}
            {decodedString}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4 ">
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              className="w-full justify-start py-8 mb-4"
              variant={selected === index ? "default" : "secondary"}
              onClick={() => {
                setSelected(index);
              }}
            >
              <div className="flex items-center-justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}

        <Button
          className="mt-2"
          disabled={isChecking}
          onClick={() => handleNext()}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </main>
  );
}
