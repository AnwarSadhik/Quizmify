"use client"
import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

const UserAccountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
            <img src={user?.image as string} alt="pfp" className="w-10 h-10 rounded-full"/>
        <DropdownMenuContent className="bg-white " align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium ">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-zinc-700">
                  {user.email}
                </p>
              )}
            </div>
          </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
                <Link href="/">Meow</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        signOut().catch(console.error);
                    }}
                    className="text-red-500 cursor-pointer"
                >
                    Sign Out
                    <LogOut className="w-4 h-4 ml-2"/>
                </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default UserAccountNav;