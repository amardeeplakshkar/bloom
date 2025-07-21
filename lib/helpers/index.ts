export interface FileWithPreview {
    id: string;
    file: File;
    preview?: string;
    type: string;
    uploadStatus: "pending" | "uploading" | "complete" | "error";
    uploadProgress?: number;
    abortController?: AbortController;
    textContent?: string;
  }
  
  export interface PastedContent {
    id: string;
    content: string;
    timestamp: Date;
    wordCount: number;
  }
  
  export interface ModelOption {
    id: string;
    name: string;
    description: string;
    badge?: string;
  }
  
  export interface ChatInputProps {
    onSendMessage?: (
      message: string,
      files: FileWithPreview[],
      pastedContent: PastedContent[]
    ) => void;
    disabled?: boolean;
    placeholder?: string;
    maxFiles?: number;
    maxFileSize?: number; 
    acceptedFileTypes?: string[];
    models?: ModelOption[];
    defaultModel?: string;
    setSelectedChatModel: (model: string) => void;
  }
  
  export const MAX_FILES = 10;
  export const MAX_FILE_SIZE = 50 * 1024 * 1024; 
  export const PASTE_THRESHOLD = 200; 
  export const DEFAULT_MODELS_INTERNAL: ModelOption[] = [
    {
      id: "claude-sonnet-4",
      name: "Claude Sonnet 4",
      description: "Balanced model",
      badge: "Latest",
    },
    {
      id: "claude-opus-3.5",
      name: "Claude Opus 3.5",
      description: "Highest intelligence",
    },
    {
      id: "claude-haiku-3",
      name: "Claude Haiku 3",
      description: "Fastest responses",
    },
  ];

  export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };
  
  export const getFileTypeLabel = (type: string): string => {
    const parts = type.split("/");
    let label = parts[parts.length - 1].toUpperCase();
    if (label.length > 7 && label.includes("-")) {
      label = label.substring(0, label.indexOf("-"));
    }
    if (label.length > 10) {
      label = label.substring(0, 10) + "...";
    }
    return label;
  };
  
  export const isTextualFile = (file: File): boolean => {
    const textualTypes = [
      "text/",
      "application/json",
      "application/xml",
      "application/javascript",
      "application/typescript",
      "application/pdf",
    ];
  
   const textualExtensions = [
      "txt",
      "md",
      "py",
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "htm",
      "css",
      "scss",
      "sass",
      "json",
      "xml",
      "yaml",
      "yml",
      "csv",
      "sql",
      "sh",
      "bash",
      "php",
      "rb",
      "go",
      "java",
      "c",
      "cpp",
      "h",
      "hpp",
      "cs",
      "rs",
      "swift",
      "kt",
      "scala",
      "r",
      "vue",
      "svelte",
      "astro",
      "config",
      "conf",
      "ini",
      "toml",
      "log",
      "gitignore",
      "dockerfile",
      "makefile",
      "readme",
      "pdf",
    ];
  
    const isTextualMimeType = textualTypes.some((type) =>
      file.type.toLowerCase().startsWith(type)
    );
  
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const isTextualExtension =
      textualExtensions.includes(extension) ||
      file.name.toLowerCase().includes("readme") ||
      file.name.toLowerCase().includes("dockerfile") ||
      file.name.toLowerCase().includes("makefile");
  
    return isTextualMimeType || isTextualExtension;
  };
  
  export const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };
  
  export const getFileExtension = (filename: string): string => {
    const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
    return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
  };

  