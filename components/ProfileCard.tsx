import React from 'react'

import { ProfileCardProps, StoryProps } from '@/types/index'
import Image from 'next/image'
import { Button } from './ui/button'
import LoaderSpinner from '@/components/LoaderSpinner'

const ProfileCard = ({storyData, userFirstName, imageUrl}:ProfileCardProps) => {
  
  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-3 flex flex-col gap-6 max-md:items-center md:flex-row">
        <Image
        src={imageUrl}
        width={200}
        height={200}
        alt="Storier"
        className="aspect-square rounded-lg"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-[25px] font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
        </div>
        <figure className="flex gap-3 py-4">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphones"
          />
          <h2 className="text-16 font-semibold text-white-1">
            {storyData?.listeners} &nbsp;
            <span className="font-normal text-white-2">monthly listeners</span>
          </h2>
        </figure>
        {storyData && (
          <Button
            onClick={()=>{}}
            className="text-16 bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play a random story
          </Button>
        )}
      </div>
    </div>
    
  )
}

export default ProfileCard