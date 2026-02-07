import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from "next/link";
import {
    SignInButton
} from '@clerk/nextjs'
const menuOptions = [
    {
        name: 'Pricing',
        path: '/workspace/pricing'
    }, {
        name: 'Contact us',
        path: '/workspace/contactus'
    }
]



const Header = () => {
    return (
        <div className='flex item-center justify-between p-4 shadow'>
            {/* logo */}
            <div className='flex gap-2 item-center'>
                <Image src={'/logo.svg'} alt='logo' width={35} height={35} />
                <h2 className='font-bold text-xl'>AI Website Generator</h2>
            </div>
            {/* menu options */}
            <div className="gap-3 flex">
                {menuOptions.map((menu, index) => (
                    <Link href={menu.path} key={index}>
                        <Button variant="ghost">
                            {menu.name}
                        </Button>
                    </Link>
                ))}
            </div>
            {/* get started */}
            <div>
                {/* modal opens the sign in on the landing page only */}
                <SignInButton mode={'modal'} forceRedirectUrl={'/workspace'}>
                    <Link href={'/workspace'}>
                        <Button>Get Started <ArrowRight /></Button>
                    </Link>
                </SignInButton>
            </div>
        </div>
    )
}

export default Header