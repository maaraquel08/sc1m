import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { OTPField, OTPFieldInput } from './otp-field';

const meta = {
  component: OTPField,
  tags: ['ai-generated'],
} satisfies Meta<typeof OTPField>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoOTPField(
  props: Omit<React.ComponentProps<typeof OTPField>, 'length'>,
) {
  return (
    <OTPField {...props} length={4}>
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
      <OTPFieldInput />
    </OTPField>
  );
}

export const Default: Story = {
  args: { length: 4 },
  render: () => <DemoOTPField />,
  play: async ({ canvas, userEvent }) => {
    const inputs = canvas.getAllByRole('textbox');
    await userEvent.type(inputs[0], '1234');
    await expect(inputs[0]).toHaveValue('1');
  },
};

export const Disabled: Story = {
  args: { length: 4 },
  render: () => <DemoOTPField disabled />,
};
