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
  useToastManager,
} from "./toast";

const meta = {
  component: ToastProvider,
  tags: ["ai-generated"],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemoButton() {
  const toastManager = useToastManager();

  return (
    <Button
      variant="secondary"
      onClick={() =>
        toastManager.add({
          title: "Changes saved",
          description: "Your workspace settings were updated.",
        })
      }
    >
      Show toast
    </Button>
  );
}

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

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemoButton />
      <ToastList />
    </ToastProvider>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /show toast/i }));
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByText(/changes saved/i);
    await waitFor(() => expect(title).toBeVisible());
  },
};
