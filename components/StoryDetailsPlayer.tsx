import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from './ui/button';
import LoaderSpinner from './LoaderSpinner';
import { useRouter } from 'next/navigation';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from './ui/use-toast';
import { useAudio } from '@/providers/AudioProvider';

interface StoryDetailsPlayerProps {
  isOwner: boolean;
  storyId: Id<"stories">;
  imageUrl: string;
  audioUrl: string;
  storyTitle: string;
  storyAuthorImageUrl: string;
  storyAuthor: string;
  storyAuthorId: string;
  imageStorageId: Id<"_storage">
  audioStorageId: Id<"_storage">
}

const StoryDetailsPlayer = (props: StoryDetailsPlayerProps) => {

  const [isDeleting, setIsDeleting] = useState(false);
  const deleteStory = useMutation(api.stories.deleteStory)
  const router = useRouter();
  const { toast } = useToast();
  const { setAudio } = useAudio();

  const handleDelete = async () => {
    try {
      await deleteStory({ storyId: props.storyId, imageStorageId: props.imageStorageId, audioStorageId: props.audioStorageId })
      toast({
        title: "Story deleted"
      });
      router.push('/');
    } catch (error) {
      console.error("Error deleting story", error);
      toast({
        title: "Error deleting story",
        variant: "destructive",
      });
    }
  }

  const upgrade = useAction(api.stripe.pay);

  const handleUpgrade = async () => {
    const url = await upgrade({});
    if (!url) return;
    router.push(url)
  }

  const handlePlay = () => {
    setAudio({
      title: props.storyTitle,
      audioUrl: props.audioUrl,
      imageUrl: props.imageUrl,
      author: props.storyAuthor,
      storyId: props.storyId
    })
  }
  console.log(handlePlay)
  if (!props.imageUrl || !props.storyAuthorImageUrl) return <LoaderSpinner />;

  return (
    <div className='mt-6 flex w-full justify-between max-md:justify-center'>
      <div className='flex flex-col gap-8 max-md:items-center md:flex-row'>
        <Image src={props.imageUrl} alt={props.imageUrl} width={200} height={200} className='aspect-square rounded-lg' />
        <div className='flex w-full flex-col gap-5 max-md:items-center md:gap-9'>
          <article className='flex flex-col gap-2 max-md:items-center'>
            <h1 className="font-extrabold tracking-[-0.32px] text-white-1 text-[28px]">{props.storyTitle}</h1>
            <figure className="flex cursor-pointer items-center gap-2" onClick={() => router.push(`/profile/${props.storyAuthorId}`)}>
              <Image src={props.storyAuthorImageUrl} alt='author' width={30} height={30} className="size-[30px] rounded-full object-cover" />
              <h2 className="text-16 font-normal text-white-3">{props.storyAuthor}</h2>
            </figure>
          </article>
          <Button className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1" onClick={handlePlay}>
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play story
          </Button>
        </div>
      </div>
      {props.isOwner && (
        <div className='relative mt-2'>
          <Image src='/icons/three-dots.svg' alt='three' width={20} height={30} className='cursor-pointer' onClick={() => setIsDeleting((prev) => !prev)} />
          {isDeleting && (
            <div className='cursor-pointer flex justify-center gap-2 rounded-lg bg-black-6 py-1.5 hover:bg-black-2 w-32 z-10 absolute -left-32 -top-2' onClick={handleDelete}>
              <Image src='/icons/delete.svg' alt='delete' width={16} height={16} />
              <h2 className="text-16 font-normal text-white-1">Delete</h2>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StoryDetailsPlayer