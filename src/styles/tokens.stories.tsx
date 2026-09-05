import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { BRANDS, COLOR_TOKENS, SHAPE_TOKENS } from './contract';

/**
 * Token parity check: every registered brand must resolve every
 * contract token in both themes. Catches the silent failure modes of
 * the multi-file contract — a brand file missing a token after a
 * contract widening, a typo'd name, or a rename that only landed on
 * one side of the @theme mapping.
 */
function ContractGrid() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-fg-muted">
        {BRANDS.length} brands × {COLOR_TOKENS.length} color tokens ×
        light/dark — assertions run in the play function.
      </p>
      <div className="flex flex-wrap gap-1">
        {COLOR_TOKENS.map((token) => (
          <div
            key={token}
            className="rounded-sm border border-line px-2 py-1 font-mono text-xs"
            style={{ backgroundColor: `var(--${token})` }}
          >
            <span className="rounded-sm bg-surface-raised px-1 text-fg">
              {token}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  component: ContractGrid,
  tags: ['ai-generated'],
} satisfies Meta<typeof ContractGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Parity: Story = {
  play: async () => {
    const html = document.documentElement;
    const saved = { brand: html.dataset.brand, dark: html.classList.contains('dark') };
    const resolve = (name: string) =>
      getComputedStyle(html).getPropertyValue(`--${name}`).trim();

    const accents: Record<string, string> = {};
    try {
      for (const brand of BRANDS) {
        if (brand.attr) html.dataset.brand = brand.attr;
        else delete html.dataset.brand;

        for (const theme of ['light', 'dark'] as const) {
          html.classList.toggle('dark', theme === 'dark');
          for (const token of [...COLOR_TOKENS, ...SHAPE_TOKENS]) {
            const value = resolve(token);
            await expect(
              value,
              `--${token} must resolve for brand "${brand.key}" (${theme})`,
            ).not.toBe('');
          }
          accents[`${brand.key}/${theme}`] = resolve('accent');
        }
      }

      // brands must actually differ, or the switcher is wired to nothing
      await expect(accents['luntian/light']).not.toBe(accents['sc1m/light']);
      // themes must actually differ within a brand
      await expect(accents['luntian/light']).not.toBe(accents['luntian/dark']);
    } finally {
      if (saved.brand) html.dataset.brand = saved.brand;
      else delete html.dataset.brand;
      html.classList.toggle('dark', saved.dark);
    }
  },
};
