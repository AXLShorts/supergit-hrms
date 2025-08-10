"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Languages,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { t, locale, setLocale, dir } = useLocale();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const logout = useLogout();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo/Brand - Left side */}
        <div className={cn("flex items-center", dir === "rtl" && "order-3")}>
          <h1 className="text-xl font-semibold text-gray-900">HRMS</h1>
        </div>

        {/* Navigation items - Right side */}
        <div
          className={cn(
            "flex items-center gap-4",
            dir === "rtl" && "order-1 flex-row-reverse"
          )}
        >
          {/* Language Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className={cn(
              "flex items-center gap-2",
              dir === "rtl" && "flex-row-reverse"
            )}
          >
            <Languages className="h-4 w-4" />
            <span>{locale === "en" ? "عربي" : "English"}</span>
          </Button>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 hover:bg-gray-100",
                  dir === "rtl" && "flex-row-reverse"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "hidden md:block text-left",
                    dir === "rtl" && "text-right"
                  )}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align={dir === "rtl" ? "start" : "end"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5",
                    dir === "rtl" && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "grid flex-1 text-left text-sm leading-tight",
                      dir === "rtl" && "text-right"
                    )}
                  >
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center",
                    dir === "rtl" && "flex-row-reverse"
                  )}
                >
                  <User
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("nav.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center",
                    dir === "rtl" && "flex-row-reverse"
                  )}
                >
                  <Settings
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("nav.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(dir === "rtl" && "flex-row-reverse")}
              >
                {theme === "dark" ? (
                  <Sun
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                ) : (
                  <Moon
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout.mutate()}
                className={cn(dir === "rtl" && "flex-row-reverse")}
              >
                <LogOut
                  className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                />
                {t("auth.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
