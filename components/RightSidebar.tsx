"use client"

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Header from './Header'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAudio } from '@/providers/AudioProvider'


const RightSidebar = () => {


  const topStorier =  useQuery(api.users.getTopUserByStoryCount)
  const {user} = useUser();
  const router = useRouter();
  const {audio} = useAudio();

  return (
    <div className={cn('rounded-lg right_sidebar h-[calc(100vh-5px)]', {
      'h-[calc(100vh-82px)]': audio?.audioUrl
  })}>
        <SignedIn>
        <Link href={`/profile/${user?.id}`} className='flex gap-3'>
          <UserButton />
          <div className='flex w-full items-center justify-between'>
            <h1 className='text-16 truncate font-semibold text-white-1'>{user?.firstName} {user?.lastName}</h1>
          </div>
          <Image src='/icons/right-arrow.svg' width={24} height={24} alt='arrow' />
        </Link>
      </SignedIn>
      <section className='flex flex-col gap-4 mt-10'>
        <Header headerTitle='Top storiers' />
        {topStorier?.slice(0, 4).map((storier) => (
          <div key={storier._id} className='flex cursor-pointer justify-between' onClick={() => router.push(`/profile/${storier.clerkId}`)}>
            <figure className='flex items-center gap-2'>
              <Image src={storier.imageUrl} alt='storier' width={44} height={44} className='aspect-square rounded-lg' />
              <h2 className='text-14 font-semibold text-white-1'>{storier.name}</h2>
            </figure>
            <div className='flex items-center'>
              {storier.totalStories <= 1 ? (
                <p className='text-12 font-normal'>
                  {storier.totalStories} story
                </p>
              ) : (
                <p className='text-12 font-normal'>
                  {storier.totalStories} stories
                </p>
              )}
            </div>
          </div>
        ))}
        </section>
    </div>
  )
}

export default RightSidebar