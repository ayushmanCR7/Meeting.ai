import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { AppRoute } from "next/dist/build/swc/types";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]