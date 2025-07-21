"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { ArrowUpRightFromSquare, ChevronsLeft, ChevronsRight, Code, LayoutDashboardIcon, RefreshCcw, X } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import "@cubone/react-file-manager/dist/style.css";
import { motion } from 'framer-motion'
import FragmentWeb from './FragmentWeb'
import { Fragment } from '@/lib/generated/prisma'
import FileExplorer from './FileExplorer'

interface CodeViewProps {
    toggleChatView: () => void
    chatView: boolean
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    activeFragment: Fragment | null,

}

const WrappedContent = ({ toggleChatView, chatView, value, setValue, closeButton, activeFragment }: {
    toggleChatView: () => void
    chatView: boolean
    value: string
    setValue: (value: string) => void
    closeButton?: React.ReactNode
    activeFragment: Fragment | null,
}) => {
    const [fragmentKey, setFragmentKey] = useState(0);

    const onRefresh =()=>{
         setFragmentKey((prev) => prev +1);
    };
    return (
        <div className='h-full flex flex-col'>
            <header className='flex justify-between items-center p-1 bg-secondary/5 sticky top-0 z-10 '>
                <div className='flex items-center gap-2'>
                    <Button title='Toggle chat view' className='p-2 h-auto w-auto hidden md:flex' variant={'ghost'} size={'icon'} onClick={toggleChatView}>
                        {!chatView ? <ChevronsRight  size={14} /> : <ChevronsLeft  size={14} />}
                    </Button>
                    <TabsList className='bg-transparent'>
                        <TabsTrigger title='Code' value="code"><Code className={value === "code" ? "text-primary" : ""} />Code</TabsTrigger>
                        <TabsTrigger title='Preview' value="preview"><LayoutDashboardIcon className={value === "preview" ? "text-primary" : ""} />Preview</TabsTrigger>
                    </TabsList>
                </div>

                <div className='flex items-center gap-2  w-full justify-end'>
                    <Button
                        className='p-2 h-auto w-auto'
                        variant={'ghost'}
                        size={'icon'}
                        title="Open preview in new tab"
                        onClick={() => { 
                            window.open(activeFragment?.sandboxUrl, '_blank');
                        }}
                    >
                        <ArrowUpRightFromSquare  size={14} />
                    </Button>
                    <Button title='Refresh' className='p-2 h-auto w-auto' variant={'ghost'} size={'icon'} onClick={onRefresh}>
                        <RefreshCcw  size={14} />
                    </Button>
                    <Button size={"sm"}
                        variant={"outline"}
                        title='Copy'
                        onClick={() => { navigator.clipboard.writeText(activeFragment?.sandboxUrl || "") }}
                        disabled={!activeFragment?.sandboxUrl}
                        className="w-[100px] max-w-[250px] flex-1">
                        <span className="truncate">
                            {activeFragment?.sandboxUrl}
                        </span>
                    </Button>
                    <>{closeButton}</>
                </div>
            </header>
            <main className='h-[calc(100%-2rem)]'>
                <TabsContent value="code" className='h-full flex'>
                    {!!activeFragment?.file ? (
                        <FileExplorer
                            files={activeFragment.file as { [path: string]: string }}
                        />) : (

                        <div className="flex items-center  flex-col justify-center min-h-screen ">

                            <motion.p
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.3 }}

                                className="f text-2xl text-primary font-Aladin"
                            >

                                "Your magic is on the way—get ready to shine!"</motion.p>

                            <motion.svg
                                width="80"
                                height="80"
                                viewBox="0 0 100 100"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-blue-500"
                            >

                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0, 300", rotate: 0 }}
                                    animate={{
                                        strokeDasharray: ["0, 300", "150, 300", "0, 300"],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.svg>
                        </div>

                    )}
                </TabsContent>
                <TabsContent value="preview" className='h-full'>
                    {!!activeFragment ? (<FragmentWeb data={activeFragment} fragmentKey={fragmentKey} setFragmentKey={setFragmentKey} />) : (
                        <div className="flex items-center  flex-col justify-center min-h-screen ">
                            <motion.p
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.3 }}

                                className="f text-2xl text-primary font-Aladin"
                            >

                                "Your magic is on the way—get ready to shine!"</motion.p>

                            <motion.svg
                                width="80"
                                height="80"
                                viewBox="0 0 100 100"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-blue-500"
                            >

                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0, 300", rotate: 0 }}
                                    animate={{
                                        strokeDasharray: ["0, 300", "150, 300", "0, 300"],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.svg>
                        </div>
                    )}
                    {}
                </TabsContent>
            </main>
        </div>
    );
}
const CodeViewContent = ({ toggleChatView, chatView, value, setValue, closeButton, activeFragment }: {
    toggleChatView: () => void
    chatView: boolean
    value: string
    closeButton?: React.ReactNode
    setValue: (value: string) => void
    activeFragment: Fragment | null,
}) => {
    return (
        <Tabs onValueChange={setValue} className='gap-0 h-full rounded-lg overflow-hidden border md:border-0 flex flex-col' defaultValue="code" value={value}>
            <WrappedContent toggleChatView={toggleChatView} chatView={chatView} value={value} setValue={setValue} closeButton={closeButton} activeFragment={activeFragment} />
        </Tabs>
    )
}

const CodeView = ({ toggleChatView, chatView, isOpen, onOpenChange, activeFragment }: CodeViewProps) => {
    const [value, setValue] = useState("code")
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="h-[100dvh] p-0 flex flex-col">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Code View</SheetTitle>
                    </SheetHeader>
                    <div className="h-full overflow-hidden">
                        <CodeViewContent
                            toggleChatView={toggleChatView}
                            chatView={chatView}
                            value={value}
                            setValue={setValue}
                            closeButton={
                                <SheetClose asChild>
                                    <Button className='p-2 h-auto w-auto' variant={'ghost'} size={'icon'}>
                                        <X  size={14} />
                                    </Button>
                                </SheetClose>
                            }
                            activeFragment={activeFragment}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <div className='rounded-lg border h-[92dvh] w-full'>
            <CodeViewContent
                toggleChatView={toggleChatView}
                chatView={chatView}
                value={value}
                setValue={setValue}
                activeFragment={activeFragment}
            />
        </div>
    )
}

export default CodeView