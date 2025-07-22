'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeftToLine, ChevronRight, ChevronsUpDown, Edit2Icon, EllipsisVertical, Trash2, UnfoldVertical } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandList, CommandGroup, CommandItem } from '@/components/ui/command'
import { useTRPC } from '@/src/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { prisma } from '@/lib/db'
import { UserButton, UserProfile } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ModeToggle } from './ModeToggle'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import NavProjects from './NavProjects'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'
const Header = ({ toggleCodeView, codeView, projectId }: { toggleCodeView: () => void, codeView: boolean, projectId: string }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const trpc = useTRPC();
    const { data: project } = useSuspenseQuery(
        trpc.projects.getOne.queryOptions({ id: projectId })
    );

    return (
        <header className='flex items-center gap-2 justify-between p-2' suppressHydrationWarning={true}>
            <div className='flex items-center gap-1 group'>
                <Sheet>
                    <SheetTrigger className='flex items-center gap-1'>
                        <img src="/media/bloom.svg" className='w-6 h-6 group-hover:rotate-180 transition-all' alt="" />
                        <ChevronRight size={16} />
                    </SheetTrigger>
                    <SheetContent side='left' closable={false} className='p-4 bg-background/25 backdrop-blur-md rounded-r-xl'>
                        <SheetHeader className='p-[-2rem] grid grid-cols-2  w-full'>
                            <SheetTitle className='flex items-center gap-2'>
                                <img src="/media/bloom.svg" className='w-7 h-7 group-hover:rotate-180 transition-all' alt="" />
                                My Sites
                            </SheetTitle>
                            <SheetClose asChild className='place-self-end '>
                                <Button variant={'ghost'} size={'icon'}>
                                    <ArrowLeftToLine size={18} />
                                </Button>
                            </SheetClose>
                        </SheetHeader>
                        <Link href="/" className='w-full'>
                        <Button className='group w-full' variant={'outline'}>
                            <img src="/media/flower.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" />
                            New Project
                        </Button>
                        </Link>
                        <p className='italic text-sm'>
                            Recents:
                        </p>
                        <ScrollArea className='h-[calc(100vh-10rem)]'>
                        <NavProjects/>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[150px] truncate text-ellipsis justify-between border-none outline-none"
                        >
                            <span className="truncate -ml-1">
                                {project?.name}
                            </span>
                            <ChevronsUpDown size={14} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem
                                        value="edit"
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Edit2Icon />
                                        Edit name
                                    </CommandItem>
                                    <CommandItem
                                        value="delete"
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Trash2 />
                                        Delete Project
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className='flex items-center gap-2'>
                <Button onClick={() => router.push("/pricing")} className='items-center gap-1 group hidden md:flex' variant={'outline'}>
                    <img src="/media/upgrade.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" />
                    Upgrade Plan
                </Button>
                <Button className='items-center gap-1 group hidden md:flex' variant={'outline'}>
                    <img src="/media/publish.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" />
                    Publish Site
                </Button>
                <div className='hidden md:flex'>
                    <ModeToggle />
                </div>
                <Popover>
                    <PopoverTrigger className=' flex md:hidden' asChild>
                        <Button className='p-2 h-auto w-auto' variant={'ghost'} size={'icon'}>
                            <UnfoldVertical size={16} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-[""] p-2 gap-2 flex flex-col'>
                        <div className=''>
                            <ModeToggle title />
                        </div>
                        <div onClick={() => router.push("/pricing")} className='items-center p-2 text-sm border rounded-lg cursor-pointer hover:bg-secondary/5 gap-2 group flex w-full '>
                            <img src="/media/upgrade.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" />
                            Upgrade Plan
                        </div>
                        <div className='items-center p-2 text-sm border rounded-lg cursor-pointer hover:bg-secondary/5 gap-2 group flex w-full '>
                            <img src="/media/publish.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" />
                            Publish Site
                        </div>
                    </PopoverContent>
                </Popover>
                <Button className='flex items-center gap-1 group' variant={'outline'} onClick={toggleCodeView}>
                    {codeView ? <img src="/media/bolt.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" /> : <img src="/media/prop.svg" className='w-4 h-4 group-hover:rotate-180 transition-all' alt="" />}
                    {codeView ? "Close Editor" : "Open Editor"}
                </Button>
                <UserButton />
            </div>
        </header>
    )
}

export default Header