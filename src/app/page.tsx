"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import {authClient} from "@/lib/auth-client"
export default function Home() {
  const {data: session} = authClient.useSession()
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const onSubmit = ()=>{
    authClient.signUp.email({
      email,
      name,
      password,
    },{
      onError: ()=>{
        window.alert("Error creating user")
      },
      onSuccess:()=>{
        window.alert("Success")   
      }
    })
  }
  if(session){
    return (
      <div>
        Signed in as {session.user.name} <br/>
        <Button onClick={()=>{
          authClient.signOut()
        }}>Sign out</Button>
      </div>
    )
  }
    const onLogin = ()=>{
    authClient.signIn.email({
      email,
      password,
    },{
      onError: ()=>{
        window.alert("Error creating user")
      },
      onSuccess:()=>{
        window.alert("Success")   
      }
    })
  }
  return (
    <div className="flex flex-col gap-y-10">
    <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
      <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button onClick={onSubmit}>Create User</Button>
    </div>
    <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button onClick={onLogin}>Create User</Button>
    </div>

        </div>
  );
}
