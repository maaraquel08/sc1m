import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './scroll-area';

const meta = {
  component: ScrollArea,
  tags: ['ai-generated'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-md border border-line">
      <ScrollAreaViewport>
        <div className="p-4 text-sm text-fg">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="py-1">
              Row {i + 1}
            </p>
          ))}
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  ),
};
