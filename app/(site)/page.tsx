"use client";

import LoaderSpinner from '@/components/LoaderSpinner';
import StoryCard from '@/components/StoryCard';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { formatTime } from '@/lib/formatTime';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'



const page = ({params:{storyId}}:{params:{storyId:Id<"stories">}}) => {

  let i = 1;

  const trendigstories = useQuery(api.stories.getTrendingStories)

  const router = useRouter();

  if (!trendigstories) return <LoaderSpinner />

  return (
    <div className="mt-8 flex flex-col gap-8 md:overflow-hidden">
      <section className='flex flex-col gap-4'>
        <h1 className="text-20 font-bold text-white-1">Trending Stories</h1>
        <div className='story_grid'>
          {trendigstories.slice(0, 4).map(({ _id, storyTitle, storyDescription, imageUrl }) => (
            <StoryCard storyId={_id} title={storyTitle} description={storyDescription} imgURL={imageUrl} key={_id} />
          ))}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-6'>
        <h1 className='text-20 font-bold text-white-1'>Latest stories</h1>
        {trendigstories.slice(0, 4).map(({ _id, storyTitle, imageUrl, storyAuthor, storyViews, storyAudioDuration, storyAuthorId }) => (
          <div className='grid grid-cols-2 border-b pb-5 border-white-3' key={_id}>
            <div className='flex justify-start gap-3 items-center cursor-pointer'>
              <p className='font-bold text-white-1'>{i++}</p>
              <Image src={imageUrl} alt='img' width={44} height={44} className='aspect-square rounded-lg' />
              <div className='flex flex-col'>
                <p className='font-bold text-14 truncate' onClick={()=>router.push(`/story/${_id}`)}>{storyTitle}</p>
                <p onClick={()=>router.push(`/profile/${storyAuthorId}`)} className='text-white-3 font-normal text-14 truncate cursor-pointer transition hover:text-white-1'>{storyAuthor}</p>
              </div>
            </div>
            <div className='flex justify-between items-center max-md:justify-end'>
              <div className='flex items-center justify-center gap-2 max-md:hidden'>
                <Image src='/icons/headphone.svg' alt='img' width={23} height={23} />
                <p>{storyViews}</p>
              </div>
              <div className='flex items-center justify-center gap-2 max-md:hidden'>
                <Image src='/icons/watch.svg' alt='img' width={23} height={23} />
                <p>{formatTime(storyAudioDuration)}</p>
              </div>
              <div className='flex items-center justify-center' onClick={()=>{}}>
                <Image src='icons/three-dots.svg' alt='img' width={23} height={23} />
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className='flex flex-col gap-6 mt-6 mb-2'>
        <h1 className='text-20 font-bold text-white-1'>Popular stories</h1>
        <div className='story_grid'>
          {trendigstories.slice(0, 4).map(({ _id, storyTitle, storyDescription, imageUrl }) => (
            <StoryCard storyId={_id} title={storyTitle} description={storyDescription} imgURL={imageUrl} key={_id} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default page