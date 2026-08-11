import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "./autocomplete";

const meta = {
  component: Autocomplete,
  tags: ["ai-generated"],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruits = ["Apple", "Banana", "Cherry", "Date", "Fig", "Grape"];

export const Default: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput placeholder="Search fruits…" />
      <AutocompleteContent>
        <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
        <AutocompleteList>
          {(fruit: string) => (
            <AutocompleteItem key={fruit} value={fruit}>
              {fruit}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};
