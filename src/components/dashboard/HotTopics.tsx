import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomWordCloud from "./CustomWordCloud";

type Props = {};

export default async function HotTopics({}: Props) {
  const topics = await prisma.topic_count.findMany({});
  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic.split(":")[1],
      value: topic.count,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Hot Topics</CardTitle>
        <CardDescription>
          Hot and Most Trending Topics!
        </CardDescription>
      </CardHeader>

      <CardContent className="pl-2">
        <CustomWordCloud formattedTopics={formattedTopics}/>
      </CardContent>
    </Card>
  );
}
