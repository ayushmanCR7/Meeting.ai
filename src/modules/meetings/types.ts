import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { AppRoute } from "next/dist/build/swc/types";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"]
export enum MeetingStatus {
Upcoming =  "upcoming",
Active = "active",
Completed = "completed",
Processing = "processing",
Cancelled = "cancelled",
}