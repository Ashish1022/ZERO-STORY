"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import StoryCard from '@/components/StoryCard'
import Searchbar from '@/components/Searchbar'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const storyData = useQuery(api.stories.getStoryBySearch, { search: search || '' })

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Discover Trending Stories' : 'Search results for '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {storyData ? (
          <>
            {storyData.length > 0 ? (
              <div className="podcast_grid">
              {storyData?.map(({ _id, storyTitle, storyDescription, imageUrl }) => (
                <StoryCard 
                  key={_id}
                  imgURL={imageUrl!}
                  title={storyTitle}
                  description={storyDescription}
                  storyId={_id}
                />
              ))}
            </div>
            ) : <EmptyState title="No results found" />}
          </>
        ) : <LoaderSpinner />}
      </div>
    </div>
  )
}

export default Discover