import { defineStoryFactory } from "@fumadocs/story/next/client";

/**
 * Shared story factory. Every *.story.tsx in src/components/ui uses this
 * so global story settings live in one place.
 *
 * The `.story` suffix is load-bearing — the build-time plugin only
 * transforms files matching it. Storybook's own glob is `*.stories.*`,
 * so the two systems never see each other's files.
 */
export const { defineStory } = defineStoryFactory();
