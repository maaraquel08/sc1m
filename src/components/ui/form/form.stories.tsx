import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Form } from './form';
import { Field, FieldLabel, FieldControl, FieldError } from '../field/field';
import { Button } from '../button/button';

const meta = {
  component: Form,
  tags: ['ai-generated'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form
      onFormSubmit={(values, eventDetails) => {
        eventDetails.event?.preventDefault?.();
      }}
    >
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <FieldControl required placeholder="Ada Lovelace" />
        <FieldError />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Name')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Submit' })).toBeVisible();
  },
};
