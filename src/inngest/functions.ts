import { inngest } from "./client";
import { createAgent, openai } from "@inngest/agent-kit";
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        const codeAgent = createAgent({
            name: "codeAgent",
            system: "You are an expert nextjs developer.  You write readable, maintainable, and performant react and nextjs code.",
            model: openai({ model: "openai", apiKey: process.env.OPENAI_API_KEY, baseUrl: process.env.OPENAI_API_BASE_URL }),
        });
        const { output } = await codeAgent.run(
            `Write the following snippet ${event.data.value}`
        );
        return { output };
    },
);