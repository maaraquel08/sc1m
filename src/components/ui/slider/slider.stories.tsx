import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Slider } from './slider';

const meta = {
  component: Slider,
  tags: ['ai-generated'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 40, className: 'w-72' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider')).toHaveValue('40');
  },
};

export const Disabled: Story = {
  args: { defaultValue: 40, className: 'w-72', disabled: true },
};
