
import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/src/modules/messages/server/procedures';
import { projectsRouter } from '@/src/modules/projects/server/procedures';
import { usageRouter } from '@/src/modules/usage/server/procedures';

export const appRouter = createTRPCRouter({
  usage: usageRouter,
  messages : messagesRouter,
  projects : projectsRouter,
});
export type AppRouter = typeof appRouter;
