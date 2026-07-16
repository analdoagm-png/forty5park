import { LibraryItemCard } from './App.jsx'

const meta = {
  component: LibraryItemCard,
  tags: ['ai-generated'],
  args: {
    item: {
      name: 'Core Income Portfolio',
      stats: ['5 Markets', '300 Units', '$50MM Rent/mo'],
    },
  },
}

export default meta

export const Portfolio = {}

export const BuyBox = {
  args: {
    item: {
      name: 'Northeast Buy Box',
      stats: ['NY, Newark', '$50MM bp IRR Y2 2%'],
    },
  },
}

export const Development = {
  args: {
    item: {
      name: '[development-name]',
      stats: ['NY, Newark', '2 units', '$50MM capital'],
    },
  },
}
