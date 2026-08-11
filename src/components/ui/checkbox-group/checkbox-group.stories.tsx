import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Checkbox } from '../checkbox/checkbox';
import { CheckboxGroup } from './checkbox-group';

const meta = {
  component: CheckboxGroup,
  tags: ['ai-generated'],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruits = ['apple', 'banana', 'cherry'];

export const Default: Story = {
  render: (args) => (
    <CheckboxGroup aria-label="Fruits" {...args}>
      {fruits.map((fruit) => (
        <label key={fruit} className="flex items-center gap-2 text-sm">
          <Checkbox name={fruit} />
          {fruit}
        </label>
      ))}
    </CheckboxGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const banana = canvas.getByRole('checkbox', { name: /banana/i });
    await userEvent.click(banana);
    await expect(banana).toBeChecked();
  },
};

export const WithSelection: Story = {
  render: (args) => (
    <CheckboxGroup defaultValue={['apple']} aria-label="Fruits" {...args}>
      {fruits.map((fruit) => (
        <label key={fruit} className="flex items-center gap-2 text-sm">
          <Checkbox name={fruit} />
          {fruit}
        </label>
      ))}
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <CheckboxGroup disabled aria-label="Fruits" {...args}>
      {fruits.map((fruit) => (
        <label key={fruit} className="flex items-center gap-2 text-sm">
          <Checkbox name={fruit} />
          {fruit}
        </label>
      ))}
    </CheckboxGroup>
  ),
};
