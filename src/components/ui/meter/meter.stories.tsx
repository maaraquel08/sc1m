import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from './meter';

const meta = {
  component: Meter,
  tags: ['ai-generated'],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 40 },
  render: (args) => (
    <Meter {...args} className="w-64">
      <div className="flex items-center justify-between">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  ),
};

export const NearCapacity: Story = {
  args: { value: 92 },
  render: (args) => (
    <Meter {...args} className="w-64">
      <div className="flex items-center justify-between">
        <MeterLabel>Disk usage</MeterLabel>
        <MeterValue />
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  ),
};
