import {z} from "zod"
import {baseProcedure,createTRPCRouter} from "../init"
import { agents } from "@/db/schems"
import { agentsRouter } from "@/modules/agents/server/procedure"
export const appRouter = createTRPCRouter({
    agents: agentsRouter
})

export type AppRouter = typeof appRouter