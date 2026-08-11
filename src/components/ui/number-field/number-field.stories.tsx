import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from './number-field';

const meta = {
  component: NumberField,
  tags: ['ai-generated'],
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoNumberField(props: React.ComponentProps<typeof NumberField>) {
  return (
    <NumberField defaultValue={10} {...props}>
      <NumberFieldGroup>
        <NumberFieldDecrement>−</NumberFieldDecrement>
        <NumberFieldInput />
        <NumberFieldIncrement>+</NumberFieldIncrement>
      </NumberFieldGroup>
    </NumberField>
  );
}

export const Default: Story = {
  render: () => <DemoNumberField />,
  play: async ({ canvas, userEvent }) => {
    const increment = canvas.getByText('+');
    await userEvent.click(increment);
    await expect(canvas.getByRole('textbox')).toHaveValue('11');
  },
};

export const Disabled: Story = {
  render: () => <DemoNumberField disabled />,
};
