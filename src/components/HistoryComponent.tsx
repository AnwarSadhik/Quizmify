import { prisma } from "@/lib/db";
import { Clock, CopyCheck, Edit2, LucideCheckCircle } from "lucide-react";
import React from "react";
import Link from "next/link";

type Props = {
  limit: number;
  userId: string;
};

export default async function HistoryComponent({ limit, userId }: Props) {
  const games = await prisma.game.findMany({
    where: {
      userId,
    },
    take: limit,
    orderBy: {
      timeStarted: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {games.map((game) => {
        return (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "multiple" ? (
                <CopyCheck className="mr-3" />
              ) : (
                <LucideCheckCircle className="mr-3" />
              )}
              <div className="ml-4 space-y-1">
                <Link
                  href={`/statistics/${game.id}`}
                  className="text-base font-medium leading-none underline"
                >
                  {game.topic !== "" ? game.topic.split(":")[1] : "random"}
                </Link>
                <p className="flex items-center px-2  py-1 text-sm text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(game.timeStarted).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {game.gameType === "multiple" ? "Mutliple Choice" : "True/False"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
