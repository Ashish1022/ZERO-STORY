import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    stories: defineTable({
        user: v.id('users'),

        storyTitle: v.string(),
        storyDescription: v.string(),
        storyScript: v.string(),

        audioUrl: v.string(),
        audioStorageId: v.optional(v.id("_storage")),

        imageUrl: v.string(),
        imageStorageId: v.optional(v.id("_storage")),

        storyAuthor: v.string(),
        storyAuthorId: v.string(),
        storyAuthorImageUrl: v.string(),

        storyAudioDuration: v.number(),
        storyViews: v.number(),
    })
    .searchIndex('search_author', { searchField: 'storyAuthor' })
    .searchIndex('search_title', { searchField: 'storyTitle' })
    .searchIndex('search_body', { searchField: 'storyDescription' })
    ,
    users: defineTable({
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        name: v.string(),

    })
})
