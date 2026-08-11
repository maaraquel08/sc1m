import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Checkbox } from './checkbox';

const meta = {
  component: Checkbox,
  tags: ['ai-generated'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox {...args} />
      Accept terms
    </label>
  ),
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /accept terms/i });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox defaultChecked {...args} />
      Accept terms
    </label>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox disabled {...args} />
      Accept terms
    </label>
  ),
};
