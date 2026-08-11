import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const meta = {
  component: Drawer,
  tags: ['ai-generated'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="text-base font-semibold">
          Notifications
        </DrawerTitle>
        <DrawerDescription className="mt-1 text-sm text-fg-muted">
          You are all caught up. Good job!
        </DrawerDescription>
        <div className="mt-5 flex justify-end gap-2">
          <DrawerClose render={<Button variant="ghost" />}>Close</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /open drawer/i }));
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByText(/notifications/i);
    // popup enters translated off-screen, wait for the transition to land
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const InitiallyOpen: Story = {
  render: () => (
    <Drawer defaultOpen>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="text-base font-semibold">Account</DrawerTitle>
        <DrawerDescription className="mt-1 text-sm text-fg-muted">
          Swipe down or press close to dismiss this sheet.
        </DrawerDescription>
        <div className="mt-5 flex justify-end gap-2">
          <DrawerClose render={<Button variant="ghost" />}>Close</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
