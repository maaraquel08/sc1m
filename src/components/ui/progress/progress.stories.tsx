import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from './progress';

const meta = {
  component: Progress,
  tags: ['ai-generated'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60 },
  render: (args) => (
    <Progress {...args} className="w-64">
      <div className="flex items-center justify-between">
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
};

export const Indeterminate: Story = {
  args: { value: null },
  render: (args) => (
    <Progress {...args} className="w-64">
      <ProgressLabel>Loading</ProgressLabel>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
};
