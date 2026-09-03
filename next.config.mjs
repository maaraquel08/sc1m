import { createMDX } from 'fumadocs-mdx/next';
import { createNextStory } from '@fumadocs/story/next';

/** @type {import('next').NextConfig} */
const config = {};

const withMDX = createMDX();
const withStory = createNextStory({
  // Turbopack matches rule globs against the full path, so a bare
  // `*.story.tsx` never reaches src/components/ui/<n>/<n>.story.tsx.
  filter: '**/*.story.{js,jsx,ts,tsx}',
});

// Story's transform must see the MDX-processed config, so it wraps outermost.
export default withStory(withMDX(config));
