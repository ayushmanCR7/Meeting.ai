import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-from";
import { AgentGetOne } from "../../types";

interface UpdateAgentDilaogProps{
    open: boolean;
    onOpenChange: (open:boolean)=>void;
    initialValues: AgentGetOne
};

export const UpdateAgentDialog = ({
    open,onOpenChange,initialValues
}:UpdateAgentDilaogProps) =>{
return (
    <ResponsiveDialog title = "Edit Agent" description="Editagent" open = {open} onOpenChange={onOpenChange}>
        <AgentForm onSuccess={()=>onOpenChange(false)} onCancel={()=>onOpenChange(false)} initialValues={initialValues}/>

    </ResponsiveDialog>
)
}