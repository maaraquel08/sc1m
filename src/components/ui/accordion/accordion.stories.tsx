import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Accordion } from './accordion';

const meta = {
  component: Accordion.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: 'tokens',
    title: 'What are design tokens?',
    body: 'Named values for color, type, spacing, and motion that keep the system consistent.',
  },
  {
    value: 'primitives',
    title: 'Why Base UI?',
    body: 'Unstyled, accessible primitives that leave every visual decision to the token layer.',
  },
  {
    value: 'theming',
    title: 'How does dark mode work?',
    body: 'Semantic tokens flip under the .dark class, so components never change.',
  },
];

export const Default: Story = {
  render: () => (
    <Accordion.Root className="w-96 rounded-lg border border-line">
      {items.map((item) => (
        <Accordion.Item
          key={item.value}
          value={item.value}
          className="border-b border-line last:border-b-0"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors duration-fast hover:bg-surface">
              {item.title}
              <span aria-hidden className="text-fg-subtle">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="px-4 pb-3 text-sm text-fg-muted">
            {item.body}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /why base ui/i }),
    );
    await expect(
      canvas.getByText(/unstyled, accessible primitives/i),
    ).toBeVisible();
  },
};
