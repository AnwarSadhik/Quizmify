import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/Quiz";
import { NextResponse } from "next/server";
import { ZodError, date } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
      },
    });

    if (question.questionType === "multiple") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();
      await prisma.question.update({
        where: { id: questionId },
        data: {
          isCorrect,
        },
      });
      return NextResponse.json({ isCorrect }, { status: 200 });
    } else if (question.questionType === "boolean") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();
      await prisma.question.update({
        where: { id: questionId },
        data: {
          isCorrect,
        },
      });
      return NextResponse.json({ isCorrect }, { status: 200 });
    }
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
        { error: "Something Went Wrong" },
        { status: 500 }
      );
    }
  }
}
