import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Radio } from '../radio/radio';
import { RadioGroup } from './radio-group';

const meta = {
  component: RadioGroup,
  tags: ['ai-generated'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = ['small', 'medium', 'large'];

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="small" aria-label="Size" {...args}>
      {options.map((size) => (
        <label key={size} className="flex items-center gap-2 text-sm">
          <Radio value={size} />
          {size}
        </label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const large = canvas.getByRole('radio', { name: /large/i });
    await userEvent.click(large);
    await expect(large).toBeChecked();
  },
};

export const WithSelection: Story = {
  render: (args) => (
    <RadioGroup defaultValue="medium" aria-label="Size" {...args}>
      {options.map((size) => (
        <label key={size} className="flex items-center gap-2 text-sm">
          <Radio value={size} />
          {size}
        </label>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup defaultValue="small" disabled aria-label="Size" {...args}>
      {options.map((size) => (
        <label key={size} className="flex items-center gap-2 text-sm">
          <Radio value={size} />
          {size}
        </label>
      ))}
    </RadioGroup>
  ),
};
