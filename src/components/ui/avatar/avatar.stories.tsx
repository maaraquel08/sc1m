import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './avatar';

const meta = {
  component: Avatar.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {
  render: () => (
    <Avatar.Root className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-surface text-sm font-medium text-fg-muted">
      <Avatar.Fallback>MR</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      {['MR', 'AB', 'CD'].map((initials) => (
        <Avatar.Root
          key={initials}
          className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-surface text-sm font-medium text-fg-muted outline-2 outline-bg"
        >
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  ),
};
