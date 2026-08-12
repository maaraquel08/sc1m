import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button } from "../button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
  useToastManager,
} from "./toast";

const meta = {
  component: ToastProvider,
  tags: ["ai-generated"],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastList() {
  const { toasts } = useToastManager();

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast}>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
          <ToastClose aria-label="Dismiss">
            <svg viewBox="0 0 12 12" fill="none" className="size-3">
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </ToastClose>
        </Toast>
      ))}
    </ToastViewport>
  );
}

let stackCount = 0;

function StackingDemo() {
  const { add } = useToast();

  return (
    <Button
      variant="secondary"
      onClick={() =>
        add({
          title: `Changes saved (#${++stackCount})`,
          description: "Each click appends a toast to the stack.",
        })
      }
    >
      Add toast
    </Button>
  );
}

/** Sonner-style stack: click repeatedly — new toasts slide in front,
 * older ones peek behind, hover the stack to expand it. */
export const Stacking: Story = {
  render: () => (
    <ToastProvider>
      <StackingDemo />
      <ToastList />
    </ToastProvider>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole("button", { name: /add toast/i });
    await userEvent.click(button);
    await userEvent.click(button);
    const body = within(canvasElement.ownerDocument.body);
    // stacking: two clicks → two toasts
    await waitFor(async () => {
      const titles = await body.findAllByText(/changes saved/i);
      expect(titles).toHaveLength(2);
    });
  },
};

function NudgeDemo() {
  const { nudge } = useToast();

  return (
    <Button
      variant="secondary"
      onClick={() =>
        nudge({
          id: "cart",
          title: "Added to cart",
          description: "Re-firing pulses the toast instead of stacking.",
        })
      }
    >
      Add to cart
    </Button>
  );
}

/** Non-stacking nudge: a stable id means re-firing never appends — the
 * existing toast pulses and its dismiss timer resets. */
export const Nudge: Story = {
  render: () => (
    <ToastProvider>
      <NudgeDemo />
      <ToastList />
    </ToastProvider>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole("button", { name: /add to cart/i });
    await userEvent.click(button);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(async () => {
      expect(await body.findByText(/added to cart/i)).toBeVisible();
    });
    await userEvent.click(button);
    await userEvent.click(button);
    // nudge: three clicks → still exactly one toast, now pulsing
    const titles = await body.findAllByText(/added to cart/i);
    expect(titles).toHaveLength(1);
    const root = canvasElement.ownerDocument.querySelector(
      '[data-toast-id="cart"]',
    );
    await expect(root).toHaveClass("toast-nudge");
  },
};
