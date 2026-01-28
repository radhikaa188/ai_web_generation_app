import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

export const AppHeader = () => {
  return (
    <div className='flex justify-between items-center shadow p-4'><SidebarTrigger/>
    <UserButton/>
    </div>
  )
}
