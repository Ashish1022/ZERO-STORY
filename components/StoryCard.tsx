import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const StoryCard = ({ title, description, storyId, imgURL }: {
  title: string; description: string; storyId: Id<"stories">; imgURL: string
}) => {

  const router = useRouter();
  const updateStoryViews = useMutation(api.stories.updateStoryViews)

  const handleViews = () => {
    updateStoryViews({storyId})
    router.push(`/story/${storyId}`, {
      scroll: true
    })
  }

  return (
    <div className='cursor-pointer' onClick={handleViews}>
      <figure className='flex flex-col gap-2'>
        <Image src={imgURL} alt={title} width={174} height={174} className='h-fit w-full rounded-lg aspect-square 2xl:size-[200px]' />
        <div>
          <h1 className='text-16 truncate text-white-1 font-bold'>{title}</h1>
          <h2 className='text-14 truncate text-white-4 font-normal'>{description}</h2>
        </div>
      </figure>
    </div>
  )
}

export default StoryCard