import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createStory = mutation({
  args: {
    storyTitle: v.string(),
    storyDescription: v.string(),
    storyScript: v.string(),

    audioStorageId: v.id('_storage'),
    audioUrl: v.string(),

    imageStorageId: v.id('_storage'),
    imageUrl: v.string(),

    storyAudioDuration: v.number(),
    storyViews: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated")
    }

    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("email"), identity.email)).collect();

    if (user.length === 0) {
      throw new ConvexError("User not found")
    }

    return await ctx.db.insert("stories", {
      user: user[0]._id,

      storyTitle: args.storyTitle,
      storyDescription: args.storyDescription,
      storyScript: args.storyScript,

      audioStorageId: args.audioStorageId,
      audioUrl: args.audioUrl,

      imageStorageId: args.imageStorageId,
      imageUrl: args.imageUrl,

      storyAudioDuration: args.storyAudioDuration,
      storyViews: args.storyViews,

      storyAuthor: user[0].name,
      storyAuthorId: user[0].clerkId,
      storyAuthorImageUrl: user[0].imageUrl
    });
  },
});

export const getUrl = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getStoryById = query({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.storyId)
  }
})

export const getTrendingStories = query({
  handler: async (ctx) => {
    const story = await ctx.db.query("stories").collect();

    return story.sort((a, b) => b.storyViews - a.storyViews).slice(0, 8);
  },
});

export const updateStoryViews = mutation({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);

    if (!story) {
      throw new ConvexError("Story not found");
    }

    return await ctx.db.patch(args.storyId, {
      storyViews: story.storyViews + 1,
    });
  },
});

export const getStoryByAuthorId = query({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);

    return await ctx.db.query("stories").filter((q) => q.and(q.eq(q.field("storyAuthorId"), story?.storyAuthorId), q.neq(q.field("_id"), args.storyId))
    ).collect();
  },
});

export const getStoryByAuthorIdForProfilePage = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const stories = await ctx.db
      .query("stories")
      .filter((q) => q.eq(q.field("storyAuthorId"), args.authorId))
      .collect();

    const totalListeners = stories.reduce(
      (sum, story) => sum + story.storyViews,
      0
    );

    return { stories, listeners: totalListeners };
  },
});

export const deleteStory = mutation({
  args: {
    storyId: v.id("stories"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);

    if (!story) {
      throw new ConvexError("Story not found")
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.storyId)
  }
});

export const getStoryBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("stories").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("stories")
      .withSearchIndex("search_author", (q) => q.search("storyAuthor", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("stories")
      .withSearchIndex("search_title", (q) =>
        q.search("storyTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("stories")
      .withSearchIndex("search_body", (q) =>
        q.search("storyDescription" || "storyTitle", args.search)
      )
      .take(10);
  },
});

export const getRandomStory = query({
  args: {
    profileId: v.string(),
  },
  handler: async(ctx, args) => {
    return await ctx.db.query("stories").filter((q)=>q.eq(q.field("storyAuthorId"),args.profileId)).collect();
  }
})