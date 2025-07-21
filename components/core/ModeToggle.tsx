"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle({ title }: { title?: boolean }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="outline"
      size={title ? "default" : "icon"}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`${title ? "gap-2 w-full justify-start group" : ""}`}
    >
      {
        title ? <div className="-ml-2 flex items-center gap-2">
          {theme === "dark" ? <>
          <Sun className="group-hover:rotate-360 transition-all"/>
            Light
          </> : <>
          <Moon className="group-hover:rotate-360 transition-all"/>
            Dark
          </>}
        </div>
          : <>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </>
      }
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}