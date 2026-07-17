import { PortfolioDetailPanel } from './App.jsx'

const meta = {
  component: PortfolioDetailPanel,
  tags: ['ai-generated'],
  decorators: [(Story) => <div style={{ minHeight: 900, position: 'relative', background: '#131313' }}><Story /></div>],
  args: {
    portfolio: {
      id: 'sunbelt-growth',
      name: 'Sunbelt Growth Collection',
      stats: ['5 Markets', '1,234 Units', '$7.8MM Rent/mo'],
      kpis: { properties: 835, units: 1234, singleFamily: 234 },
      markets: [
        {
          name: 'Miami-Fort Lauderdale-West Palm Beach, FL',
          properties: 300,
          singleFamily: 110,
          tags: ['SFR 48%', 'BTR 32%', 'MFR 20%'],
        },
      ],
    },
  },
}

export default meta

export const Default = {}

export const NortheastValueAdd = {
  args: {
    portfolio: {
      id: 'northeast-value-add',
      name: 'Northeast Value-Add',
      stats: ['3 Markets', '288 Units', '$2.1MM Rent/mo'],
      kpis: { properties: 193, units: 288, singleFamily: 91 },
      markets: [
        {
          name: 'New York-Newark-Jersey City, NY-NJ-PA',
          properties: 75,
          singleFamily: 22,
          tags: ['SFR 20%', 'BTR 12%', 'MFR 68%'],
        },
      ],
    },
  },
}
