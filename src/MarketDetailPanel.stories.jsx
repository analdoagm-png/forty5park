import { MarketDetailPanel } from './App.jsx'

const meta = {
  component: MarketDetailPanel,
  tags: ['ai-generated'],
  decorators: [(Story) => <div style={{ width: 320, minHeight: 868, position: 'relative' }}><Story /></div>],
  args: {
    market: {
      name: 'Michigan',
      city: 'Detroit',
      address: 'Detroit, MI (42.3314 N, 83.0458 W)',
      coordinates: [-83.0458, 42.3314],
    },
  },
}

export default meta

export const Default = {}
