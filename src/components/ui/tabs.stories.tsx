import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Tabs } from './tabs';

const meta = {
  component: Tabs.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="tokens" className="w-96">
      <Tabs.List className="relative flex gap-1 rounded-lg bg-surface p-1">
        {['tokens', 'components', 'patterns'].map((value) => (
          <Tabs.Tab
            key={value}
            value={value}
            className="z-1 flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize text-fg-muted transition-colors duration-fast data-selected:text-fg"
          >
            {value}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className="absolute top-1 left-0 h-[calc(100%-0.5rem)] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-md bg-surface-raised shadow-raised transition-all duration-fast" />
      </Tabs.List>
      <Tabs.Panel value="tokens" className="p-4 text-sm text-fg-muted">
        Color, typography, spacing, and motion tokens.
      </Tabs.Panel>
      <Tabs.Panel value="components" className="p-4 text-sm text-fg-muted">
        Base UI primitives styled with the token layer.
      </Tabs.Panel>
      <Tabs.Panel value="patterns" className="p-4 text-sm text-fg-muted">
        Composition patterns built from components.
      </Tabs.Panel>
    </Tabs.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('tab', { name: /components/i }));
    await expect(
      canvas.getByText(/primitives styled with the token layer/i),
    ).toBeVisible();
  },
};
