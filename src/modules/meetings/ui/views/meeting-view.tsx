"use client"

import { DataTable } from "@/components/data-table"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/empty-state"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { useRouter } from "next/navigation"
import { DataPagination } from "@/components/ui/data-pagination"

export const MeetingsView = ()=>{
    const trpc = useTRPC()
    const [filters,setFilters] = useMeetingsFilters()
    const router = useRouter()
    const {data} = useQuery(trpc.meetings.getMany.queryOptions({
        ...filters
    }))

    return (
        <div className="flex-1 pb-4 px-4 flex flex-col md:px-8 gap-y-4">
           <DataTable data = {data?.items ?? []} columns={columns}  onRowClick = {(row)=>router.push(`/meetings/${row.id}`)}/>
           <DataPagination
           page = {filters.page}
           totalPages={data?.totalPages ?? 1}
           onOpenChange = {(page)=>setFilters({page})}
          
           />
           {(data?.items ?? []).length === 0 && (
                           <EmptyState title = "Create your first meeting" description="hello"/>
                       )}
        </div>
    )
}
export const MeetingsViewLoading = ()=>{
    return (
        <LoadingState title = "Loading Agents" description="This may take a few seconds"/>
    )
}
export const MeetingsViewError = ()=>{
    return (
        <ErrorState title="Error Loading Agnets" description="Something went wrong"/>
    )
}