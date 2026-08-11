import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Checkbox } from './checkbox';

const meta = {
  component: Checkbox.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Checkbox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoCheckbox(props: React.ComponentProps<typeof Checkbox.Root>) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox.Root
        className="flex size-5 items-center justify-center rounded-sm border border-line-strong bg-surface-raised transition-colors duration-fast data-checked:border-accent data-checked:bg-accent"
        {...props}
      >
        <Checkbox.Indicator className="text-accent-fg data-unchecked:hidden">
          <svg viewBox="0 0 12 10" fill="none" className="size-3">
            <path
              d="M1 5.5L4 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
      Accept terms
    </label>
  );
}

export const Unchecked: Story = {
  render: () => <DemoCheckbox />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /accept terms/i });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  render: () => <DemoCheckbox defaultChecked />,
};

export const Disabled: Story = {
  render: () => <DemoCheckbox disabled />,
};
