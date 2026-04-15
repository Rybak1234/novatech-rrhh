"use client";

import { useSession } from "next-auth/react";
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun, HiOutlineBars3 } from "react-icons/hi2";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  user: { name?: string; email?: string; role?: string };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-950 px-6">
      <button className="lg:hidden">
        <HiOutlineBars3 className="h-6 w-6" />
      </button>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <HiOutlineSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <HiOutlineMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <HiOutlineBell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
          3
        </span>
      </Button>

      <div className="flex items-center gap-3 pl-2 border-l">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{getInitials(user.name || "U")}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role?.toLowerCase().replace("_", " ")}</p>
        </div>
      </div>
    </header>
  );
}
