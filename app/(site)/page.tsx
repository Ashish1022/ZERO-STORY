"use client";

import StoryCard from '@/components/StoryCard';
import { podcastData } from '@/constants';
import Image from 'next/image';
import React from 'react'



const page = () => {

  var i = 1;

  return (
    <div className="mt-8 flex flex-col gap-8 md:overflow-hidden">
      <section className='flex flex-col gap-4'>
        <h1 className="text-20 font-bold text-white-1">Trending Stories</h1>
        <div className='podcast_grid'>
          {podcastData.slice(0, 4).map(({ id, title, description, imgURL }) => (
            <StoryCard id={id} title={title} description={description} imgURL={imgURL} key={id} />
          ))}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-6'>
        <h1 className='text-20 font-bold text-white-1'>Latest stories</h1>
        {podcastData.slice(0,4).map(({ id, imgURL, title, description }) => (
          <div className='grid grid-cols-2 border-b pb-5 border-white-3' key={id}>
            <div className='flex justify-start gap-3 items-center'>
              <p className='font-bold text-white-1'>{i++}</p>
              <Image src={imgURL} alt='img' width={44} height={44} className='aspect-square rounded-lg' />
              <p className='font-semibold text-14 truncate'>{title}</p>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex items-center justify-center gap-2'>
                <Image src='/icons/headphone.svg' alt='img' width={23} height={23} />
                <p>30,000</p>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Image src='/icons/watch.svg' alt='img' width={23} height={23} />
                <p>1:03:21</p>
              </div>
              <div className='flex items-center justify-center'>
                <Image src='icons/three-dots.svg' alt='img' width={23} height={23} />
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className='flex flex-col gap-6 mt-6 mb-2'>
        <h1 className='text-20 font-bold text-white-1'>Popular stories</h1>
        <div className='podcast_grid'>
          {podcastData.slice(0,4).map(({ id, imgURL, title, description }) => (
            <StoryCard
              key={id}
              title={title}
              description={description}
              imgURL={imgURL}
              id={id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default page