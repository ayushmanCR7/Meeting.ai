import { db } from "@/db";
import { agents } from "@/db/schems";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { optional } from "better-auth";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    remove: protectedProcedure.input(z.object({id: z.string()})).mutation(async({ctx,input})=>{
        const [removedAgent] = await db.delete(agents).where(and(eq(agents.id,input.id),eq(agents.userId,ctx.auth.user.id)))
        .returning()
        if(!removedAgent){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not foumd",
            })
        }
        return removedAgent
    }),
    update: protectedProcedure.input(agentsUpdateSchema).mutation(async({ctx,input})=>{
        const [updatedAgent] = await db.update(agents).set(input).where(and(eq(agents.id,input.id),eq(agents.userId,ctx.auth.user.id))).returning()
        if(!updatedAgent){
             throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not foumd",
            })
        }
        return updatedAgent
    }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx,input }) => {
        const [existingData] = await db.select(
            {
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            }
        ).from(agents).where(and(eq(agents.id, input.id),eq(agents.userId,ctx.auth.user.id)))
        if(!existingData){
            throw new TRPCError({code: "NOT_FOUND",message: "Agent not found"})
        }
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