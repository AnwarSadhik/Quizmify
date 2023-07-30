"use client"
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

type Props = {
    children: React.ReactNode
};

const AuthBtn = ({ children }: Props) => {
  return (
    <Button
      className={cn(`
            px-6
            py-1
            bg-black
            text-white
            font-bold
            ml-4
        `)}
        onClick={() => {
            signIn("google").catch((err) => console.log(err));
        }}
    >
      {children}
    </Button>
  );
};

export default AuthBtn;
