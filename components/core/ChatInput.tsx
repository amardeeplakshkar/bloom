'use client'

import { cn } from "@/lib/utils";
import { ImageIcon, Plus, SlidersHorizontal, ArrowUp, AlertCircle, Copy, Loader2, X, Globe, Lightbulb, PenTool, Telescope } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useRef, useEffect, useCallback } from "react";
import { formatFileSize, getFileExtension, getFileTypeLabel, isTextualFile, readFileAsText, ChatInputProps, DEFAULT_MODELS_INTERNAL, FileWithPreview, MAX_FILE_SIZE, PASTE_THRESHOLD, PastedContent } from "@/lib/helpers";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const FilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  const isTextual = isTextualFile(file.file);

  if (isTextual) {
    return <TextualFilePreviewCard file={file} onRemove={onRemove} />;
  }

  return (
    <div
      className={cn(
        "relative group bg-zinc-700 border w-fit border-zinc-600 rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden",
        isImage ? "p-0" : "p-3"
      )}
    >
      <div className="flex items-start gap-3 size-[125px] overflow-hidden">
        {isImage && file.preview ? (
          <div className="relative size-full rounded-md overflow-hidden bg-zinc-600">
            <img
              src={file.preview || "/placeholder.svg"}
              alt={file.file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <></>
        )}
        {!isImage && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
                <p className="absolute bottom-2 left-2 capitalize text-white text-xs bg-zinc-800 border  px-2 py-1 rounded-md">
                  {getFileTypeLabel(file.type)}
                </p>
              </div>
              {file.uploadStatus === "uploading" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
              )}
              {file.uploadStatus === "error" && (
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
              )}
            </div>

            <p
              className="max-w-[90%] text-xs font-medium text-zinc-100 truncate"
              title={file.file.name}
            >
              {file.file.name}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">
              {formatFileSize(file.file.size)}
            </p>
          </div>
        )}
      </div>
      <Button
        size="icon"
        variant="outline"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
        onClick={() => onRemove(file.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const PastedContentCard: React.FC<{
  content: PastedContent;
  onRemove: (id: string) => void;
}> = ({ content, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = content.content.slice(0, 150);
  const needsTruncation = content.content.length > 150;

  return (
    <div className="bg-zinc-700 border border-zinc-600 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden">
      <div className="text-[8px] text-zinc-300 whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar">
        {isExpanded || !needsTruncation ? content.content : previewText}
        {!isExpanded && needsTruncation && "..."}
      </div>
      {}
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
        <p className="capitalize text-white text-xs bg-zinc-800 border  px-2 py-1 rounded-md">
          PASTED
        </p>
        {}
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => navigator.clipboard.writeText(content.content)}
            title="Copy content"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(content.id)}
            title="Remove content"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const TextualFilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = file.textContent?.slice(0, 150) || "";
  const needsTruncation = (file.textContent?.length || 0) > 150;
  const fileExtension = getFileExtension(file.file.name);

  return (
    <div className="bg-zinc-700 border border-zinc-600 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden">
      <div className="text-[8px] text-zinc-300 whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar">
        {file.textContent ? (
          <>
            {isExpanded || !needsTruncation ? file.textContent : previewText}
            {!isExpanded && needsTruncation && "..."}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      {}
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-[#30302E] from-transparent overflow-hidden">
        <p className="capitalize text-white text-xs bg-zinc-800 border  px-2 py-1 rounded-md">
          {fileExtension}
        </p>
        {}
        {file.uploadStatus === "uploading" && (
          <div className="absolute top-2 left-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          </div>
        )}
        {file.uploadStatus === "error" && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          </div>
        )}
        {}
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          {file.textContent && (
            <Button
              size="icon"
              variant="outline"
              className="size-6"
              onClick={() =>
                navigator.clipboard.writeText(file.textContent || "")
              }
              title="Copy content"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(file.id)}
            title="Remove file"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const toolsList = [
  {
    id: 'searchWeb',
    name: 'Search the web',
    shortName: 'Search',
    icon: Globe,
    borderColor: 'border-blue-500',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    placeholder: 'Search the web',
    model: "search-model"
  },
  {
    id: 'writeCode',
    name: 'Write or code',
    shortName: 'Canvas',
    color: 'text-green-500',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/20',
    placeholder: 'Write or code',
    icon: PenTool,
    model: "artifact-model"
  },
  {
    id: 'thinkLonger',
    name: 'Think for longer',
    shortName: 'Think',
    icon: Lightbulb,
    color: 'text-yellow-500',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/20',
    placeholder: 'Think for longer',
    model: "chat-model-reasoning"
  },
  {
    id: 'deepResearch',
    name: 'Run deep research',
    shortName: 'Deep Research',
    icon: Telescope,
    borderColor: 'border-violet-500',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/20',
    placeholder: 'Run deep research',
    model: 'chat-model-deepresearch'
  },
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  maxFiles = MAX_FILE_SIZE,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFileTypes,
  setSelectedChatModel
}) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const activeTool = selectedTool ? toolsList.find(t => t.id === selectedTool) : null;
  const [placeholderText, setPlaceholderText] = useState("How can I help you today?");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight =
        Number.parseInt(getComputedStyle(textareaRef.current).maxHeight, 10) ||
        120;
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [message]);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const currentFileCount = files.length;
      if (currentFileCount >= maxFiles) {
        alert(
          `Maximum ${maxFiles} files allowed. Please remove some files to add new ones.`
        );
        return;
      }

      const availableSlots = maxFiles - currentFileCount;
      const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);

      if (selectedFiles.length > availableSlots) {
        alert(
          `You can only add ${availableSlots} more file(s). ${selectedFiles.length - availableSlots
          } file(s) were not added.`
        );
      }

      const newFiles = filesToAdd
        .filter((file) => {
          if (file.size > maxFileSize) {
            alert(
              `File ${file.name} (${formatFileSize(
                file.size
              )}) exceeds size limit of ${formatFileSize(maxFileSize)}.`
            );
            return false;
          }
          if (
            acceptedFileTypes &&
            !acceptedFileTypes.some(
              (type) =>
                file.type.includes(type) || type === file.name.split(".").pop()
            )
          ) {
            alert(
              `File type for ${file.name
              } not supported. Accepted types: ${acceptedFileTypes.join(", ")}`
            );
            return false;
          }
          return true;
        })
        .map((file) => ({
          id: Math.random().toString(),
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
          type: file.type || "application/octet-stream",
          uploadStatus: "pending" as const,
          uploadProgress: 0,
        }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((fileToUpload) => {

        if (isTextualFile(fileToUpload.file)) {
          readFileAsText(fileToUpload.file)
            .then((textContent) => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileToUpload.id ? { ...f, textContent } : f
                )
              );
            })
            .catch((error) => {
              console.error("Error reading file content:", error);
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileToUpload.id
                    ? { ...f, textContent: "Error reading file content" }
                    : f
                )
              );
            });
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileToUpload.id ? { ...f, uploadStatus: "uploading" } : f
          )
        );

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileToUpload.id
                  ? { ...f, uploadStatus: "complete", uploadProgress: 100 }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileToUpload.id
                  ? { ...f, uploadProgress: progress }
                  : f
              )
            );
          }
        }, 150);
      });
    },
    [files.length, maxFiles, maxFileSize, acceptedFileTypes]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = e.clipboardData;
      const items = clipboardData.items;

      const fileItems = Array.from(items).filter(
        (item) => item.kind === "file"
      );
      if (fileItems.length > 0 && files.length < maxFiles) {
        e.preventDefault();
        const pastedFiles = fileItems
          .map((item) => item.getAsFile())
          .filter(Boolean) as File[];
        const dataTransfer = new DataTransfer();
        pastedFiles.forEach((file) => dataTransfer.items.add(file));
        handleFileSelect(dataTransfer.files);
        return;
      }

      const textData = clipboardData.getData("text");
      if (
        textData &&
        textData.length > PASTE_THRESHOLD &&
        pastedContent.length < 5
      ) {

        e.preventDefault();
        setMessage(message + textData.slice(0, PASTE_THRESHOLD) + "...");

        const pastedItem: PastedContent = {
          id: nanoid(),
          content: textData,
          timestamp: new Date(),
          wordCount: textData.split(/\s+/).filter(Boolean).length,
        };

        setPastedContent((prev) => [...prev, pastedItem]);
      }
    },
    [handleFileSelect, files.length, maxFiles, pastedContent.length, message]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const handleSend = useCallback(() => {
    if (
      disabled ||
      (!message.trim() && files.length === 0 && pastedContent.length === 0)
    )
      return;
    if (files.some((f) => f.uploadStatus === "uploading")) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    onSendMessage?.(message, files, pastedContent);

    setMessage("");
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setPastedContent([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [message, files, pastedContent, disabled, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const hasContent =
    message.trim() || files.length > 0 || pastedContent.length > 0;
  const canSend =
    hasContent &&
    !disabled &&
    !files.some((f) => f.uploadStatus === "uploading");

  return (
    <div
      className="relative w-full rounded-xl max-w-4xl mx-auto bg-background"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        filter: 'drop-shadow(0 -20px 15px rgba(38, 38, 36, 0.25))'
      }}
    >

      {isDragging && (
        <div className="absolute  inset-0 z-50  border-2 border-dashed border-blue-500 rounded-xl flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-blue-500 flex items-center gap-2">
            <ImageIcon className="size-4 opacity-50" />
            Drop files here to add to chat
          </p>
        </div>
      )}

      <div className=" overflow-hidden border  rounded-xl shadow-lg items-end gap-2   min-h-[150px] flex flex-col">
        {(files.length > 0 || pastedContent.length > 0) && (
          <div className="overflow-x-auto border-t-[1px] p-3  w-full  hide-scroll-bar">
            <div className="flex gap-3">
              {pastedContent.map((content) => (
                <PastedContentCard
                  key={content.id}
                  content={content}
                  onRemove={(id) =>
                    setPastedContent((prev) => prev.filter((c) => c.id !== id))
                  }
                />
              ))}
              {files.map((file) => (
                <FilePreviewCard
                  key={file.id}
                  file={file}
                  onRemove={removeFile}
                />
              ))}
            </div>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={disabled}
          className="flex-1 min-h-[100px] w-full p-4 focus-within:border-none focus:outline-none focus:border-none border-none outline-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:outline-none max-h-[120px] resize-none border-0 bg-transparent  shadow-none focus-visible:ring-0 placeholder:text-zinc-500 text-sm sm:text-base custom-scrollbar"
          rows={1}
        />
        <div className="flex items-center gap-2 justify-between w-full px-3 pb-1.5">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 p-0 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
              title={
                files.length >= maxFiles
                  ? `Max ${maxFiles} files reached`
                  : "Attach files"
              }
            >
              <Plus className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 p-0 flex-shrink-0"
                  disabled={disabled}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup className="flex flex-col gap-1">
                  {toolsList.map(tool => (
                    <DropdownMenuItem
                      key={tool.id}
                      onClick={() => {
                        setSelectedTool(tool.id);
                        setSelectedChatModel(tool.model);
                        setPlaceholderText(tool.placeholder);
                      }}
                      className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-secondary/5"
                    >
                      <tool.icon className="h-4 w-4" />
                      <span>{tool.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {activeTool && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTool(null);
                  setSelectedChatModel('chat-model');
                  setPlaceholderText("How can I help you today?");
                }}
                className={cn(
                  "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                  activeTool.bgColor,
                  activeTool.borderColor,
                  activeTool.color
                )}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <motion.div
                    key={activeTool.id}
                    animate={{ rotate: 360, scale: 1.1 }}
                    whileHover={{ rotate: 360, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  >
                    {activeTool.icon && <activeTool.icon className={cn("w-4 h-4", activeTool.color)} />}
                  </motion.div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTool.id}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("text-xs overflow-hidden whitespace-nowrap flex-shrink-0", activeTool.color)}
                  >
                    {activeTool.shortName}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              className={cn(
                "h-9 w-9 p-0 flex-shrink-0 rounded-md transition-colors",
                canSend
                  ? ""
                  : "cursor-not-allowed"
              )}
              onClick={handleSend}
              disabled={!canSend}
              title="Send message"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedFileTypes?.join(",")}
        onChange={(e) => {
          handleFileSelect(e.target.files);
          if (e.target) e.target.value = "";
        }}
      />
    </div>
  );
};