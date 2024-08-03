import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import Image from 'next/image'
import { Loader } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { mutation } from '@/convex/_generated/server'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { useToast } from './ui/use-toast'

interface StoryAudioModalProps {
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

const StoryAudioModal = (props: StoryAudioModalProps) => {

  const [audioUploading, setAudioUploading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const uploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(uploadUrl);
  const getImageUrl = useMutation(api.stories.getUrl);
  const { toast } = useToast();

  const handleAudio = async (blob: Blob, fileName: string) => {
    setAudioUploading(true);
    props.setAudio('');

    try {

      const file = new File([blob], fileName, { type: 'audio/mpeg' })
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId

      props.setAudioStorageId(storageId);
      const audioUrl = await getImageUrl({ storageId });
      props.setAudio(audioUrl!);
      setAudioUploading(false);
      toast({ title: 'Audio uploaded successfully' })
    } catch (error) {
      console.log(error)
    }
  }

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleAudio(blob, file.name);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Label className="text-16 font-bold text-white-1 mt-[30px]">STORY | AUDIO</Label>

      <div onClick={() => audioRef?.current?.click()} className='image_div'>
        <Input type='file' className='hidden' accept='.mp3' ref={audioRef} onChange={(e) => uploadAudio(e)} />
        {!audioUploading ? (
          <Image src='/icons/upload-image.svg' width={40} height={40} alt='upload' />
        ) : (
          <div className='text-16 flex-center font-medium text-white-1'>
            Uploading
            <Loader size={20} className='animate-spin ml-3' />
          </div>
        )}
        <div className='flex flex-col items-center gap-1'>
          <h2 className='text-12 font-bold text-orange-1'>Click to upload</h2>
          <p className='text-12 font-normal text-gray-1'>MP3</p>
        </div>
      </div>
      {props.audio && (
        <div className='flex-center w-full'>
          <audio controls controlsList='nodownload' src={props.audio} className='mt-5' onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)} />
        </div>
      )}
    </>
  )
}

export default StoryAudioModal