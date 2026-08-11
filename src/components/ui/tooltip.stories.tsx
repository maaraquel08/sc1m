import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';
import { Tooltip } from './tooltip';

const meta = {
  component: Tooltip,
  tags: ['ai-generated'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    content: 'Styled with design tokens',
    children: <Button variant="secondary">Hover me</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Appears below the trigger',
    side: 'bottom',
    children: <Button variant="secondary">Hover me</Button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Appears to the right',
    side: 'right',
    children: <Button variant="secondary">Hover me</Button>,
  },
};
