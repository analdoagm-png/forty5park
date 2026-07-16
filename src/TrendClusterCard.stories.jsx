import { TrendClusterCard } from './App.jsx'

const meta = {
  component: TrendClusterCard,
  tags: ['ai-generated'],
  args: {
    cluster: { rank: 1, color: '#edd9a3' },
    period: 'Current',
  },
}

export default meta

export const Current = {}

export const Projected = {
  args: { period: 'Projected' },
}
