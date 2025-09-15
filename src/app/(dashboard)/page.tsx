import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-views";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
const Page = async()=>{
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if(!session){
    redirect("/sign-in")
  }
  return( <div><DashboardSidebar/> <HomeView/></div>)
}

export default Page