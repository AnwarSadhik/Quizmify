import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    // const session = await getAuthSession();

    // if (!session?.user) {
    //   return NextResponse.json({
    //     error: "You must be logged in to create a quiz"
    //   },{
    //     status: 401,
    //   })
    // }

    const body = await req.json();
    const { topic, amount, type } = getQuestionsSchema.parse(body);
    const [categoryId, category] = topic.split(':');


    const res = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return NextResponse.json(data,{
      status: 200,
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        { error: error },
        {
          status: 500,
        }
      );
    }
  }
}
