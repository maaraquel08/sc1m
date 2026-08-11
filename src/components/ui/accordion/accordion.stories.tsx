import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from './accordion';

const meta = {
  component: Accordion,
  tags: ['ai-generated'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: 'tokens',
    title: 'What are design tokens?',
    body: 'Named values for color, type, spacing, and motion that keep the system consistent.',
  },
  {
    value: 'primitives',
    title: 'Why Base UI?',
    body: 'Unstyled, accessible primitives that leave every visual decision to the token layer.',
  },
  {
    value: 'theming',
    title: 'How does dark mode work?',
    body: 'Semantic tokens flip under the .dark class, so components never change.',
  },
];

export const Default: Story = {
  render: () => (
    <Accordion className="w-96">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionPanel>{item.body}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /why base ui/i }),
    );
    await expect(
      canvas.getByText(/unstyled, accessible primitives/i),
    ).toBeVisible();
  },
};
