import type { Preview } from '@storybook/nextjs-vite'
import * as React from 'react'
import { TooltipProvider } from '../src/components/ui/tooltip'
import '../src/app/globals.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Active brand token set',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: ['sc1m', 'ledger'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    brand: 'sc1m',
  },
  decorators: [
    (Story, { globals }) => {
      // .dark and data-brand live on <html> so portalled popups (in
      // <body>) also pick up theme and brand
      document.documentElement.classList.toggle('dark', globals.theme === 'dark')
      if (globals.brand && globals.brand !== 'sc1m') {
        document.documentElement.dataset.brand = globals.brand
      } else {
        delete document.documentElement.dataset.brand
      }
      return (
        <TooltipProvider>
          <div className="root bg-bg p-8 text-fg">
            <Story />
          </div>
        </TooltipProvider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
