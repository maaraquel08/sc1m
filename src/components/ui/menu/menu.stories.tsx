import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from './menu';

const meta = {
  component: MenuContent,
  tags: ['ai-generated'],
} satisfies Meta<typeof MenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" />}>
        Open menu
      </MenuTrigger>
      <MenuContent>
        <MenuItem>New file</MenuItem>
        <MenuItem>New window</MenuItem>
        <MenuSeparator />
        <MenuItem>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem disabled>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }));
    const body = within(canvasElement.ownerDocument.body);
    const item = await body.findByText(/new file/i);
    await waitFor(() => expect(item).toBeVisible());
  },
};
