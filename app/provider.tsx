'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useUser} from '@clerk/nextjs'
import { UserDetailContext } from '@/context/UserDetailContext'
import { OnSaveContext } from '@/context/OnSaveContext'
function provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const {user} = useUser();
  const [userDetail, setUserDetail] = useState<any>();
  const [onSaveData, setOnSaveData] = useState<any>(null)
  // triggers whenever the user changes
  useEffect(()=>{
    if (user) {
    CreateNewUser();
  }
  }, [user])
  // give backend call to create user, there the checking part is done if user is alr created or new
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
        <OnSaveContext.Provider value={{onSaveData, setOnSaveData}}>
           {children}
        </OnSaveContext.Provider>
      </UserDetailContext.Provider>
      </div>
  )
}

export default provider