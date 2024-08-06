import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

const EmptyState = ({title, buttonLink, buttonText, search}:{title: string; buttonLink?: string; buttonText?: string; search?: boolean}) => {
  return (
    <section className='flex-center gap-3 size-full flex-col'>
        <Image src='/icons/emptyState.svg' alt='emptystate' width={250} height={250}/>
        <div className='flex-center w-full max-w-[254px] flex-col gap-3'>
            <h1 className='text-16 text-center font-extrabold text-white-1'>{title}</h1>
            {search && (
                <p className='text-16 font-medium text-center text-white-2'>Try adjusting your search to what you are looking for</p>
            )}
            {buttonLink && (
                <Button className='bg-orange-1'>
                    <Link href={buttonLink} className='gap-1 flex'>
                        <Image src='/icons/Discover.svg' alt='discover' width={20} height={20}/>
                        <h1 className='text-16 font-extrabold text-white-1'>{buttonText}</h1>
                    </Link>
                </Button>
            )}
        </div>
    </section>
  )
}

export default EmptyState