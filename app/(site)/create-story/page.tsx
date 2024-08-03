"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import StoryScriptModal from "@/components/StoryScriptModal"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import StoryAudioModal from "@/components/StoryAudioModal"
import StoryThumbnailModal from "@/components/StoryThumbnailModal"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader } from "lucide-react"

const formSchema = z.object({
  storyTitle: z.string().min(2),
  storyDescription: z.string().min(2),
})

const CreateStory = () => {

  const [script, setScript] = useState('');
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createStory = useMutation(api.stories.createStory)

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storyTitle: "",
      storyDescription: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (!audioUrl || !imageUrl || !script) {
        toast({ title: 'Please upload Thumbnail/Audio files', variant: 'destructive' })
        setIsSubmitting(false)
        throw new Error("Please upload Thumbnail/Audio files")
      }

      const story = await createStory({
        storyTitle: data.storyTitle,
        storyDescription: data.storyDescription,
        storyScript: script,
        audioUrl,
        imageUrl,
        storyViews: 0,
        storyAudioDuration: audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      })
      toast({ title: "Congratulations!! Story created" })
      setIsSubmitting(false)
      router.push('/')
    } catch (error) {
      console.log(error)
      toast({ title: 'Error', variant: 'destructive' })
      setIsSubmitting(false)
    }

  }

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Story</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="storyTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">STORY | TITLE</FormLabel>
                  <FormControl>
                    <Input placeholder="STORY | TITLE" {...field} className="input-class focus-visible:ring-offset-orange-1" />
                  </FormControl>
                  <FormMessage className="text-orange-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storyDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">STORY | DESCRIPTION</FormLabel>
                  <FormControl>
                    <Textarea placeholder="STORY | DESCRIPTION" {...field} className="input-class focus-visible:ring-offset-orange-1" />
                  </FormControl>
                  <FormMessage className="text-orange-1" />
                </FormItem>
              )}
            />

          </div>

          <div className="flex flex-col pt-10 gap-2.5">

            <Label className="text-16 font-bold text-white-1 mb-[15px]">STORY | SCRIPT</Label>
            <StoryScriptModal
              script={script}
              setScript={setScript}
            />

            <StoryAudioModal
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              audio={audioUrl}
              setAudioDuration={setAudioDuration}
            />

            <StoryThumbnailModal
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
            />
            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-orange-1 rounded-lg py-2 font-extrabold transition-all duration-500 hover:bg-black-1 max-md:mb-8">
                {IsSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-3" />
                  </>
                ) : (
                  "Submit and publish story"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>

  )
}


export default CreateStory