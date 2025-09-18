import { db } from "@/db";
import { agents, meetings } from "@/db/schems";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { optional } from "better-auth";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
    create: protectedProcedure.input(meetingsInsertSchema).mutation(async ({ input, ctx }) => {
        const [createdMeetings] = await db.insert(meetings).values({ ...input, userId: ctx.auth.user.id }).returning();

        const call = streamVideo.video.call("default",createdMeetings.id);
        await call.create({
            data:{
                created_by_id: ctx.auth.user.id,
                custom:{
                    meetingId: createdMeetings.id,
                    meetingName: createdMeetings.name
                },
                settings_override:{
                    transcription:{
                        language: "en",
                        mode: "auto-on",
                        closed_caption_mode: "auto-on"
                    },
                    recording:{
                        mode: "auto-on",
                        quality: "1080p"
                    }
                }
            }
        })
        const [exisitingGAnet] = await db.select().from(agents).where(eq(agents.id,createdMeetings.agentId))
        if(!exisitingGAnet) {
            throw new TRPCError({
                code: "NOT_FOUND",message: 'Agent not found'
            })
        }
        await streamVideo.upsertUsers([
            {
                id: exisitingGAnet.id,
                name: exisitingGAnet.name,
                role: "user",
                image: generateAvatarUri({
                    seed: exisitingGAnet.name,
                    variant: "botttsNeutral"
                })
            }
        ])
        return createdMeetings
    }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const [exisitingmeetings] = await db.select(
            {
                ...getTableColumns(meetings),
                agent: agents,
                 duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),

            }
        ).from(meetings).innerJoin(agents,eq(meetings.agentId,agents.id)).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
        if (!exisitingmeetings) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
        }
        return exisitingmeetings
    }),
    getMany: protectedProcedure.input(z.object({
        page: z.number().default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([MeetingStatus.Active, MeetingStatus.Cancelled, MeetingStatus.Completed, MeetingStatus.Processing, MeetingStatus.Upcoming]).nullish()
    })).
        query(async ({ ctx, input }) => {
            const { search, page, pageSize, status, agentId } = input;
            const data = await db.select(
                {
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),

                }
            ).from(meetings).innerJoin(agents, eq(meetings.agentId, agents.id)).where(and(eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined, status ? eq(meetings.status, status) : undefined, agentId ? eq(meetings.agentId, agentId) : undefined
            )).orderBy(desc(meetings.createdAt), desc(meetings.id)).limit(pageSize).offset((page - 1) * pageSize)
            const [total] = await db.select({ count: count() }).from(meetings).innerJoin(agents, eq(meetings.agentId, agents.id)).where(and(eq(meetings.userId, ctx.auth.user.id), search ? ilike(meetings.name, `%${search}%`) : undefined, status ? eq(meetings.status, status) : undefined, agentId ? eq(meetings.agentId, agentId) : undefined))
            const totalPages = Math.ceil(total.count / pageSize)
            return {
                items: data,
                total: total.count,
                totalPages
            };
        }),
    update: protectedProcedure.input(meetingsUpdateSchema).mutation(async ({ ctx, input }) => {
        const [updatedAgent] = await db.update(meetings).set(input).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))).returning()
        if (!updatedAgent) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not foumd",
            })
        }
        return updatedAgent
    }),
    remove: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({ ctx, input }) => {
        const [removedMeeting] = await db.delete(meetings).where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))).returning()
        if (!removedMeeting) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not foumd",
            })
        }
        return removedMeeting
    }),
    generateToken: protectedProcedure.mutation(async({ctx}) =>{
        await streamVideo.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name,
                role: "admin",
                image: ctx.auth.user.image ?? generateAvatarUri({seed: ctx.auth.user.name,variant: "initials"})
            }
        ])
        const expirationTime = Math.floor(Date.now()/1000)+3600
    const issuedAt = Math.floor(Date.now()/1000) -60

    const token = streamVideo.generateUserToken({
        user_id: ctx.auth.user.id,
    })
    return token
    })
    

})