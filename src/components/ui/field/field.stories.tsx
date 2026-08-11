import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Field, FieldLabel, FieldDescription, FieldError, FieldControl } from './field';

const meta = {
  component: Field,
  tags: ['ai-generated'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" placeholder="you@example.com" />
      <FieldDescription>We&apos;ll never share your email.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toBeVisible();
  },
};

export const WithError: Story = {
  render: () => (
    <Field name="username" validationMode="onChange">
      <FieldLabel>Username</FieldLabel>
      <FieldControl required minLength={3} defaultValue="ab" />
      <FieldError match="tooShort">Username must be at least 3 characters.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field name="disabled-field" disabled>
      <FieldLabel>Disabled field</FieldLabel>
      <FieldControl placeholder="Can't touch this" />
    </Field>
  ),
};
