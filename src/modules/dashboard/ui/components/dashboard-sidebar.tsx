"use client"

import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent,SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem} from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-context-menu";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUeserButton } from "./dashboard-user-button";
import { DahboardTrial } from "./dashboard-trial";
const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings"

    },{
        icon: BotIcon,
        label: 'Agents',
        href: "/agents"
    }
];
const secondSection = [
    {
        icon: StarIcon,
        label: "Ugrade",
        href: "/upgrade"

    }
];

export const DashboardSidebar = ()=>{
    const pathname = usePathname()
    return(
        <Sidebar> 
            <SidebarHeader className="text-sidebar-accent-foreground">
                 <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                 <Image src="/logo.svg" height={36} width={36} alt=""/>
                 <p className="text-2xl font-semibold">ConvoAI</p>
                 </Link>
                </SidebarHeader>
                <div>
                    <Separator className="opacity-10 text-[#5D6B68]"/>
                    </div> 
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                            <SidebarMenu>
                                {firstSection.map((item)=>(
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B8]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
                                            ,pathname===item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                        )} isActive={pathname===item.href}>
                                            <Link href={item.href}>
                                            <item.icon className="h-5 w-5"/>
                                            <span className="text-sm font-medium tracking-tight">
                                               {item.label}
                                            </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <div>
                    <Separator className="opacity-10 text-[#5D6B68]"/>
                    </div> 
                         <SidebarGroup>
                            <SidebarGroupContent>
                            <SidebarMenu>
                                {secondSection.map((item)=>(
                                    <SidebarMenuItem key={item.href} >
                                        <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B8]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
                                            ,pathname===item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                        )} isActive={pathname===item.href}>
                                            <Link href={item.href}>
                                            <item.icon className="h-5 w-5"/>
                                            <span className="text-sm font-medium tracking-tight">
                                               {item.label}
                                            </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="text-white">
                        <DahboardTrial/>
                        <DashboardUeserButton/>
                    </SidebarFooter>
                </Sidebar>
    )}

