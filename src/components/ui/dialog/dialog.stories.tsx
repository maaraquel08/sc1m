import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { Dialog } from './dialog';

const meta = {
  component: Dialog.Root,
  tags: ['ai-generated'],
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="secondary" />}>
        Open dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface-raised p-6 text-fg shadow-overlay transition-[opacity,transform] duration-fast data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
          <Dialog.Title className="text-base font-semibold">
            Delete workspace
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-fg-muted">
            This action is permanent and cannot be undone.
          </Dialog.Description>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close render={<Button variant="ghost" />}>
              Cancel
            </Dialog.Close>
            <Dialog.Close render={<Button variant="danger" />}>
              Delete
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }));
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByText(/delete workspace/i);
    // popup enters from opacity-0, wait for the transition to land
    await waitFor(() => expect(title).toBeVisible());
  },
};
