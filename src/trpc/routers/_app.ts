
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/src/inngest/client';
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      }),
    )
    .mutation(async({input})=>{
        await inngest.send({
            name: "test/hello.world",
            data: {
                value: input.value
            }
        })
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;
