"use client"


import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import StoryCard from '@/components/StoryCard'
import StoryDetailsPlayer from '@/components/StoryDetailsPlayer'
import { Label } from '@/components/ui/label'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const StoryDetails = ({ params: { storyId, authorId } }: { params: { storyId: Id<"stories">; authorId: Id<"stories"> } }) => {

  const { user } = useUser();

  const story = useQuery(api.stories.getStoryById,{ storyId });

  const similarStories = useQuery(api.stories.getStoryByAuthorId, { storyId });

  const isOwner = user?.id === story?.storyAuthorId

  if (!story || !similarStories) return <LoaderSpinner />

  return (
    <section className='flex w-full flex-col'>
      <header className='mt-8 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>Currently playing</h1>
        <figure className='flex gap-2'>
          <Image src='/icons/headphone.svg' width={24} height={24} alt='headphone' />
          <h2 className='text-16 font-bold text-white-1'>{story?.storyViews}</h2>
        </figure>
      </header>

      <StoryDetailsPlayer
        isOwner={isOwner}
        storyId={story._id}
        {...story}
      />

      <div className='flex flex-col gap-2  pt-[45px]'>
        <Label className='text-20 font-extrabold'>Description : </Label>
        <p className='text-white-2 text-16 pb-4 font-medium max-md:text-center'>
          {story?.storyDescription}
        </p>

        <Label className='text-20 font-extrabold'>Story : </Label>
        <p className='text-white-2 text-16 pb-8 font-medium'>
          {story?.storyScript}
        </p>
      </div>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar stories</h1>
        {similarStories && similarStories.length > 0 ? (
          <div className='podcast_grid'>
            {similarStories?.map(({ _id, storyDescription, storyTitle, imageUrl }) => (
              <StoryCard
                key={_id}
                title={storyTitle}
                description={storyDescription}
                storyId={_id}
                imgURL={imageUrl}
              />
            ))}
          </div>
        ) : (
          <>
            <EmptyState title='No similar stories' buttonLink='/discover' buttonText='Discover more stories' />
          </>
        )}
      </section>
    </section>
  )
}

export default StoryDetails