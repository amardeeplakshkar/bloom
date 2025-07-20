import React, { useEffect, useMemo, useRef } from 'react'
import { ChatInput } from './ChatInput'
import { FileWithPreview, PastedContent, isTextualFile, readFileAsText } from '@/lib/helpers';
import { ScrollArea } from '../ui/scroll-area';
import {  rmComponents } from '@/lib/helpers/renders';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatView = ({
  messages,
  isLoading,
  error,
  reload,
  append,
  status
}: {
  messages?: any[];
  isLoading?: any;
  error?: any;
  reload?: any;
  append?: any;
  status?: any;
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userMessageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const handleSendMessage = async (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => {
    const attachments: any[] = [];

    for (const fileWithPreview of files) {
      const file = fileWithPreview.file;

      if (file.type.startsWith('image/')) {

        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        attachments.push({
          name: file.name,
          contentType: file.type,
          url: base64
        });
      } else if (isTextualFile(file)) {

        const textContent = fileWithPreview.textContent || await readFileAsText(file);

        const base64 = `data:${file.type};base64,${btoa(unescape(encodeURIComponent(textContent)))}`;

        attachments.push({
          name: file.name,
          contentType: file.type,
          url: base64
        });
      }
    }
    let fullMessage = message;
    if (pastedContent.length > 0) {
      fullMessage += '\n\nPasted Content:\n' + pastedContent.map(p => p.content).join('\n\n');
    }

    await append({
      role: 'user',
      content: fullMessage,
      experimental_attachments: attachments
    });
  };

  const scrollToMessage = () => {
    if (!messages || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];

    
    if (lastMessage.role === 'user') {
      const userMessageElement = userMessageRefs.current.get(lastMessage.id);
      if (userMessageElement && messagesContainerRef.current) {
        
        const containerTop = messagesContainerRef.current.getBoundingClientRect().top;
        const messageTop = userMessageElement.getBoundingClientRect().top;
        const scrollOffset = messageTop - containerTop - 20; 

        messagesContainerRef.current.scrollBy({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    } else {
      
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  const isWaitingForResponse = useMemo(() => {
    if (!messages || messages.length === 0) return false;
    return messages[messages.length - 1].role === 'user';
  }, [messages]);

  
  useEffect(() => {
    scrollToMessage();
  }, [messages]);

  
  const setUserMessageRef = (element: HTMLDivElement | null, messageId: string) => {
    if (element) {
      userMessageRefs.current.set(messageId, element);
    }
  };
  return (
    <div className='h-[92dvh] flex flex-col w-full'>
      <ScrollArea ref={messagesContainerRef} className='flex-1 overflow-y-auto *:pb-4'>
        {
          messages?.map((message, index) => (
            <div ref={message.role === 'user' ? (el) => setUserMessageRef(el, message.id) : undefined} className={`p-2 flex flex-col ${message.role === 'user' ? 'flex-row-reverse' : 'w-[80%]'}`} key={index}>
            <div className={` break-words ${message.role === 'user' ? 'bg-secondary/5 p-2 px-4 rounded-lg border' : ''}`}>
            {
              message.role === 'assistant' && (
                <div className='flex items-center gap-2'>
                <img src="/media/bloom.svg" alt="" className={`w-5.5 h-5.5 ${message.id === messages[messages.length - 1].id && isLoading ? 'animate-spin' : ''}`}/>
                <p className='text-lg text-secondary'>Bloom</p>
                </div>
              )
            }
             <Markdown
               components={rmComponents}
            remarkPlugins={[remarkGfm]}
>{message.content}</Markdown>
            </div>
            </div>
          ))
        }
        {isWaitingForResponse ? <div className="h-[60dvh]" /> : <div className="" />}
      </ScrollArea>
      <ChatInput
        setSelectedChatModel={() => { }}
        onSendMessage={handleSendMessage}
        maxFiles={10}
        maxFileSize={10 * 1024 * 1024}
        disabled={isLoading}
      />
    </div>
  )
}

export default ChatView