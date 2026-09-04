import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Banner } from './banner';

const meta = {
  component: Banner,
  tags: ['ai-generated'],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All four tones, so the tone is legible before a word is read. */
export const Default: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-2.5">
      <Banner tone="info">
        Hover and focus can&rsquo;t come from a real pointer here, so those two
        columns are forced with the same utility the component uses.
      </Banner>
      <Banner tone="warning">
        Two props on this page are deprecated and removed in 0.2. The table
        still documents them.
      </Banner>
      <Banner tone="success">
        The registry rebuilt cleanly and all 41 items validated.
      </Banner>
      <Banner tone="danger">
        This table was generated against 0.0.9. Three variants have changed
        since &mdash; regenerate before citing it.
      </Banner>
    </div>
  ),
};

export const Info: Story = {
  args: { children: 'Generated against 0.0.9 — regenerate before citing.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toBeVisible();
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    children: 'size="tiny" still renders but is removed in 0.2.',
  },
};

export const Success: Story = {
  args: { tone: 'success', children: 'All 41 registry items validated.' },
};

/** danger is the one tone that interrupts — role="alert", not "status". */
export const Danger: Story = {
  args: { tone: 'danger', children: 'Three variants have changed since 0.0.9.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toBeVisible();
  },
};

// Proves the flat wash actually resolves: the fill must be a real mix of the
// tone and --bg, so it can equal neither. A brand repointing --warning moves
// it, which is the whole point of driving the wash from a token.
export const CssCheck: Story = {
  args: { tone: 'warning', children: 'Css check' },
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('status');
    const fill = getComputedStyle(banner).backgroundColor;

    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--color-warning)';
    document.body.appendChild(probe);
    const warning = getComputedStyle(probe).backgroundColor;
    probe.style.backgroundColor = 'var(--color-bg)';
    const bg = getComputedStyle(probe).backgroundColor;
    probe.remove();

    await expect(fill).not.toBe('rgba(0, 0, 0, 0)');
    await expect(fill).not.toBe(warning);
    await expect(fill).not.toBe(bg);
  },
};
