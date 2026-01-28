'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useUser} from '@clerk/nextjs'
import { UserDetailContext } from '@/context/UserDetailContext'
function provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const {user} = useUser();
  const [userDetail, setUserDetail] = useState<any>();
  useEffect(()=>{
    if (user) {
    CreateNewUser();
  }
  }, [user])
  const CreateNewUser = async() =>{
    const result=await axios.post('/api/users',{
    })
    // console.log(result.data)
    setUserDetail(result.data?.user);
  }
  return (
    <div>
      {/* share the  alue throughout the app thriugh context */}
      <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      {children}
      </UserDetailContext.Provider>
      </div>
  )
}

export default provider