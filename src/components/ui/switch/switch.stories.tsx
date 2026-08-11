import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Switch } from './switch';

const meta = {
  component: Switch.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Switch.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoSwitch(props: React.ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      aria-label="Toggle setting"
      className="relative flex h-6 w-10 rounded-full bg-line-strong p-0.5 transition-colors duration-fast data-checked:bg-accent"
      {...props}
    >
      <Switch.Thumb className="aspect-square h-full rounded-full bg-surface-raised shadow-raised transition-transform duration-fast data-checked:translate-x-4" />
    </Switch.Root>
  );
}

export const Unchecked: Story = {
  render: () => <DemoSwitch />,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch');
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const Checked: Story = {
  render: () => <DemoSwitch defaultChecked />,
};

export const Disabled: Story = {
  render: () => <DemoSwitch disabled />,
};
