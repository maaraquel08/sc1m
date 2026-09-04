import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import { Badge } from './badge';

const meta = {
  component: Badge,
  tags: ['ai-generated'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fill only: the tint carries the state, no glyph. */
export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success">Paid</Badge>
      <Badge tone="info">Pending</Badge>
      <Badge tone="warning">Retrying</Badge>
      <Badge tone="danger">Overdue</Badge>
      <Badge>Draft</Badge>
    </div>
  ),
};

export const Neutral: Story = {
  args: { children: 'Draft' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Draft')).toBeVisible();
  },
};

export const Success: Story = { args: { tone: 'success', children: 'Paid' } };
export const Info: Story = { args: { tone: 'info', children: 'Pending' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Retrying' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Overdue' } };

/** The icon slot: off by default, and sized by the slot rather than the glyph. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success" icon={<CheckCircle weight="fill" />}>
        Paid
      </Badge>
      <Badge tone="danger" icon={<WarningCircle weight="fill" />}>
        Overdue
      </Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    // the glyph is decorative — the label is what gets announced
    await expect(canvas.getByText('Paid')).toBeVisible();
  },
};

// Proves the fill is a real mix rather than a flat token: it must equal
// neither the tone nor the page background, so repointing --success in a
// brand file moves the chip with it.
export const CssCheck: Story = {
  args: { tone: 'success', children: 'Css check' },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Css check');
    const fill = getComputedStyle(badge).backgroundColor;

    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--color-success)';
    document.body.appendChild(probe);
    const success = getComputedStyle(probe).backgroundColor;
    probe.style.backgroundColor = 'var(--color-bg)';
    const bg = getComputedStyle(probe).backgroundColor;
    probe.remove();

    await expect(fill).not.toBe('rgba(0, 0, 0, 0)');
    await expect(fill).not.toBe(success);
    await expect(fill).not.toBe(bg);
  },
};
