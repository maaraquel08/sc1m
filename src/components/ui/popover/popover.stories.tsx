import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

const meta = {
  component: PopoverContent,
  tags: ['ai-generated'],
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle className="text-sm font-semibold">
          Base UI Popover
        </PopoverTitle>
        <PopoverDescription className="mt-1 text-sm text-fg-muted">
          Portalled into the body, escaping the isolated app root.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /open popover/i }),
    );
    // popup is portalled to <body>, outside the story canvas
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByText(/base ui popover/i);
    // popup enters from opacity-0, wait for the transition to land
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const SideRight: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent side="right">
        <PopoverTitle className="text-sm font-semibold">
          Right side
        </PopoverTitle>
        <PopoverDescription className="mt-1 text-sm text-fg-muted">
          Positioned to the right of the trigger.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};
