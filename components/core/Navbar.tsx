"use client";

import Link from "next/link";
import Image from "next/image";
import { SignIn, SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Bot, Laptop2, Moon, MoonIcon, Sun, SunIcon, SunMediumIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { dark } from "@clerk/themes";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();

  return (
    <nav
  className={cn(
    "p-4  fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent"
  )}
>

<div className="max-w-5xl mx-auto w-full flex justify-between items-center">
 
<div className= " flex gap-3 ">
       
<Link href="/" className="flex items-center gap-2">
    <Image src="/media/bloom.svg" alt="Vibe" width={24} height={24} />
    
    <span className="font-Molle text-lg">Bloom</span>
  </Link>

    <ModeToggle/>
       </div>

  


  <SignedOut>
  <div className="flex gap-2">

    <SignUpButton>
      <Button variant="outline" size="sm">
        Sign up
      </Button>
    </SignUpButton>
    <SignInButton>
      <Button size="sm">
        Sign in
      </Button>
    </SignInButton>

  </div>
</SignedOut>
<SignedIn>
<UserButton
      appearance={{
        baseTheme:theme==="dark"? dark :undefined,
      }}
    />
</SignedIn>
</div>
    </nav>
  );
};
