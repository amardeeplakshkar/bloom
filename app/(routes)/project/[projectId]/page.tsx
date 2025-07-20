"use client"
import ChatView from '@/components/core/ChatView'
import CodeView from '@/components/core/CodeView'
import Header from '@/components/core/Header'
import { useIsMobile } from '@/hooks/use-mobile'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const Page = () => {
    const [toggleChat, setToggleChat] = useState(true)
    const [toggleCode, setToggleCode] = useState(false)
    const [codeSheetOpen, setCodeSheetOpen] = useState(false)

   
    const isMobile = useIsMobile()

    const toggleCodeView = () => {
        if (isMobile) {
            setCodeSheetOpen(true)
        } else {
            setToggleCode(!toggleCode)
            setToggleChat(true)
        }
    }

    const toggleChatView = () => {
        if (isMobile) {
            setCodeSheetOpen(false)
        } else {
            setToggleChat(!toggleChat)
            setToggleCode(true)
        }
    }

    const handleCodeSheetChange = (open: boolean) => {
        setCodeSheetOpen(open)
    }

    useEffect(() => {
        if (isMobile) {
            setToggleChat(true)
            setToggleCode(false)
        } else {
            if (codeSheetOpen) {
                setToggleCode(true)
                setCodeSheetOpen(false)
            }
        }
    }, [isMobile, codeSheetOpen])

    return (
        <>
            <Header toggleCodeView={toggleCodeView} codeView={isMobile ? codeSheetOpen : toggleCode}/>
            <section className='flex gap-2 p-2 pt-0 relative overflow-hidden h-[92dvh]'>
                {}
                {!isMobile && (
                    <motion.div
                        className="flex gap-2 w-full h-full"
                        layout
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <AnimatePresence mode="popLayout">
                            {toggleChat && (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, x: -50, width: 0 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        width: toggleCode ? "30%" : "100%",
                                        maxWidth: toggleCode ? "56rem" : "56rem"
                                    }}
                                    exit={{ opacity: 0, x: -1000, width: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="mx-auto min-w-[300px]"
                                    layout
                                >
                                    <ChatView
                                        // messages={messages}
                                        // isLoading={isLoading}
                                        // error={error}
                                        // reload={reload}
                                        // append={append}
                                        // status={status}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <AnimatePresence mode="popLayout">
                            {toggleCode && (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0, x: 50, width: 0 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        width: toggleChat ? "70%" : "100%"
                                    }}
                                    exit={{ opacity: 0, x: 1000, width: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    layout
                                >
                                    <CodeView
                                        toggleChatView={toggleChatView}
                                        chatView={toggleChat}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
                
                {}
                {isMobile && (
                    <>
                        <ChatView
                        // messages={messages}
                        // isLoading={isLoading}
                        // error={error}
                        // reload={reload}
                        // append={append}
                        // status={status}
                        />
                        <CodeView
                            toggleChatView={toggleChatView}
                            chatView={toggleChat}
                            isOpen={codeSheetOpen}
                            onOpenChange={handleCodeSheetChange}
                        />
                    </>
                )}
            </section>
        </>
    )
}

export default Page