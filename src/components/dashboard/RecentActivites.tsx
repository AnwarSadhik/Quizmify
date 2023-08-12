import { getAuthSession } from "@/lib/nextauth";
import HistoryComponent from "../HistoryComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {};

export default async function RecentActivites({}: Props) {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const gamesCount = await prisma.game.count({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">
          Recent Activities
        </CardTitle>
        <CardDescription>You have Played total of {gamesCount} games.</CardDescription>
      </CardHeader>

      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent limit={10} userId={session?.user.id} />
      </CardContent>
    </Card>
  );
}
