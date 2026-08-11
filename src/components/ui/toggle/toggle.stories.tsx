import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Toggle } from './toggle';

const meta = {
  component: Toggle,
  tags: ['ai-generated'],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Toggle aria-label="Bold" {...args}>B</Toggle>,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: /bold/i });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Pressed: Story = {
  render: (args) => (
    <Toggle aria-label="Bold" defaultPressed {...args}>
      B
    </Toggle>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Toggle aria-label="Bold" disabled {...args}>
      B
    </Toggle>
  ),
};
