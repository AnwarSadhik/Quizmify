import BoolGame from "@/components/BoolGame";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { Game, Question } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

export default async function BooleanPage({ params: { gameId } }: Props) {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/")
  }
  
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        }
      }
    } 
  });
  
  return <main className="py-10">
    <BoolGame game={game} />
  </main>;
}
