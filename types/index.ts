import { Id } from "@/convex/_generated/dataModel";

export interface StoryCardProps {
    storyId: Id<"stories">;
    title: string;
    description: string;
    imgURL: string;
}

export interface TopStoriersProps {
    _id: Id<"users">;
    _creationTime: number;
    email: string;
    imageUrl: string;
    clerkId: string;
    name: string;
    story: {
        storyTitle: string;
        storyId: Id<"stories">;
    }[];
    totalStories: number;
}

export interface StoryProps {
    _id: Id<"stories">;
    _creationTime: number;
    audioStorageId: Id<"_storage"> | null;
    user: Id<"users">;
    storyTitle: string;
    storyDescription: string;
    audioUrl: string | null;
    imageUrl: string | null;
    imageStorageId: Id<"_storage"> | null;
    author: string;
    authorId: string;
    authorImageUrl: string;
    audioDuration: number;
    views: number;
}

export interface ProfileStoryProps {
    stories: StoryProps[];
    listeners: number;
}

export interface ProfileCardProps {
    storyData: ProfileStoryProps;
    imageUrl: string;
    userFirstName: string;
}