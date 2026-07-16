import { IconButton, SearchIcon } from './App.jsx'

const meta = {
  component: IconButton,
  tags: ['ai-generated'],
  args: {
    label: 'Search markets',
    children: <SearchIcon />,
  },
}

export default meta

export const Medium = {}

export const Small = {
  args: { size: 'small', label: 'Search list' },
}
