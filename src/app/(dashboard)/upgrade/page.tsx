import { auth } from "@/lib/auth";
import { UpgradeView, UpgradeViewError, UpgradeViewLoading } from "@/modules/premium/ui/views/upgrade-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { p } from "node_modules/better-auth/dist/shared/better-auth.C6qXK08w";
import { Suspense } from "react";
const Page = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        redirect("/sign-in")
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions(),
    )
    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions(),)
return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<UpgradeViewLoading/>}>
                <ErrorBoundary fallback={<UpgradeViewError/>}>
                    <UpgradeView/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}
export default Page;