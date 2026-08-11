import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, AvatarFallback } from './avatar';

const meta = {
  component: Avatar,
  tags: ['ai-generated'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      {['MR', 'AB', 'CD'].map((initials) => (
        <Avatar key={initials} className="outline-2 outline-bg">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
