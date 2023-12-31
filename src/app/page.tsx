import AuthBtn from "@/components/AuthBtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { LogIn, LogInIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    return redirect("/dashboard")
  }

  return (
    <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[330px] md:w-[360px]">
        <CardHeader>
          <CardTitle>Welcome to Quizzemfy!</CardTitle>
          <CardDescription>
            Quizzmefy is a simple quiz application that allows you to create and
            share quizz with your friends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthBtn>
            <div className="flex items-center flex-row gap-x-2">
            <LogInIcon />
            SignIn with Google
            </div>
          </AuthBtn>
        </CardContent>
      </Card>
    </main>
  );
}
