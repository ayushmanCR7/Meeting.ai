import { db } from "@/db";
import { agents } from "@/db/schems";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async()=>{
        const data = await db.select().from(agents)

        return data;
    })
})