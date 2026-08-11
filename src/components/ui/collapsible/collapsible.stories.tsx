import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from './collapsible';

const meta = {
  component: Collapsible,
  tags: ['ai-generated'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-96">
      <CollapsibleTrigger>What is a collapsible?</CollapsibleTrigger>
      <CollapsiblePanel>
        A single disclosure region that toggles between an open and closed
        state.
      </CollapsiblePanel>
    </Collapsible>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /what is a collapsible/i }),
    );
    await expect(
      canvas.getByText(/disclosure region/i),
    ).toBeVisible();
  },
};
