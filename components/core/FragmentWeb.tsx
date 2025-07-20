import Hint from "@/components/core/Hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/lib/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon, Variable } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface props {
  data: Fragment
  fragmentKey: number
  setFragmentKey: Dispatch<SetStateAction<number>>
}



const FragmentWeb = ({ data, fragmentKey, setFragmentKey }: props) => {

  const [copied, setCopied] = useState(false);

  const onRefreash = () => {
    setFragmentKey((prev) => prev + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  };

  return (
    <div className="flex flex-col w-full h-full">
     

      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />



    </div>
  )
}

export default FragmentWeb