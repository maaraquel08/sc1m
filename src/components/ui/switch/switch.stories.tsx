import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Switch } from './switch';

const meta = {
  component: Switch,
  tags: ['ai-generated'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  render: (args) => <Switch aria-label="Toggle setting" {...args} />,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch');
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const Checked: Story = {
  render: (args) => (
    <Switch aria-label="Toggle setting" defaultChecked {...args} />
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Switch aria-label="Toggle setting" disabled {...args} />
  ),
};
