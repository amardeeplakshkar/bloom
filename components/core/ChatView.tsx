import React, { useEffect, useMemo, useRef } from 'react'
import { ChatInput } from './ChatInput'
import { FileWithPreview, PastedContent, isTextualFile, readFileAsText } from '@/lib/helpers';
import { ScrollArea } from '../ui/scroll-area';
import { rmComponents } from '@/lib/helpers/renders';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Fragment } from '@/lib/generated/prisma';
import { useTRPC } from '@/src/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import MessageForm from './MessageForm';

const ChatView = ({
  isLoading,
  error,
  reload,
  append,
  status,
  projectId,
  setActiveFragment,
  activeFragment
}: {
  isLoading?: any;
  error?: any;
  reload?: any;
  append?: any;
  status?: any;
  projectId: string,
  setActiveFragment: (fragment: Fragment | null) => void,
  activeFragment: Fragment | null,
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
      role: 'USER',
      content: fullMessage,
      experimental_attachments: attachments
    });
  };

  const scrollToMessage = () => {
    if (!messages || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === 'USER') {
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

  const setUserMessageRef = (element: HTMLDivElement | null, messageId: string) => {
    if (element) {
      userMessageRefs.current.set(messageId, element);
    }
  };

  const buttonRef = useRef<HTMLDivElement>(null);
  const lastAssistanceMessageIdRef = useRef<string | null>(null);

  const trpc = useTRPC();

  const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
    projectId: projectId,
  }, {

    refetchInterval: 2000,

  }));

  useEffect(() => {

    const lastAssistanceMessage = messages?.findLast(
      (message) => message.role === "ASSISTANT" && !!message.fragment,
    );

    if (lastAssistanceMessage?.fragment &&
      lastAssistanceMessage.id !== lastAssistanceMessageIdRef.current
    ) {
      setActiveFragment(lastAssistanceMessage.fragment);
      lastAssistanceMessageIdRef.current = lastAssistanceMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    buttonRef.current?.scrollIntoView();
  }, [messages?.length]);

  const lastMessage = messages?.[messages?.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  const isWaitingForResponse = useMemo(() => {
    if (!messages || messages.length === 0) return false;
    return messages[messages.length - 1].role === 'USER';
  }, [messages]);

  useEffect(() => {
    scrollToMessage();
  }, [messages]);

  return (
    <div className='h-[92dvh] flex flex-col w-full'>
      <ScrollArea ref={messagesContainerRef} className='flex-1 overflow-y-auto *:pb-4'>
        {
          messages?.map((message, index) => (
            <div ref={message?.role === 'USER' ? (el) => setUserMessageRef(el, message?.id) : undefined} className={`p-2 flex  flex-col ${message?.role === 'USER' ? 'flex-row-reverse ' : 'w-[80%]'}`} key={index}>
              <div className={` break-words ${message?.role === 'USER' ? 'bg-secondary/5 w-[80%] p-2 px-4 rounded-lg border' : ''}`}>
                {
                  message?.role === 'ASSISTANT' && (
                    <div className='flex items-center gap-2'>
                      <img src="/media/bloom.svg" alt="" className={`w-5.5 h-5.5 ${message?.id === messages[messages.length - 1].id && isLoading ? 'animate-spin' : ''}`} />
                      <p className='text-lg'>Bloom</p>
                    </div>
                  )
                }
                <Markdown
                  components={rmComponents}
                  remarkPlugins={[remarkGfm]}
                >{message?.content}
                </Markdown>

              </div>
            </div>
          ))
        }
          { isLastMessageUser && "loading"}
        {isWaitingForResponse ? <div className="h-[60dvh]" /> : <div className="" />}
      </ScrollArea>
      <MessageForm projectId={projectId} />
    </div>
  )
}

export default ChatView