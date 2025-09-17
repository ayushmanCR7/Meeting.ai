import { useTRPC } from "@/trpc/client";

import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import {  meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneratedAvatar } from "@/components/ui/generated-avata";
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingGetOne } from "@/modules/meetings/types";
import { useState } from "react";
import { CommandSelect } from "@/modules/agents/ui/components/command-select";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps{
    onSuccess?: (id?:string)=>void;
    onCancel?:()=>void;
    initialValues?: MeetingGetOne
};

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues
}:MeetingFormProps)=>{
        const trpc = useTRPC();

    const [agentSearch,setAgentSearch]  = useState("");
    const [openNewAgentDialog,setopenNewAgentDialog] = useState(false)
    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )
    const queryClient = useQueryClient()
    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async(data)=>{
               await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                onSuccess?.(data.id)
            },
            onError: (error)=>{
                toast.error(error.message)
            },
        })
    )
    const updateMeetingt = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async()=>{
               await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                if(initialValues?.id){
                   await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({id: initialValues.id})
                    )
                }
                onSuccess?.()
            },
            onError: (error)=>{
                toast.error(error.message)
            },
        })
    )
    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues:{
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId?? ""
        }
    })

    const isEdit = !!initialValues?.id
    const isPending = createMeeting.isPending || updateMeetingt.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>)=>{
        if(isEdit){
            updateMeetingt.mutate({...values,id: initialValues.id})
        }
        else{
            createMeeting.mutate(values)
        }
    }
    return <>
    <NewAgentDialog open={openNewAgentDialog} onOpenChange={setopenNewAgentDialog}/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField name="name" control={form.control} render = {({field}) => <FormItem>
                    <FormLabel>
                        Name
                    </FormLabel>
                    <FormControl>
                        <Input {...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>}/>
                 <FormField name="agentId" control={form.control} render = {({field}) => <FormItem>
                    <FormLabel>
                        Agent
                    </FormLabel>
                    <FormControl>
                        <CommandSelect 
                         options={(agents.data?.items ?? []).map((agent)=>({
                            id: agent.id,
                            value: agent.id,
                            children:(
                                <div className="flex items-center gap-x-2">
                                    <GeneratedAvatar
                                    seed = {agent.name}
                                    variant="botttsNeutral"
                                    className ="border size-6"
                                    />
                                    <span>{agent.name}</span>
                                </div>

                            )
                         }))}
                         onSelect={field.onChange}
                         onSearch={setAgentSearch}
                         value={field.value}
                         placeholder="Select an Agent"
                        />
                    </FormControl>
                    <FormDescription>
                        Not found what you &apos; re looking for?{" "}
                        <button type="button" className="text-primary hover:underline" onClick={()=>setopenNewAgentDialog(true)}>
                         Create New Agent
                        </button>
                    </FormDescription>
                    <FormMessage/>
                </FormItem>}/>

                <div className="flex justify-between gap-x-2">
                    {
                        onCancel && (
                            <Button variant="ghost" disabled={isPending} type="button" onClick={()=> onCancel()}>Cancel</Button>
                        )
                    }
                    <Button disabled={isPending} type="submit">
                            {isEdit? "Update": "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    </>
}