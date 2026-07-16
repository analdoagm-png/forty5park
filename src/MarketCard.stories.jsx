import { expect } from 'storybook/test'
import { MarketCard } from './App.jsx'

const market = {
  name: 'Michigan',
  address: 'Detroit, MI (42.3314 N, 83.0458 W)',
}

const meta = {
  component: MarketCard,
  tags: ['ai-generated'],
  args: {
    market,
    isActive: false,
    onSelect: () => {},
  },
}

export default meta

export const Default = {}

export const Selected = {
  args: { isActive: true },
}

export const CssCheck = {
  play: async ({ canvas }) => {
    const card = canvas.getByText('Michigan').closest('.market-card')
    await expect(getComputedStyle(card).backgroundColor).toBe('rgb(41, 41, 41)')
  },
}
