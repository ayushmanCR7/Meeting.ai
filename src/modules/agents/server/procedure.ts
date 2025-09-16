import { db } from "@/db";
import { agents } from "@/db/schems";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { optional } from "better-auth";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingData] = await db.select(
            {
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            }
        ).from(agents).where(eq(agents.id, input.id))
        return existingData
    }),
    getMany: protectedProcedure.input(z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().nullish()
    })).
        query(async ({ctx,input}) => {
            const {search,page,pageSize} = input;
        const data = await db.select(
            {
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            }
        ).from(agents).where(and(eq(agents.userId,ctx.auth.user.id),
       search? ilike(agents.name, `%${search}%`): undefined
    )).orderBy(desc(agents.createdAt),desc(agents.id)).limit(pageSize).offset((page-1)*pageSize)
      const [total] = await db.select({count: count()}).from(agents).where(and(eq(agents.userId,ctx.auth.user.id),search? ilike(agents.name, `%${search}%`):undefined))
      const totalPages = Math.ceil(total.count/pageSize)
        return {
            items:data,
            total: total.count,
            totalPages
        };
    }),
    create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ input, ctx }) => {
        const [createdAgent] = await db.insert(agents).values({ ...input, userId: ctx.auth.user.id }).returning();

        return createdAgent
    })

})