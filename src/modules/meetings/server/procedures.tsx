import { db } from "@/db";
import { agents, meetings } from "@/db/schems";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { optional } from "better-auth";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
    
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx,input }) => {
        const [exisitingmeetings] = await db.select(
            {
                ...getTableColumns(meetings),
            }
        ).from(meetings).where(and(eq(meetings.id, input.id),eq(meetings.userId,ctx.auth.user.id)))
        if(!exisitingmeetings){
            throw new TRPCError({code: "NOT_FOUND",message: "Agent not found"})
        }
        return exisitingmeetings
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
                ...getTableColumns(meetings),
            }
        ).from(meetings).where(and(eq(meetings.userId,ctx.auth.user.id),
       search? ilike(meetings.name, `%${search}%`): undefined
    )).orderBy(desc(meetings.createdAt),desc(meetings.id)).limit(pageSize).offset((page-1)*pageSize)
      const [total] = await db.select({count: count()}).from(meetings).where(and(eq(meetings.userId,ctx.auth.user.id),search? ilike(meetings.name, `%${search}%`):undefined))
      const totalPages = Math.ceil(total.count/pageSize)
        return {
            items:data,
            total: total.count,
            totalPages
        };
    })

})