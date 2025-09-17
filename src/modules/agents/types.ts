import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { AppRoute } from "next/dist/build/swc/types";

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"]
export type AgentGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"]