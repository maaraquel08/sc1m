import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Slider } from './slider';

const meta = {
  component: Slider.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Slider.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoSlider(props: React.ComponentProps<typeof Slider.Root>) {
  return (
    <Slider.Root defaultValue={40} className="w-72" {...props}>
      <Slider.Control className="flex w-full items-center py-2">
        <Slider.Track className="h-1.5 w-full rounded-full bg-line select-none">
          <Slider.Indicator className="rounded-full bg-accent select-none" />
          <Slider.Thumb
            aria-label="Value"
            className="size-4 rounded-full bg-surface-raised shadow-raised outline outline-line-strong select-none focus-visible:outline-2 focus-visible:outline-ring"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}

export const Default: Story = {
  render: () => <DemoSlider />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider')).toHaveValue('40');
  },
};

export const Disabled: Story = {
  render: () => <DemoSlider disabled />,
};
