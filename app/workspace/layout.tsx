import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from './_components/AppSidebar';
import { AppHeader } from './_components/AppHeader';
function workspaceLayout({children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <SidebarProvider>
       <AppSidebar /> 
    <div className='w-full'>
        <AppHeader/>
         {children}</div>
    </SidebarProvider>
  )
}

export default workspaceLayout