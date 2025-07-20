"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { ArrowUpRightFromSquare, ChevronsLeft, ChevronsRight, Code, LayoutDashboardIcon, RefreshCcw, X } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import {Editor} from '@monaco-editor/react'
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";

interface CodeViewProps {
    toggleChatView: () => void
    chatView: boolean
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const WrappedContent = ({ toggleChatView, chatView, value, setValue, closeButton }: {
    toggleChatView: () => void
    chatView: boolean
    value: string
    setValue: (value: string) => void
    closeButton?: React.ReactNode
}) => {   
    return (
        <div className='h-full flex flex-col'>
            <header className='flex justify-between items-center p-1 bg-secondary/5 sticky top-0 z-10 flex-shrink-0'>
                <div className='flex items-center gap-2'>
                    <Button className='p-2 h-auto w-auto hidden md:flex' variant={'ghost'} size={'icon'} onClick={toggleChatView}>
                        {!chatView ? <ChevronsRight className='text-secondary' size={14} /> : <ChevronsLeft className='text-secondary' size={14} />}
                    </Button>
                    <TabsList className='bg-transparent'>
                        <TabsTrigger value="code"><Code className={value === "code" ? "text-primary" : ""} />Code</TabsTrigger>
                        <TabsTrigger
                            onClick={() => {
                                // sandpack.runSandpack()
                            }}
                            value="preview"><LayoutDashboardIcon className={value === "preview" ? "text-primary" : ""} />Preview</TabsTrigger>
                    </TabsList>
                </div>
                <div className='flex items-center gap-2'>
                    <div>
                        <Button
                            className='p-2 h-auto w-auto'
                            variant={'ghost'}
                            size={'icon'}
                            title="Open preview in new tab"
                            onClick={()=>{}}
                        >
                            <ArrowUpRightFromSquare className='text-secondary' size={14} />
                        </Button>
                    </div>
                    <Button className='p-2 h-auto w-auto' variant={'ghost'} size={'icon'} onClick={() => {  }}>
                        <RefreshCcw className='text-secondary' size={14} />
                    </Button>
                    <>{closeButton}</>
                </div>
            </header>
            <main className='h-[calc(100%-2rem)]'>
                    <TabsContent value="code" className='h-full flex'>
                        <FileManager className='max-w-[200px] overflow-auto border-r flex-1/5 h-full' />
                        <Editor className='overflow-auto border-r flex-4/5 h-full'/>
                    </TabsContent>
                    <TabsContent value="preview" className='h-full'>
                        {/* <SandpackPreview
                            style={{
                                height: '100%',
                                overflowY: 'auto'
                            }}
                            showNavigator={false}
                            showOpenNewtab={false}
                            showOpenInCodeSandbox={false}
                            showRefreshButton={false}
                            showRestartButton={false}
                            actionsChildren={
                                <Link href="https://bloom.amardeep.space" className=' sticky bottom-2 right-2'>
                                    <Badge variant={'default'}>
                                        made with ♥️ by
                                        <img src="/media/bloom.svg" className='w-4 h-4' alt="" />
                                        Bloom
                                    </Badge>
                                </Link>
                            } /> */}
                    </TabsContent>
            </main>
        </div>
    );
}

const CodeViewContent = ({ toggleChatView, chatView, value, setValue, closeButton }: {
    toggleChatView: () => void
    chatView: boolean
    value: string
    closeButton?: React.ReactNode
    setValue: (value: string) => void
}) => {
    return (
        <Tabs onValueChange={setValue} className='gap-0 h-full rounded-lg overflow-hidden border md:border-0 flex flex-col' defaultValue="code" value={value}>
                <WrappedContent toggleChatView={toggleChatView} chatView={chatView} value={value} setValue={setValue} closeButton={closeButton} />
        </Tabs>
    )
}

const CodeView = ({ toggleChatView, chatView, isOpen, onOpenChange }: CodeViewProps) => {
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
                                        <X className='text-secondary' size={14} />
                                    </Button>
                                </SheetClose>
                            }
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
            />
        </div>
    )
}

export default CodeView