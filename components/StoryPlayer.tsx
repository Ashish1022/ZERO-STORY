"use client"

import { cn } from '@/lib/utils'
import { useAudio } from '@/providers/AudioProvider'
import React, { useEffect, useRef, useState } from 'react'
import { Progress } from './ui/progress'
import Image from 'next/image'
import Link from 'next/link'
import { formatTime } from '@/lib/formatTime'



const StoryPlayer = () => {

    const [currentTime, setCurrentTime] = useState(10);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const { audio } = useAudio();
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
            setIsPlaying(true);
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted((prev) => !prev);
        }
    };

    const forward = () => {
        if (
            audioRef.current &&
            audioRef.current.currentTime &&
            audioRef.current.duration &&
            audioRef.current.currentTime + 5 < audioRef.current.duration
        ) {
            audioRef.current.currentTime += 5;
        }
    };

    const rewind = () => {
        if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
            audioRef.current.currentTime -= 5;
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener("timeupdate", updateCurrentTime);

            return () => {
                audioElement.removeEventListener("timeupdate", updateCurrentTime);
            };
        }
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audio?.audioUrl) {
            if (audioElement) {
                audioElement.play().then(() => {
                    setIsPlaying(true);
                });
            }
        } else {
            audioElement?.pause();
            setIsPlaying(true);
        }
    }, [audio]);

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className={cn('sticky bottom-0 left-0 flex size-full flex-col', {
            'hidden': !audio?.audioUrl || audio?.audioUrl === "",
        })}>
            <Progress value={(currentTime / duration) * 100} className='w-full h-1' max={duration} />
            <section className="glassmorphism-black flex h-[70px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
                <audio
                    src={audio?.audioUrl}
                    ref={audioRef}
                    className="hidden"
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                />
                <div className="flex items-center gap-4 max-md:hidden">
                    <Link href={`/story/${audio?.storyId}`}>
                        <Image
                            src={audio?.imageUrl! || "/images/player1.png"}
                            width={50}
                            height={50}
                            alt="player1"
                            className="aspect-square rounded-xl"
                        />
                    </Link>
                    <div className="flex w-[160px] flex-col">
                        <h2 className="text-14 truncate font-semibold text-white-1">
                            {audio?.title}
                        </h2>
                        <p className="text-12 font-normal text-white-2">{audio?.author}</p>
                    </div>
                </div>
                <div className="flex-center cursor-pointer gap-3 md:gap-6">
                    <div className="flex items-center gap-1.5">
                        <Image
                            src={"/icons/reverse.svg"}
                            width={24}
                            height={24}
                            alt="rewind"
                            onClick={rewind}
                        />
                        <h2 className="text-12 font-bold text-white-4">-5</h2>
                    </div>
                    <Image
                        src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
                        width={30}
                        height={30}
                        alt="play"
                        onClick={togglePlayPause}
                    />
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-12 font-bold text-white-4">+5</h2>
                        <Image
                            src={"/icons/forward.svg"}
                            width={24}
                            height={24}
                            alt="forward"
                            onClick={forward}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <h2 className="text-16 font-normal text-white-2 max-md:hidden">
                        {formatTime(duration)}
                    </h2>
                    <div className="flex w-full gap-2">
                        <Image
                            src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
                            width={24}
                            height={24}
                            alt="mute unmute"
                            onClick={toggleMute}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default StoryPlayer