import { convertFilesToTreeItems } from "@/lib/utils";
import { CopyIcon, CopyCheckIcon } from "lucide-react";
import { Fragment, useState, useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, Breadcrumb, BreadcrumbList } from "../ui/breadcrumb";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable";
import CodeView from "./CodeView";
import Hint from "./Hint";
import { TreeView } from "./TreeView";
import { Editor } from "@monaco-editor/react";

type FileCollection = { [path: string]: string };

function getLanguageFormExtension(filename: string): string {
    const extnsion = filename.split(".").pop()?.toLocaleLowerCase();
    return extnsion || "text";

};

interface FileBreadcrumbProps {
    filePath: string,

}

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
    const pathSegmanets = filePath.split("/");
    const maxSegments = 3;

    const renderBredcrumbItems = () => {
        if (pathSegmanets.length <= maxSegments) {
            return pathSegmanets.map((segment, index) => {
                const isLast = index === pathSegmanets.length - 1;

                return (
                    <Fragment key={index}

                    >
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className='font-medium'>
                                    {segment}
                                </BreadcrumbPage>

                            ) : (
                                <span className="text-muted-foreground">
                                    {segment}
                                </span>
                            )

                            }
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )

            })

        }
        else {
            const firstSegment = pathSegmanets[0];
            const lastSegment = pathSegmanets.length - 1;
            return (
                <>
                    <BreadcrumbItem>
                        
                            <span className='text-muted-foreground'>
                                {firstSegment}
                            </span>
                        <BreadcrumbSeparator>
                        <BreadcrumbItem>
                        <BreadcrumbEllipsis/>
                        </BreadcrumbItem>
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                        <BreadcrumbPage className='font-medium'>
                        {lastSegment}
                        </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )

        }
    }

    return(
       <Breadcrumb >
         <BreadcrumbList>
         
           {renderBredcrumbItems()}
         </BreadcrumbList>
       
       </Breadcrumb> 
    )
};

interface FileExplorerProps {
    files: FileCollection,

}

const FileExplorer = ({ files }: FileExplorerProps) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);

        console.log(fileKeys);

        return fileKeys.length > 0 ? fileKeys[0] : null;
    });

    const [copied, setCopied] = useState(false);

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    }, [files]);

    const handleFilesSelect = useCallback((filepath: string) => {

        if (files[filepath]) {
           
            setSelectedFile(filepath);
        }

    }, [files])

    const handleCopy = () => {
        if (!selectedFile) return;
        navigator.clipboard.writeText(files[selectedFile]);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };
    

    return (

        <ResizablePanelGroup direction="horizontal">

            <ResizablePanel defaultSize={30} minSize={30} className='bg-sidebar'>
                <TreeView
                    data={treeData}
                    value={selectedFile}
                    onSelect={handleFilesSelect}
                   />

            </ResizablePanel>

            <ResizableHandle className="hover:bg-primary transition-colors" />

            <ResizablePanel defaultSize={70} minSize={50} >

                {selectedFile && files[selectedFile] ? (

                    <div className="h-full w-full flex flex-col">

                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                                         <FileBreadcrumb filePath={selectedFile}/>
                            <Hint text="copy to clipboard" side="bottom">
                                <Button
                                    variant={"outline"}
                                    size="icon"
                                    className='ml-auto'
                                    disabled={copied}
                                    onClick={handleCopy}
                                >
                                   { copied  ? <CopyIcon /> : <CopyCheckIcon/>}
                                </Button>

                            </Hint>

                        </div>

                        <div className="flex-1 overflow-auto ">
                        <Editor
                        defaultLanguage="javascript"
                        theme='vs-dark'
                        options={{
                            minimap: {
                                enabled: false
                            },
                            formatOnType: true,
                            formatOnPaste: true,
                        }}
                        value={files[selectedFile]}
                        className='overflow-auto border-r flex-4/5 h-full'
                    />

                        </div>

                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view its content
                    </div>
                )}

            </ResizablePanel>

        </ResizablePanelGroup>
    )
}

export default FileExplorer