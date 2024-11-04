"use client"


import EmptyState from '@/components/EmptyState'
import ProfileCard from '@/components/ProfileCard'
import StoryCard from '@/components/StoryCard'
import LoaderSpinner from '@/components/LoaderSpinner'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import { useUser } from '@clerk/nextjs'

const page = ({ params }: { params: { profileId: string } }) => {

  const storyData = useQuery(api.stories.getStoryByAuthorIdForProfilePage, { authorId: params.profileId })
  const userById = useQuery(api.users.getUserById, {
    clerkId: params.profileId
  })

  const { user } = useUser();

  if (!user || !storyData) return <LoaderSpinner />;
  return (
    <section className="mt-8 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">Storier Profile</h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          storyData={storyData!}
          imageUrl={userById?.imageUrl!}
          userFirstName={userById?.name!} />
      </div>
      <section className="mt-9 flex flex-col gap-5 mb-6">
        <h1 className="text-20 font-bold text-white-1">All Stories</h1>
        {storyData && storyData.stories.length > 0 ? (
          <div className="story_grid">
            {storyData?.stories?.slice(0, 4).map((story) => (
              <StoryCard
                key={story._id}
                imgURL={story.imageUrl!}
                title={story.storyTitle!}
                description={story.storyDescription}
                storyId={story._id}
              />
            ))}
          </div>
        ) : user.id === params.profileId ? (
          <EmptyState
            title="You have not created any stories yet"
            buttonLink="/create-story"
            buttonText="Create Story"
          />
        ) : (
          <EmptyState
            title={`No stories by ${userById?.name}`}
          />
        )}
      </section>
    </section>
  )
}

export default page