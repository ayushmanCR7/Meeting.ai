import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { MeetingGetOne } from "../../types";

interface NewMeetingDilaogProps{
    open: boolean;
    onOpenChange: (open:boolean)=>void;
    initialValue: MeetingGetOne
};

export const UpdateMeetingDilaog = ({
    open,onOpenChange,initialValue
}:NewMeetingDilaogProps) =>{
    const router = useRouter()
return (
    <ResponsiveDialog title = "Edit Meeting" description="Editmeeting" open = {open} onOpenChange={onOpenChange}>
      <MeetingForm onSuccess={(id)=>{
        onOpenChange(false); router.push(`/meetings/${initialValue.id}`)
      }}
      onCancel={()=>onOpenChange(false)} initialValues={initialValue}
      />
    </ResponsiveDialog>
)
}