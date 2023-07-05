import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { topicRouter } from "./routers/topic";
import { snippetRouter } from "./routers/snippet";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  topic: topicRouter,
  snippet: snippetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
