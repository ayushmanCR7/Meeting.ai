"use client"

import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { CallConnect } from "./cell-connect";
interface Props {
    meetingId: string;
    meetingName: string;
};
export const CallProvider = ({ meetingId, meetingName }: Props) => {
    const { data, isPending } = authClient.useSession();
    if (!data || isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent
to-sidebar">
                <Loader2Icon className="size-6 animate-spin Itext-white" />
            </div>
        );
    }
    return (
        <div>
            <CallConnect meetingId={meetingId} meetingName={meetingName} userId={data.user.id} userName={data.user.name} userImage={
                data.user.image ?? generateAvatarUri({seed: data.user.name, variant: "initials"})
            }/>
        </div>
    )
    };