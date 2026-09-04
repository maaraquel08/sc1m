import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  AiSummary,
  AiSummaryLabel,
  AiSummaryMark,
  AiSummaryText,
} from './ai-summary';

const meta = {
  component: AiSummary,
  tags: ['ai-generated'],
} satisfies Meta<typeof AiSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The summary the four paintings were judged against. */
function Copy() {
  return (
    <>
      <AiSummaryLabel>What mattered</AiSummaryLabel>
      <AiSummaryText>
        You made 42 purchases in August.{' '}
        <AiSummaryMark>Twelve were the same café at the same hour</AiSummaryMark>{' '}
        — a habit, not a decision. Groceries fell{' '}
        <AiSummaryMark>31%</AiSummaryMark>{' '}
        in the same weeks.
      </AiSummaryText>
    </>
  );
}

/** Ink & accent — the restrained one, and the default. */
export const Default: Story = {
  render: () => (
    <AiSummary className="w-[440px]">
      <Copy />
    </AiSummary>
  ),
};

/** Warm palette, high warp, slow pan — the veil runs flat at 72%. */
export const Ember: Story = {
  render: () => (
    <AiSummary palette="ember" className="w-[440px]">
      <Copy />
    </AiSummary>
  ),
};

/** Cool and deep, low warp with high octaves; bottom-weighted veil. */
export const Tide: Story = {
  render: () => (
    <AiSummary palette="tide" className="w-[440px]">
      <Copy />
    </AiSummary>
  ),
};

/** Green and sand, near-vertical gradient and a lazy 52s pan. */
export const Moss: Story = {
  render: () => (
    <AiSummary palette="moss" className="w-[440px]">
      <Copy />
    </AiSummary>
  ),
};
