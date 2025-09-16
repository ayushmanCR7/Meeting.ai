import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-from";

interface NewAgentDilaogProps{
    open: boolean;
    onOpenChange: (open:boolean)=>void;
};

export const NewAgentDialog = ({
    open,onOpenChange,
}:NewAgentDilaogProps) =>{
return (
    <ResponsiveDialog title = "New Agent" description="Create a new agent" open = {open} onOpenChange={onOpenChange}>
        <AgentForm onSuccess={()=>onOpenChange(false)} onCancel={()=>onOpenChange(false)}/>

    </ResponsiveDialog>
)
}