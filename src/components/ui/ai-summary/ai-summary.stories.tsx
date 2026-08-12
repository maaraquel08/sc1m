import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AiSummary, AiSummaryLabel, AiSummaryText } from './ai-summary';

const meta = {
  component: AiSummary,
  tags: ['ai-generated'],
} satisfies Meta<typeof AiSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AiSummary {...args} className="max-w-[342px]">
      <AiSummaryLabel>AI note</AiSummaryLabel>
      <AiSummaryText>
        Your 96th coffee this year. Same shop, same time. This one is a habit,
        not a decision.
      </AiSummaryText>
    </AiSummary>
  ),
};

export const Onboarding: Story = {
  render: (args) => (
    <AiSummary {...args} className="max-w-[342px]">
      <AiSummaryLabel>From what you told me</AiSummaryLabel>
      <AiSummaryText>
        On ₱96,000 a month I’d hold spending near ₱63,000, leaving ₱33,000,
        about 34%, to save. Change any of it later.
      </AiSummaryText>
    </AiSummary>
  ),
};

/** Pulse paused — for a summary that is stale, offline, or superseded. */
export const Paused: Story = {
  args: { active: false },
  render: (args) => (
    <AiSummary {...args} className="max-w-[342px]">
      <AiSummaryLabel>Last known</AiSummaryLabel>
      <AiSummaryText>
        You can spend ₱458 a day for the rest of August. Figures from 8:14 AM,
        before you went offline.
      </AiSummaryText>
    </AiSummary>
  ),
};

/** The same banner across the four places it appears in Ledger. */
export const Voices: Story = {
  render: (args) => (
    <div className="flex w-[342px] flex-col gap-4">
      <AiSummary {...args}>
        <AiSummaryLabel>This week</AiSummaryLabel>
        <AiSummaryText>
          Fridays cost you ₱4,800 a month. Moving one dinner in would cover
          your coffee habit twice over.
        </AiSummaryText>
      </AiSummary>
      <AiSummary {...args}>
        <AiSummaryLabel>Year in one line</AiSummaryLabel>
        <AiSummaryText>
          You saved four months of expenses in eight months. At this pace 2026
          closes at ₱1.46M net worth.
        </AiSummaryText>
      </AiSummary>
      <AiSummary {...args}>
        <AiSummaryLabel icon={null}>No sparkle</AiSummaryLabel>
        <AiSummaryText>
          Drop the icon when the banner sits directly under one that already
          carries it.
        </AiSummaryText>
      </AiSummary>
    </div>
  ),
};
