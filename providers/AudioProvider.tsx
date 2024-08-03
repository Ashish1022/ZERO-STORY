"use client"

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"

interface AudioProps {
    title: string;
    audioUrl: string;
    author: string;
    imageUrl: string;
    storyId: string;
}

interface AudioContextType {
    audio: AudioProps | undefined;
    setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

const audioContext = createContext<AudioContextType | undefined>(undefined)

const AudioProvider = ({ children }: { children: React.ReactNode }) => {

    const [audio, setAudio] = useState<AudioProps | undefined>()
    const pathName = usePathname();

    useEffect(() => {
        if (pathName === '/create-story') setAudio(undefined)
    }, [pathName])

    return (
        <audioContext.Provider value={{ audio, setAudio }}>
            {children}
        </audioContext.Provider>
    )
}

export const useAudio = () => {
    const context = useContext(audioContext);

    if (!context) throw new Error("useAudio must be used within an AudioProvider")

    return context
}

export default AudioProvider