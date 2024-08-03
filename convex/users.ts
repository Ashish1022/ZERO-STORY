import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";


export const createUser = internalMutation({
    args: {
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        name: v.string(),

    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            email: args.email,
            imageUrl: args.imageUrl,
            clerkId: args.clerkId,
            name: args.name,

        });
    },
});

export const updateUser = internalMutation({
    args: {
        clerkId: v.string(),
        imageUrl: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.clerkId)).unique();

        if (!user) {
            throw new ConvexError("User not found")
        }

        await ctx.db.patch(user._id, {
            imageUrl: args.imageUrl,
            email: args.email
        });
    },
});

export const deleteUser = internalMutation({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.clerkId)).unique();

        if (!user) {
            throw new ConvexError("User not found")
        }

        await ctx.db.delete(user._id)
    }
})

export const getTopUserByStoryCount = query({
    args: {},
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").collect();

        const userData = await Promise.all(
            user.map(async (u) => {
                const stories = await ctx.db
                    .query("stories")
                    .filter((q) => q.eq(q.field("storyAuthorId"), u.clerkId))
                    .collect();

                const sortedStories = stories.sort((a, b) => b.storyViews - a.storyViews);

                return {
                    ...u,
                    totalStories: stories.length,
                    story: sortedStories.map((p) => ({
                        storyTitle: p.storyTitle,
                        storyId: p._id,
                    })),
                };
            })
        );

        return userData.sort((a, b) => b.totalStories - a.totalStories);
    },
});

export const getUserById = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        return user;
    },
});