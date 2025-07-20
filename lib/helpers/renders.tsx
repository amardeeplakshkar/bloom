import { TableHeader, TableBody, TableRow, TableHead, TableCell, Table } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const components = {
  pre: {
    component: ({ children }: any) => <>{children}</>,
  },
  ol: {
    component: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    }
  },
  li: {
    component: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
      </li>
    );
    }
  },
  ul: {
    component: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    }
  },
  strong: {
    component: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
    );
    }
  },
  a: {
    component: ({ node, children, ...props }: any) => {
    return (
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        {...props}
      >
        {children}
      </Link>
    );
    }
  },
  h1: {
    component: ({ node, children, ...props }: any) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
    }
  },
  h2: {
    component: ({ node, children, ...props }: any) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
    }
  },
  h3: {
    component: ({ node, children, ...props }: any) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
    }
  },
  h4: {
    component: ({ node, children, ...props }: any) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
    }
  },
  h5: {
    component: ({ node, children, ...props }: any) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
    }
  },
  h6: {
    component: ({ node, children, ...props }: any) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
    }
  },
  table: {
    component: ({ node, className, children, ...props }: any) => {
    return (
      <div className="my-4 w-full overflow-x-auto">
        <Table className="rounded overflow-hidden" {...props}>
          {children}
        </Table>
      </div>
    );
    }
  },
  thead: {
    component: ({ node, ...props }: any) => {
    return <TableHeader {...props} />;
    }
  },
  tbody: {
    component: ({ node, ...props }: any) => {
    return <TableBody {...props} />;
    }
  },
  tr: {
    component: ({ node, ...props }: any) => {
    return <TableRow {...props} />;
    }
  },
  th: {
    component: ({ node, ...props }: any) => {
    return <TableHead className="" {...props} />;
    }
  },
  td: {
    component: ({ node, ...props }: any) => {
    return <TableCell className="" {...props} />;
    }
  },
  p: {
    component: ({ node, ...props }: any) => {
    return <p style={{
      wordBreak: 'break-word',
    }} {...props} />;
    }
  },
  blockquote: {
    component: ({ node, ...props }: any) => {
    return (
      <blockquote
        className="border-l-4 pl-4 italic text-muted-foreground"
        {...props}
      />
    );
    }
  },

  hr: {
    component: ({ node, ...props }: any) => {
    return <Separator className="my-6" {...props} />;
    }
  },

  em: {
    component: ({ node, ...props }: any) => {
    return <em className="italic" {...props} />;
    }
  },

  del: {
    component: ({ node, ...props }: any) => {
    return <del className="line-through text-muted-foreground" {...props} />;
    }
  },
  code: {
    component: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "") || "";
    return !inline && match ? (
      <div className="w-full max-w-[80dvw] whitespace-pre-wrap border bg-secondary/5 p-2 px-4 rounded-lg">{children}</div>
    ) : (
      <Badge className="whitespace-pre-wrap" {...props}>
        {children}
      </Badge>
    );
  }
}
}

export const rmComponents = {
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "") || "";
    return !inline && match ? (
      <div className="w-full max-w-[80dvw] whitespace-pre-wrap border bg-secondary/5 p-2 px-4 rounded-lg">{children}</div>
    ) : (
      <Badge className="whitespace-pre-wrap" {...props}>
        {children}
      </Badge>
    );
},
  pre: ({ children }: any) => <>{children}</>,
  ol: ({ node, children, ...props }: any) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }: any) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }: any) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }: any) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }: any) => {
    return (
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }: any) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }: any) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }: any) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }: any) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }: any) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }: any) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  table({ node, className, children, ...props }: any) {
    return (
      <div className="my-4 w-full overflow-x-auto">
        <Table className="rounded overflow-hidden" {...props}>
          {children}
        </Table>
      </div>
    );
  },
  thead({ node, ...props }: any) {
    return <TableHeader {...props} />;
  },
  tbody({ node, ...props }: any) {
    return <TableBody {...props} />;
  },
  tr({ node, ...props }: any) {
    return <TableRow {...props} />;
  },
  th({ node, ...props }: any) {
    return <TableHead className="" {...props} />;
  },
  td({ node, ...props }: any) {
    return <TableCell className="" {...props} />;
  },
  p({ node, ...props }: any) {
    return <p style={{
      wordBreak: 'break-word',
    }} {...props} />;
  },
  blockquote({ node, ...props }: any) {
    return (
      <blockquote
        className="border-l-4 pl-4 italic text-muted-foreground"
        {...props}
      />
    );
  },

  hr({ node, ...props }: any) {
    return <Separator className="my-6" {...props} />;
  },

  em({ node, ...props }: any) {
    return <em className="italic" {...props} />;
  },

  del({ node, ...props }: any) {
    return <del className="line-through text-muted-foreground" {...props} />;
  },
}