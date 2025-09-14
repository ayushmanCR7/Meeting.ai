import { Card, CardContent } from "@/components/ui/card";
import { SignInView } from "@/modules/auth/ui/views/sign-in-views";
import {redirect} from "next/navigation"
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
const Page = async()=>{
        const session = await auth.api.getSession({
        headers: await headers(),
      })
      if(!!session){
        redirect("/")
      }
    return <>

    <SignInView/>
    </>
}
export default Page;