'use client'
import { Button } from '@/components/ui/button'
import { ArrowUp, Flashlight, HomeIcon, ImagePlus, Key, LayoutDashboard, Loader2Icon } from 'lucide-react'
import React, { useState } from 'react'
import {
  SignInButton,
  useUser
} from '@clerk/nextjs'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

const suggestion =[
    {
        label:'Dashboard',
        prompt:'Create an analytics dashboard to track customers and revenue data for a SaaS',
        icon: LayoutDashboard
    },{
        label:'SignUpForm',
        prompt:'Create a modern sign up form with email/password fields, Google and Github login Options',
        icon: Key
    },{
        label:'Hero',
        prompt:'Create a modern header and centered hero section',
        icon: HomeIcon
    }
]

const generateRandomFrameNo= ()=>{
    const num= Math.floor(Math.random()*1000)
    return num
}
const Hero = () => {

    const [userInput, setUserInput] = useState<string>()
    const router= useRouter()
    const {user}= useUser();
    const [Loading, setLoading]= useState(false)

    const handleSuggestionClick = (promptText: string) => {
    // FIX: Only fill the textarea
    setUserInput(promptText);
    
    // OPTIONAL: Store in sessionStorage (but playground can also get it from messages API)
    // sessionStorage.setItem('initialPrompt', promptText);
    
    console.log('Prompt set in textarea:', promptText);
}

    const createNewProject =async()=>{
        setLoading(true)
        const projectId= uuidv4()
        const frameId = generateRandomFrameNo()
        const messages=[{
            role:"user",
            content: userInput
        }]
        if(userInput){
            sessionStorage.setItem('initialPrompt', userInput)
        }
        try{
            const result = await axios.post('/api/projects', {
                projectId: projectId,
                frameId: frameId,
                messages:messages
            })
            console.log(result.data)
            toast.success('project created')
            //Naviagte to playground
            router.push(`/playground/${projectId}?frameId=${frameId}`)
            setLoading(false)
        }catch(e){
            toast.error('Internal server error')
            console.log(e)
            setLoading(false)
        }
    }

  return (
  <div className='flex flex-col items-center h-[80vh] justify-center'>
        {/* header & discription */}
        
            <h2 className='font-bold text-6xl'>What should we Design?</h2>
            <p className='mt-2 text-xl text-gray-500'>Generate, Edit and Explore design with AI, Export code as well</p>
        
        {/* input box */}
        <div className='w-full max-w-2xl p-5 border mt-5 ronded-2xl'>
            <textarea placeholder='Describe your page design' className='w-full h-24 focus:outline-none focus:ring-0 resize-none' value={userInput}
            onChange={(e)=>setUserInput(e.target.value)}/>
            <div className='flex justify-between'>
                <Button variant={'ghost'}> <ImagePlus/></Button>
                
                <Button disabled={!userInput || Loading} variant={'ghost'} onClick={createNewProject}> {Loading? <Loader2Icon className='animate-spin'/>:<ArrowUp/>}</Button>

            </div>
        </div>
        
        {/* suggestion */}
        <div className='mt-4 flex gap-3'>
            {suggestion.map((suggestion, index)=>(
                <Button key={index} variant={'outline'}
                 onClick={() => handleSuggestionClick(suggestion.prompt)}>
                    <suggestion.icon/>
                    {suggestion.label}</Button>
            ))}
        </div>
   </div>
  )
}

export default Hero