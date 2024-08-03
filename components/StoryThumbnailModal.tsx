import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Id } from '@/convex/_generated/dataModel';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUploadFiles } from '@xixixao/uploadstuff/react';


interface StoryThumbnailModalProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
}

const StoryThumbnailModal: React.FC<StoryThumbnailModalProps> = ({ setImage, setImageStorageId, image }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [ImageLoading, setImageLoading] = useState(false);
  const { toast } = useToast();


  const uploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(uploadUrl);
  const getImageUrl = useMutation(api.stories.getUrl)

  const handleImage = async (blob: Blob, fileName: string) => {
    setImageLoading(true);
    setImage('');

    try {

      const file = new File([blob], fileName, { type: 'Image/png' })
      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setImageLoading(false);
      toast({ title: 'Thumbnail uploaded successfully' })

    } catch (error) {
      console.log(error)
      toast({ title: 'Error', variant: 'destructive' })
    }

  }
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name)
    } catch (error) {
      console.log(error);
      toast({ title: 'Error Uplaoding image', variant: 'destructive' })
    }
  }

  return (
    <>
      <Label className="text-16 font-bold text-white-1 mt-[30px]">STORY | THUMBNAIL</Label>

      <div onClick={() => imageRef?.current?.click()} className='image_div'>
        <Input type='file' className='hidden' ref={imageRef} onChange={(e) => uploadImage(e)} />
        {!ImageLoading ? (
          <Image src='/icons/upload-image.svg' width={40} height={40} alt='upload' />
        ) : (
          <div className='text-16 flex-center font-medium text-white-1'>
            Uploading
            <Loader size={20} className='animate-spin ml-3' />
          </div>
        )}
        <div className='flex flex-col items-center gap-1'>
          <h2 className='text-12 font-bold text-orange-1'>Click to upload</h2>
          <p className='text-12 font-normal text-gray-1'>PNG, JPG or JPEG</p>
        </div>
      </div>

        {image && (
          <div className='flex-center w-full'>
            <Image src={image} width={200} height={200} className='mt-5' alt='thumbnail' />
          </div>
        )}
    </>
  )
}

export default StoryThumbnailModal