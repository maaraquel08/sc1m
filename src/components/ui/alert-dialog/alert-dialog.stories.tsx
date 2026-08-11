import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

const meta = {
  component: AlertDialog,
  tags: ['ai-generated'],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="danger" />}>
        Delete workspace
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle className="text-base font-semibold">
          Delete workspace
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-1 text-sm text-fg-muted">
          This action is permanent and cannot be undone.
        </AlertDialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="danger" />}>
            Delete
          </AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /delete workspace/i }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByText(/this action is permanent/i);
    // popup enters from opacity-0, wait for the transition to land
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const InitiallyOpen: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger render={<Button variant="danger" />}>
        Delete workspace
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle className="text-base font-semibold">
          Remove member
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-1 text-sm text-fg-muted">
          They will lose access to this workspace immediately.
        </AlertDialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="danger" />}>
            Remove
          </AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
