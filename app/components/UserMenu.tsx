"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut } from "lucide-react";

export function UserMenu() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t dark:border-gray-700">
      <ThemeToggle />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
}
