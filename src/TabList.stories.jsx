import { TabList } from './App.jsx'

const meta = {
  component: TabList,
  tags: ['ai-generated'],
  args: {
    items: ['Markets', 'Library', 'Analysis'],
    activeItem: 'Markets',
    onChange: () => {},
    variant: 'primary',
  },
}

export default meta

export const Primary = {}

export const Filters = {
  args: {
    items: ['All', 'Active', 'Restricted'],
    activeItem: 'Active',
    variant: 'filters',
  },
}
