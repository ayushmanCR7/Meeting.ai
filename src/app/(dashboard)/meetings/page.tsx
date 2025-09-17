import { auth } from "@/lib/auth"
import { loadSearchParams } from "@/modules/agents/params"
import { MeetingListHeader } from "@/modules/meetings/ui/components/meetings-list-header"
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meeting-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SearchParams } from "nuqs"
import { Suspense } from "react"
interface Props{
  serachParams: Promise<SearchParams>
}
const Page = async({serachParams}:Props)=>{
  const filters = await loadSearchParams(serachParams)
      const session = await auth.api.getSession({
            headers: await headers(),
          })
          if(!session){
            redirect("/sign-in")
          }
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
          ...filters
        })
    )
    return <>
    <MeetingListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading/>}>
            <ErrorBoundary fallback = {<MeetingsViewError/>}>
          <MeetingsView/>
            </ErrorBoundary>
        </Suspense>
        
   </HydrationBoundary>
    </>
}
export default Page