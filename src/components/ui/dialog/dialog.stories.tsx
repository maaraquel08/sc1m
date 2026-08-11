import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const meta = {
  component: Dialog,
  tags: ['ai-generated'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-base font-semibold">
          Delete workspace
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-fg-muted">
          This action is permanent and cannot be undone.
        </DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <DialogClose render={<Button variant="ghost" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button variant="danger" />}>
            Delete
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }));
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByText(/delete workspace/i);
    // popup enters from opacity-0, wait for the transition to land
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const InitiallyOpen: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="secondary" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-base font-semibold">
          Invite teammates
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-fg-muted">
          Send an invite link to anyone on your team.
        </DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ),
};
