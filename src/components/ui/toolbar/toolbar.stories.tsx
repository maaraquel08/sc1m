import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarLink,
} from './toolbar';

const meta = {
  component: Toolbar,
  tags: ['ai-generated'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup>
        <ToolbarButton>Bold</ToolbarButton>
        <ToolbarButton>Italic</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#">Docs</ToolbarLink>
    </Toolbar>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /bold/i }),
    ).toBeVisible();
  },
};
