import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from './preview-card';

const meta = {
  component: PreviewCard,
  tags: ['ai-generated'],
} satisfies Meta<typeof PreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger
        href="#"
        delay={0}
        className="text-fg underline decoration-line-strong underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-ring"
      >
        @sprout-team
      </PreviewCardTrigger>
      <PreviewCardContent>
        <p className="text-sm font-semibold">Sprout Team</p>
        <p className="mt-1 text-sm text-fg-muted">
          Design system maintainers. Hover to preview, click to visit.
        </p>
      </PreviewCardContent>
    </PreviewCard>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.hover(canvas.getByText(/@sprout-team/i));
    const body = within(canvasElement.ownerDocument.body);
    const description = await body.findByText(/design system maintainers/i);
    // popup enters from opacity-0, wait for the transition to land
    await waitFor(() => expect(description).toBeVisible());
  },
};

export const Side: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger
        href="#"
        className="text-fg underline decoration-line-strong underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-ring"
      >
        @sprout-team
      </PreviewCardTrigger>
      <PreviewCardContent side="right">
        <p className="text-sm font-semibold">Sprout Team</p>
        <p className="mt-1 text-sm text-fg-muted">
          This preview opens to the right of the trigger.
        </p>
      </PreviewCardContent>
    </PreviewCard>
  ),
};
