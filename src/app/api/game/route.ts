import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();
    const { topic, amount, type } = getQuestionsSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session?.user.id,
        topic: topic,
      },
    });
    await prisma.topic_count.upsert({
      where: {
        topic,
      },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });
    const [categoryId, category] = topic.split(":");
    const { data } = await axios.post(`${process.env.BASE_URL}/api/questions`, {
      topic: categoryId,
      amount: amount,
      type: type,
    });

    if (type === "multiple") {
      type mcqQuestion = {
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
      };
      let manyData = data.results.map((question: mcqQuestion) => {
        let options = [question.correct_answer, ...question.incorrect_answers];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.correct_answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "multiple",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === "boolean") {
      type booleanQuestion = {
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
        options: string[];
      };
      let manyData = data.results.map((question: booleanQuestion) => {
        let options = [question.correct_answer, ...question.incorrect_answers];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.correct_answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "boolean",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    }
    return NextResponse.json({
      gameId: game.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Something went Wrong",
        },
        { status: 500 }
      );
    }
  }
}
