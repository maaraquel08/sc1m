import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Tabs, TabsList, TabsTab, TabsPanel } from './tabs';

const meta = {
  component: Tabs,
  tags: ['ai-generated'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tokens" className="w-96">
      <TabsList>
        {['tokens', 'components', 'patterns'].map((value) => (
          <TabsTab key={value} value={value}>
            {value}
          </TabsTab>
        ))}
      </TabsList>
      <TabsPanel value="tokens">
        Color, typography, spacing, and motion tokens.
      </TabsPanel>
      <TabsPanel value="components">
        Base UI primitives styled with the token layer.
      </TabsPanel>
      <TabsPanel value="patterns">
        Composition patterns built from components.
      </TabsPanel>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('tab', { name: /components/i }));
    await expect(
      canvas.getByText(/primitives styled with the token layer/i),
    ).toBeVisible();
  },
};
