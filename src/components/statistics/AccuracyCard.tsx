import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Target } from "lucide-react";

type Props = {
  accuracy: number;
};

export default function AccuracyCard({ accuracy }: Props) {
  accuracy = Math.round(accuracy * 100) / 100;
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold ">Average Accuracy</CardTitle>
        <Target />
      </CardHeader>

      <CardContent>
        <div className="text-sm font-medium">{accuracy.toString()}%</div>
      </CardContent>
    </Card>
  );
}
