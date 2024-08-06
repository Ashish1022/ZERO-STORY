"use client"


import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { useAudio } from '@/providers/AudioProvider'

const LeftSidebar = () => {

    const pathName = usePathname();
    const { signOut } = useClerk();
    const router = useRouter();
    const {audio} = useAudio()

    return (
        <div className={cn('rounded-lg left_sidebar h-[calc(100vh-5px)]', {
            'h-[calc(100vh-82px)]': audio?.audioUrl
        })}>
            <nav className='flex flex-col gap-6'>
                <Link href='/' className='flex cursor-pointer items-center pl-9 gap-1 pb-4 max-lg:justify-center'>
                    <h1 className='text-24 font-extrabold max-lg:hidden'>ZERO | STORY</h1>
                </Link>
                {sidebarLinks.map(({ label, imgURL, route }) => {

                    const isActive = pathName === route || pathName.startsWith(`${route}/`);

                    return <Link href={route} key={route} className={cn('flex gap-3 items-center py-2 max-lg:px-4 justify-center lg:justify-start ml-2', {
                        'bg-nav-focus border-r-4 border-orange-1': isActive,
                    })}>
                        <Image src={imgURL} alt='link' width={23} height={23} />
                        <p>{label}</p>
                    </Link>
                })}
            </nav>
            <SignedIn>
                <div className='flex-center w-full mb-3 max-lg:px-4 lg:pr-8 flex-col gap-y-2'>
                    <Button className='bg-[#2bd155] text-16 font-extrabold w-[80%]' onClick={() => signOut(() => router.push('/'))}>
                        Logout
                    </Button>
                    <Link href='/zero' className='text-12 font-extrabold underline underline-offset-4'>About&nbsp;&nbsp; ZERO | STORY</Link>
                </div>
            </SignedIn>
            <SignedOut>
                <div className='flex-center w-full mb-3 max-lg:px-4 lg:pr-8 flex-col gap-y-2'>
                    <Button className='bg-[#2bd155] text-16 font-extrabold w-[80%]' onClick={() => router.push('/sign-in')}>
                        Sign in
                    </Button>
                    <Link href='/zero' className='text-12 font-extrabold underline underline-offset-4'>About&nbsp;&nbsp; ZERO | STORY</Link>
                </div>
            </SignedOut>
        </div>
    )
}

export default LeftSidebar