import { z } from "zod";


export const quizCreationSchema = z.object({
  topic: z.string(),
  type: z.enum(["multiple", "boolean"]),
  amount: z.number().min(1).max(10),
});

export const checkAnswerSchema = z.object({
    questionId: z.string(),
    userAnswer: z.string(),
})