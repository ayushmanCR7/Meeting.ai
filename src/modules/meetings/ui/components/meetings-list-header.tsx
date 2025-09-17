"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"

import { useState } from "react"

import { DEFAULT_PAGE } from "@/constants"
import { NewMeetingDilaog } from "./new-meeting-dialog"
import { MeetingsSearchFilter } from "./metings-search-filters"
import { StatusFilter } from "./status-filters"
import { AgentIdFilter } from "./agent-id-filters"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const MeetingListHeader = ()=>{
    const [filters,setFilters] = useMeetingsFilters()
   const [isDialogOpen,setIsDialogOpen] = useState(false)
   const isAnyFilterMethod = !!filters.status || !!filters.search || !!filters.agentId

   const onClearFilters = ()=>{
    setFilters({
        status: null,
        agentId: "",
        search: "",
        page: 1
    })
   }
    return <>
    <NewMeetingDilaog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
            <h5 className="font-medium text-xl">My Meetings</h5>
                <Button onClick={()=>setIsDialogOpen(true)}>
                     <PlusIcon/>
                     New Meeting
                </Button>
        </div>
        <ScrollArea>
        <div className="flex items-center gap-x-2 ">
            <MeetingsSearchFilter/>
            <StatusFilter/>
            <AgentIdFilter/>
            {
                isAnyFilterMethod && (
                    <Button variant="outline" onClick={onClearFilters}>
                        <XCircleIcon className="size-4">Clear</XCircleIcon>
                    </Button>
                )
            }
        </div>
        <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    </div>
    </>
}
