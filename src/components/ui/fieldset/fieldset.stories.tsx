import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Fieldset, FieldsetLegend } from './fieldset';
import { Field, FieldLabel, FieldControl } from '../field/field';

const meta = {
  component: Fieldset,
  tags: ['ai-generated'],
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Fieldset>
      <FieldsetLegend>Shipping address</FieldsetLegend>
      <Field name="street">
        <FieldLabel>Street</FieldLabel>
        <FieldControl placeholder="123 Main St" />
      </Field>
      <Field name="city">
        <FieldLabel>City</FieldLabel>
        <FieldControl placeholder="Metropolis" />
      </Field>
    </Fieldset>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Shipping address')).toBeVisible();
  },
};

export const Disabled: Story = {
  render: () => (
    <Fieldset disabled>
      <FieldsetLegend>Disabled section</FieldsetLegend>
      <Field name="note">
        <FieldLabel>Note</FieldLabel>
        <FieldControl placeholder="Can't edit" />
      </Field>
    </Fieldset>
  ),
};
