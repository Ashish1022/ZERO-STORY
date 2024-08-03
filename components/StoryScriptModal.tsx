import React, { Dispatch, SetStateAction, useState } from 'react'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

interface StoryScriptModalProps {
    setScript: Dispatch<SetStateAction<string>>;
    script: string;
}

const StoryScriptModal:React.FC<StoryScriptModalProps> = ({script, setScript}) => {


    return (
        <Dialog>
            <DialogTrigger className='input-class h-10 text-start px-3'>Write/Paste story script</DialogTrigger>
            <DialogPortal>
                <DialogOverlay className='backdrop-blur-sm' />
                <DialogContent className='h-full max-h-[95%] w-full max-w-[60%] bg-black-1'>
                    <DialogHeader>
                        <DialogTitle className='text-white-1 mx-auto mb-3'>STORY | SCRIPT</DialogTitle>
                        <Textarea placeholder='Start here...' className='max-h-[95%] h-full' value={script} onChange={(e) => setScript(e.target.value)} onLoad={() => setScript('')}/>
                        <DialogClose asChild>
                            <Button className='bg-orange-1 mx-auto px-14'>
                                Submit
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}

export default StoryScriptModal