import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Signup from "@/components/authentication/Signup";
import Login from "@/components/authentication/Login";

export default function AuthenticationPage() {
  return (
    <div className={'bg-white flex justify-center items-center w-full h-screen'}>
      <Tabs defaultValue="signup" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
        <TabsContent value="signin">
          <Login />
        </TabsContent>
      </Tabs>
    </div>
  )
}
