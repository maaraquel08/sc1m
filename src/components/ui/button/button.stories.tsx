import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Button } from './button';

const meta = {
  component: Button,
  tags: ['ai-generated'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Save changes' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /save changes/i }),
    ).toBeVisible();
  },
};

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary' },
};

export const Ghost: Story = {
  args: { children: 'Dismiss', variant: 'ghost' },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
};

export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
};

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
};

export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
};

// Proves the shared preview loaded globals.css: the primary button's
// background resolves to --color-accent. Compared against a probe painted
// with the same token rather than a literal colour, so swapping which brand
// owns :root does not break the check.
export const CssCheck: Story = {
  args: { children: 'Css check' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /css check/i });
    const bg = getComputedStyle(button).backgroundColor;

    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--color-accent)';
    document.body.appendChild(probe);
    const accent = getComputedStyle(probe).backgroundColor;
    probe.remove();

    // guards the probe itself: an unloaded stylesheet leaves it transparent
    await expect(accent).not.toBe('rgba(0, 0, 0, 0)');
    await expect(bg).toBe(accent);
  },
};
