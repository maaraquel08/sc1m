import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Toggle } from '../toggle/toggle';
import { ToggleGroup } from './toggle-group';

const meta = {
  component: ToggleGroup,
  tags: ['ai-generated'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ToggleGroup aria-label="Text alignment" {...args}>
      <Toggle value="left" aria-label="Align left">
        L
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        C
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        R
      </Toggle>
    </ToggleGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const center = canvas.getByRole('button', { name: /align center/i });
    await userEvent.click(center);
    await expect(center).toHaveAttribute('aria-pressed', 'true');
  },
};

export const WithSelection: Story = {
  render: (args) => (
    <ToggleGroup defaultValue={['center']} aria-label="Text alignment" {...args}>
      <Toggle value="left" aria-label="Align left">
        L
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        C
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        R
      </Toggle>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <ToggleGroup disabled aria-label="Text alignment" {...args}>
      <Toggle value="left" aria-label="Align left">
        L
      </Toggle>
      <Toggle value="center" aria-label="Align center">
        C
      </Toggle>
      <Toggle value="right" aria-label="Align right">
        R
      </Toggle>
    </ToggleGroup>
  ),
};
