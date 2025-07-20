import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export type TreeItem = string |[string ,...TreeItem[]];
export  const SANDBOX_TIMEOUT =  60_000 * 10 * 3;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import Sandbox from "@e2b/code-interpreter";
import { TextMessage, AgentResult, Message } from "@inngest/agent-kit";

export async function getSandbox(sandboxId :string) {
   
    const sandbox =await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(SANDBOX_TIMEOUT);
    return sandbox;
};
export function lastAssistantTextMessageContent(result : AgentResult){
   const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant",
   );
   const message = result.output[lastAssistantTextMessageIndex] as
   |TextMessage
   |undefined;
   
   return message?.content?typeof message.content === "string"
   ?message.content
   :message.content.map((c)=>c.text).join("")
   :undefined;
};

export const parseAgentOutput = (value: Message[]) => {
    const output = value[0];
  
    if (output.type !== "text") {
      return "Fragment";
    }
  
    if (Array.isArray(output.content)) {
      return output.content.map((txt) => txt).join("");
    } else {
      return output.content;
    }
  };

export function convertFilesToTreeItems(
  files: Record<string, string>
): TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = null; 
  }

  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        children.push(key);
      } else {
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}

