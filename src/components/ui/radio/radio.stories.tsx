import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { RadioGroup } from '../radio-group/radio-group';
import { Radio } from './radio';

const meta = {
  component: Radio,
  tags: ['ai-generated'],
  args: {
    value: 'option',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="small" aria-label="Size">
      {['small', 'medium', 'large'].map((size) => (
        <label key={size} className="flex items-center gap-2 text-sm">
          <Radio value={size} />
          {size}
        </label>
      ))}
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const medium = canvas.getByRole('radio', { name: /medium/i });
    await userEvent.click(medium);
    await expect(medium).toBeChecked();
  },
};

export const Checked: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <RadioGroup defaultValue="on">
        <Radio value="on" />
      </RadioGroup>
      On
    </label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="small" disabled aria-label="Size">
      {['small', 'medium', 'large'].map((size) => (
        <label key={size} className="flex items-center gap-2 text-sm">
          <Radio value={size} />
          {size}
        </label>
      ))}
    </RadioGroup>
  ),
};
