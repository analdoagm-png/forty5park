import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import brandIcon from './assets/brand-icon.svg'
import mapImage from './assets/map-dark.png'
import './App.css'

const primaryTabs = ['Markets', 'Library', 'Analysis']
const segmentTabs = ['MSA', 'Trends', 'Highlights']
const filters = ['All', 'Active', 'Restricted']
const trendPeriods = ['Current', 'Projected']
const libraryTabs = ['Portfolios', 'Buy Boxes', 'Developments']
const detailTabs = [
  { id: 'Portfolios', label: 'Portfolios' },
  { id: 'Buy Boxes', label: 'Buy Boxes' },
  { id: 'Developments', label: 'Developments' },
]
const libraryPortfolioItems = [
  'Portfolio name. csv',
  'Portfolio name. csv',
  'Portfolio name. csv',
  'Portfolio name. csv',
  'Portfolio name. csv',
]
const libraryContent = {
  Portfolios: {
    countLabel: 'Showing 5 portfolios',
    items: libraryPortfolioItems.map((name) => ({
      name,
      stats: ['5 Markets', '300 Units', '$50MM Rent/mo'],
    })),
  },
  'Buy Boxes': {
    countLabel: 'Showing 3 buy boxes',
    items: Array.from({ length: 3 }, () => ({
      name: '[buy-box-name]',
      stats: ['NY, Newark', '$50MM bp IRR Y2 2%'],
    })),
  },
  Developments: {
    countLabel: 'Showing 2 developments',
    items: Array.from({ length: 2 }, () => ({
      name: '[development-name]',
      stats: ['NY, Newark', '2 units', '$50MM capital'],
    })),
  },
}
const analysisSessions = [
  '[session-summary-title]',
  '[session-summary-title]',
  '[session-summary-title]',
  '[session-summary-title]',
]
const trendClusters = [
  { rank: 1, color: '#edd9a3' },
  { rank: 2, color: '#ff977f' },
  { rank: 3, color: '#ff5493' },
  { rank: 4, color: '#ff4ff9' },
  { rank: 5, color: '#8346ff' },
]
const highlightsMarkets = [
  'Erie County, NY: Rust Belt boom fuels entry-level demand',
  'Collin County, TX: Tech-campus-driven growth ushers in sustainable development',
  'Palm Beach County, FL: Luxury-led respite amid statewide slowdown',
  'Lane County, OR: University town’s post-pandemic growth',
  'Dallas County, IA: Heartland spillover sustains Midwestern momentum',
]
const highlightStories = [
  'Renter occupancy on the rise, led by sunbelt states',
  '30-year mortgage rates on downward trajectory, but remain high',
  'Multifamily is back: CBRE reports best absorption since 2000',
]

const markets = [
  {
    name: 'Michigan',
    city: 'Detroit',
    address: 'Detroit, MI (42.3314 N, 83.0458 W)',
    coordinates: [-83.0458, 42.3314],
  },
  {
    name: 'Georgia',
    city: 'Atlanta',
    address: 'Atlanta, GA (33.7490 N, 84.3880 W)',
    coordinates: [-84.388, 33.749],
  },
  {
    name: 'Texas',
    city: 'Houston',
    address: 'Houston, TX (29.7604 N, 95.3698 W)',
    coordinates: [-95.3698, 29.7604],
  },
  {
    name: 'Illinois',
    city: 'Chicago',
    address: 'Chicago, IL (41.8781 N, 87.6298 W)',
    coordinates: [-87.6298, 41.8781],
  },
  {
    name: 'California',
    city: 'Los Angeles',
    address: 'Los Angeles, CA (34.0522 N, 118.2437 W)',
    coordinates: [-118.2437, 34.0522],
  },
  {
    name: 'New York',
    city: 'New York City',
    address: 'New York City, NY (40.7128 N, 74.0060 W)',
    coordinates: [-74.006, 40.7128],
  },
  {
    name: 'Arizona',
    city: 'Phoenix',
    address: 'Phoenix, AZ (33.4484 N, 112.0740 W)',
    coordinates: [-112.074, 33.4484],
  },
]

const highlightedStateNames = markets.map((market) => market.name)

const usBounds = [
  [-127.5, 23.5],
  [-65, 50.5],
]

function getGeometryBounds(geometry) {
  let bounds = null

  const extendBounds = (coordinates) => {
    if (!Array.isArray(coordinates)) {
      return
    }

    if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
      if (!bounds) {
        bounds = new maplibregl.LngLatBounds(coordinates, coordinates)
        return
      }

      bounds.extend(coordinates)
      return
    }

    coordinates.forEach(extendBounds)
  }

  extendBounds(geometry?.coordinates)
  return bounds
}

const darkRasterStyle = {
  version: 8,
  sources: {
    cartoDark: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark',
      type: 'raster',
      source: 'cartoDark',
      paint: {
        'raster-saturation': -1,
        'raster-contrast': 0.08,
        'raster-brightness-min': 0.03,
        'raster-brightness-max': 0.82,
      },
    },
  ],
}

function SidepanelIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M17.5 2.5h-15c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h15c.69 0 1.25-.56 1.25-1.25V3.75c0-.69-.56-1.25-1.25-1.25ZM2.5 3.75h3.75v12.5H2.5V3.75Zm15 12.5h-10V3.75h10v12.5Z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        clipRule="evenodd"
        d="M12.71 13.59A6.22 6.22 0 0 1 8.75 15a6.25 6.25 0 1 1 4.84-2.29l3.73 3.72-.89.89-3.72-3.73ZM13.75 8.75a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m8 7.29 3.15-3.15.71.71L8.71 8l3.15 3.15-.71.71L8 8.71l-3.15 3.15-.71-.71L7.29 8 4.14 4.85l.71-.71L8 7.29Z" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m8 14-3.5-3.5.71-.7L8 12.58l2.8-2.79.7.71L8 14Zm0-12 3.5 3.5-.7.7L8 3.42 5.21 6.2l-.71-.7L8 2Z" />
    </svg>
  )
}

function MoreActionsIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 10a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 10Zm6.25 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM16.25 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        clipRule="evenodd"
        d="M13.4375 2.86612L17.4464 6.875L7.13388 17.1875H3.125V13.1786L13.4375 2.86612ZM11.5089 6.5625L13.75 8.80362L15.6786 6.875L13.4375 4.63389L11.5089 6.5625ZM12.8661 9.6875L10.625 7.44639L4.375 13.6964V15.9375H6.61612L12.8661 9.6875Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1.25a3.63 3.63 0 0 1 3.63 3.63c0 .78-.25 1.54-.73 2.17L6 10.48 3.22 7.2l-.11-.15a3.6 3.6 0 0 1-.74-2.17A3.63 3.63 0 0 1 6 1.25Z" />
      <circle cx="6" cy="4.88" r="1.13" />
    </svg>
  )
}

function PinFilledIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1.25a3.63 3.63 0 0 1 3.63 3.63c0 .78-.25 1.54-.73 2.17L6 10.48 3.22 7.2l-.11-.15a3.6 3.6 0 0 1-.74-2.17A3.63 3.63 0 0 1 6 1.25Zm0 2.38a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M7.13 1.5 10 4.38 7.13 7.25l-.71-.71L8.08 4.88H2v-1h6.08L6.42 2.21l.71-.71ZM2 6.63h1v2.12h6V5.88h1v3.37a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V6.63Z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m7.5 3-.71.71L10.08 7H3v1h7.08l-3.29 3.29.71.71 4.5-4.5L7.5 3Z" />
    </svg>
  )
}

function MapTargetIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M7.5 1h1v2.04A5.03 5.03 0 0 1 12.96 7.5H15v1h-2.04A5.03 5.03 0 0 1 8.5 12.96V15h-1v-2.04A5.03 5.03 0 0 1 3.04 8.5H1v-1h2.04A5.03 5.03 0 0 1 7.5 3.04V1Zm.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 7.5h10v1H3z" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M7.5 3h1v4.5H13v1H8.5V13h-1V8.5H3v-1h4.5V3Z" />
    </svg>
  )
}

function IconButton({ children, label, size = 'medium', onClick }) {
  return (
    <button className={`icon-button icon-button-${size}`} type="button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}

function TabList({ items, activeItem, onChange, variant }) {
  const handleTabClick = (event, item) => {
    onChange(item)

    if (event.detail > 0) {
      event.currentTarget.blur()
    }
  }

  return (
    <div className={`tab-list tab-list-${variant}`} role="tablist">
      {items.map((item) => (
        <button
          className={`tab-button ${item === activeItem ? 'is-active' : ''}`}
          key={item}
          onClick={(event) => handleTabClick(event, item)}
          type="button"
          role="tab"
          aria-selected={item === activeItem}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function UnitIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M10.5 0.75H6C5.80115 0.750199 5.6105 0.82928 5.46989 0.969889C5.32928 1.1105 5.2502 1.30115 5.25 1.5V5.25H1.5C1.30115 5.2502 1.1105 5.32928 0.969889 5.46989C0.82928 5.6105 0.750199 5.80115 0.75 6V11.25H11.25V1.5C11.2498 1.30115 11.1707 1.1105 11.0301 0.969889C10.8895 0.82928 10.6989 0.750199 10.5 0.75ZM3.375 10.5V7.875H4.875V10.5H3.375ZM10.5 10.5H5.625V7.5C5.625 7.40054 5.58549 7.30516 5.51516 7.23483C5.44484 7.16451 5.34946 7.125 5.25 7.125H3C2.90054 7.125 2.80516 7.16451 2.73484 7.23483C2.66451 7.30516 2.625 7.40054 2.625 7.5V10.5H1.5V6H6V1.5H10.5V10.5Z" />
      <path d="M6.75 3H7.5V3.75H6.75V3ZM9 3H9.75V3.75H9V3ZM6.75 5.25H7.5V6H6.75V5.25ZM9 5.25H9.75V6H9V5.25ZM6.75 7.5H7.5V8.25H6.75V7.5ZM9 7.5H9.75V8.25H9V7.5Z" />
    </svg>
  )
}

function InteractiveMap({ activeMarket, isPanelCollapsed, isDetailOpen }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const stateBoundsRef = useRef(new Map())
  const [stateBoundsReady, setStateBoundsReady] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    let isDisposed = false
    const stateBoundsByName = stateBoundsRef.current

    const map = new maplibregl.Map({
      attributionControl: false,
      bounds: usBounds,
      container: mapContainerRef.current,
      dragRotate: false,
      fitBoundsOptions: {
        padding: { top: 56, right: 40, bottom: 36, left: 336 },
      },
      maxBounds: usBounds,
      maxPitch: 0,
      maxZoom: 11,
      minZoom: 3,
      pitchWithRotate: false,
      style: darkRasterStyle,
    })

    map.on('load', async () => {
      const statesResponse = await fetch('/us-states.geojson')
      const statesData = await statesResponse.json()

      if (isDisposed) {
        return
      }

      statesData.features.forEach((feature) => {
        const stateName = feature.properties?.name
        const bounds = getGeometryBounds(feature.geometry)

        if (stateName && bounds) {
          stateBoundsByName.set(stateName, bounds)
        }
      })

      map.addSource('us-states', {
        type: 'geojson',
        data: statesData,
      })

      map.addLayer({
        id: 'highlighted-state-fill',
        type: 'fill',
        source: 'us-states',
        filter: ['in', ['get', 'name'], ['literal', highlightedStateNames]],
        paint: {
          'fill-color': '#7f56d9',
          'fill-opacity': 0.5,
        },
      })

      map.addLayer({
        id: 'highlighted-state-line',
        type: 'line',
        source: 'us-states',
        filter: ['in', ['get', 'name'], ['literal', highlightedStateNames]],
        paint: {
          'line-blur': 0.2,
          'line-color': '#7f56d9',
          'line-opacity': 1,
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1, 6, 1.35],
        },
      })

      setStateBoundsReady(true)
    })

    mapRef.current = map

    return () => {
      isDisposed = true
      map.remove()
      mapRef.current = null
      stateBoundsByName.clear()
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    mapRef.current.resize()

    if (!activeMarket) {
      mapRef.current.fitBounds(usBounds, {
        duration: 360,
        padding: {
          top: 56,
          right: isDetailOpen ? 352 : 40,
          bottom: 36,
          left: isPanelCollapsed ? 216 : 336,
        },
      })
    }
  }, [activeMarket, isDetailOpen, isPanelCollapsed])

  useEffect(() => {
    if (activeMarket && mapRef.current && stateBoundsReady) {
      const stateBounds = stateBoundsRef.current.get(activeMarket.name)

      if (!stateBounds) {
        return
      }

      mapRef.current.fitBounds(stateBounds, {
        duration: 700,
        maxZoom: 6.25,
        padding: {
          top: 96,
          right: isDetailOpen ? 384 : 96,
          bottom: 96,
          left: isPanelCollapsed ? 240 : 384,
        },
      })
    }
  }, [activeMarket, isDetailOpen, isPanelCollapsed, stateBoundsReady])

  const centerMapOnActiveMarket = () => {
    const map = mapRef.current

    if (!map || !activeMarket) {
      return
    }

    const stateBounds = stateBoundsRef.current.get(activeMarket.name)

    if (stateBounds) {
      map.fitBounds(stateBounds, {
        duration: 700,
        maxZoom: 6.25,
        padding: {
          top: 96,
          right: isDetailOpen ? 384 : 96,
          bottom: 96,
          left: isPanelCollapsed ? 240 : 384,
        },
      })
      return
    }

    map.flyTo({ center: activeMarket.coordinates, duration: 500, zoom: 5 })
  }

  const zoomMap = (direction) => {
    const map = mapRef.current

    if (!map) {
      return
    }

    if (direction === 'in') {
      map.zoomIn({ duration: 220 })
      return
    }

    map.zoomOut({ duration: 220 })
  }

  return (
    <div className={`interactive-map ${isDetailOpen ? 'has-detail-panel' : ''}`} aria-label="Interactive US market map">
      <img className="map-fallback" src={mapImage} alt="" aria-hidden="true" />
      <div className="map-canvas" ref={mapContainerRef} />
      <div className={`map-controls ${isDetailOpen ? 'has-detail-panel' : ''}`} aria-label="Map controls">
        <button
          className="map-control-button map-center-button"
          type="button"
          aria-label="Center map on active market"
          disabled={!activeMarket}
          onClick={centerMapOnActiveMarket}
        >
          <MapTargetIcon />
        </button>
        <div className="map-zoom-controls">
          <button className="map-control-button" type="button" aria-label="Zoom out" onClick={() => zoomMap('out')}>
            <ZoomOutIcon />
          </button>
          <button className="map-control-button" type="button" aria-label="Zoom in" onClick={() => zoomMap('in')}>
            <ZoomInIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function MarketCard({ market, isActive, onSelect }) {
  return (
    <article className={`market-card ${isActive ? 'is-active' : ''}`}>
      <h2>{market.name}</h2>
      <div className="market-address">
        <PinIcon />
        <p>{market.address}</p>
        {market.count ? <span className="market-tag">{market.count}</span> : null}
      </div>
      <button className="market-card-hit-area" type="button" onClick={() => onSelect(market)}>
        <span>Show {market.name} vector on map</span>
      </button>
    </article>
  )
}

function LibraryTabList({ activeTab, onChange }) {
  return (
    <div className="library-tabs" role="tablist" aria-label="Library categories">
      {libraryTabs.map((tab) => (
        <button
          className={`library-tab ${tab === activeTab ? 'is-active' : ''}`}
          key={tab}
          onClick={() => onChange(tab)}
          type="button"
          role="tab"
          aria-selected={tab === activeTab}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function LibraryItemCard({ item }) {
  return (
    <article className="library-card">
      <div className="library-card-header">
        <h2>{item.name}</h2>
        <button
          className="library-card-action"
          type="button"
          aria-label={`More actions for ${item.name}`}
        >
          <MoreActionsIcon />
        </button>
      </div>
      <div className="library-card-stats">
        {item.stats.map((stat, index) => (
          <span className="library-stat-fragment" key={`${stat}-${index}`}>
            {index > 0 ? <span aria-hidden="true" className="library-card-divider" /> : null}
            <span>{stat}</span>
          </span>
        ))}
      </div>
      <p>Last updated: Oct 25, 2023</p>
    </article>
  )
}

function PanelSearchEmptyIcon() {
  return (
    <svg className="panel-search-empty-symbol" viewBox="0 0 93 91" fill="none" aria-hidden="true">
      <path d="M62.6539 36.927C56.046 36.927 49.3356 36.6589 43.051 34.9084C36.8846 33.1972 31.223 29.8775 26.1763 26.0374C22.8645 23.5377 19.8681 21.5506 15.5706 21.8502C11.3753 22.0724 7.36328 23.6401 4.12893 26.3212C-1.33561 31.0997 -0.507647 39.9313 1.66871 46.1529C4.95689 55.497 14.9713 61.9945 23.4244 66.2368C33.2258 71.1336 43.9893 73.9881 54.7922 75.6125C64.2546 77.0476 76.406 78.0964 84.6067 71.9143C92.1451 66.2368 94.211 53.2733 92.3659 44.5127C91.9134 41.9269 90.5342 39.5945 88.4863 37.9521C83.1952 34.0804 75.302 36.6668 69.3565 36.8008C67.1486 36.8481 64.9091 36.927 62.6539 36.927Z" fill="#131313" />
      <path d="M46.4969 90.9494C62.4839 90.9494 75.444 90.1409 75.444 89.1436C75.444 88.1464 62.4839 87.3379 46.4969 87.3379C30.5099 87.3379 17.5498 88.1464 17.5498 89.1436C17.5498 90.1409 30.5099 90.9494 46.4969 90.9494Z" fill="#131313" />
      <path d="M45.2508 4.46328C36.8855 4.46328 28.8629 7.78638 22.9477 13.7015C17.0326 19.6167 13.7095 27.6393 13.7095 36.0046C13.7095 59.156 45.2508 80.8407 45.2508 80.8407C45.2508 80.8407 76.7922 59.4951 76.7922 36.0046C76.7922 27.6393 73.4691 19.6167 67.5539 13.7015C61.6388 7.78638 53.6161 4.46328 45.2508 4.46328ZM45.2508 47.8326C42.7931 47.8342 40.39 47.1074 38.345 45.744C36.3001 44.3806 34.705 42.4419 33.7612 40.1725C32.8174 37.9032 32.5673 35.4051 33.0424 32.9937C33.5175 30.5823 34.6965 28.3657 36.4306 26.624C38.1646 24.8822 40.3759 23.6934 42.7852 23.2076C45.1945 22.7218 47.6937 22.9609 49.9672 23.8946C52.2407 24.8283 54.1865 26.4148 55.5589 28.4537C56.9313 30.4925 57.6688 32.8924 57.6781 35.3502C57.6812 36.9845 57.3621 38.6034 56.7391 40.1143C56.1161 41.6253 55.2013 42.9985 54.0471 44.1557C52.8929 45.3128 51.522 46.231 50.0126 46.8579C48.5033 47.4848 46.8852 47.808 45.2508 47.809V47.8326Z" fill="#292929" stroke="#3F3F3F" strokeWidth="0.788534" strokeMiterlimit="10" />
      <path d="M26.0103 75.4C26.2192 75.4 26.389 75.569 26.3892 75.7779C26.3892 75.9869 26.2193 76.1568 26.0103 76.1568C25.8014 76.1566 25.6323 75.9868 25.6323 75.7779C25.6325 75.5691 25.8015 75.4001 26.0103 75.4Z" fill="#4A5059" stroke="#535353" strokeWidth="0.788534" />
      <path d="M70.437 80.4936V83.8922" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68.7339 82.1889H72.1325" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M61.3291 0.394531C61.538 0.394531 61.7078 0.56356 61.708 0.772461C61.708 0.981501 61.5381 1.15137 61.3291 1.15137C61.1202 1.1512 60.9512 0.981395 60.9512 0.772461C60.9513 0.563666 61.1203 0.394696 61.3291 0.394531Z" fill="#4A5059" stroke="#535353" strokeWidth="0.788534" />
      <path d="M11.8799 10.3064V13.705" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.1772 12.0013H13.5758" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M82.4697 19.532V22.9227" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80.7666 21.2273H84.1652" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49.4461 30.7686L41.064 39.1428" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M41.064 30.7686L49.4461 39.1428" stroke="#535353" strokeWidth="0.788534" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PanelSearchField({ label, value, onChange, onClose }) {
  return (
    <div className="panel-search-bar" role="search">
      <SearchIcon />
      <input
        aria-label={label}
        autoFocus
        placeholder="Search...."
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClose()
          }
        }}
      />
      <button className="panel-search-clear" type="button" aria-label={`Close ${label.toLowerCase()}`} onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  )
}

function PanelSearchEmptyState() {
  return (
    <div className="panel-search-empty">
      <PanelSearchEmptyIcon />
    </div>
  )
}

function LibraryPanelContent() {
  const [activeLibraryTab, setActiveLibraryTab] = useState(libraryTabs[0])
  const [isLibrarySearchOpen, setIsLibrarySearchOpen] = useState(false)
  const [librarySearchQuery, setLibrarySearchQuery] = useState('')
  const activeLibraryContent = libraryContent[activeLibraryTab]

  useEffect(() => {
    setIsLibrarySearchOpen(false)
    setLibrarySearchQuery('')
  }, [activeLibraryTab])

  const closeLibrarySearch = () => {
    setIsLibrarySearchOpen(false)
    setLibrarySearchQuery('')
  }

  return (
    <>
      <LibraryTabList activeTab={activeLibraryTab} onChange={setActiveLibraryTab} />

      <section className="library-list" aria-label={`Library ${activeLibraryTab}`}>
        {isLibrarySearchOpen ? (
          <>
            <PanelSearchField
              label="Search library"
              value={librarySearchQuery}
              onChange={setLibrarySearchQuery}
              onClose={closeLibrarySearch}
            />
            <PanelSearchEmptyState />
          </>
        ) : (
          <>
            <div className="library-list-header">
              <p>{activeLibraryContent.countLabel}</p>
              <div className="library-list-actions">
                <IconButton label="Search library" size="small" onClick={() => setIsLibrarySearchOpen(true)}>
                  <SearchIcon />
                </IconButton>
                <IconButton label="Sort library" size="small">
                  <SortIcon />
                </IconButton>
              </div>
            </div>

            <div className="library-cards">
              {activeLibraryContent.items.map((item, index) => (
                <LibraryItemCard key={`${activeLibraryTab}-${item.name}-${index}`} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

function AnalysisSessionCard({ title }) {
  return (
    <article className="analysis-session-card">
      <h2>{title}</h2>
      <button className="analysis-card-action" type="button" aria-label={`More actions for ${title}`}>
        <MoreActionsIcon />
      </button>
    </article>
  )
}

function AnalysisPanelContent() {
  return (
    <section className="analysis-list" aria-label="Analysis sessions">
      <button className="analysis-start-card" type="button">
        <span>Start a new session</span>
        <EditIcon />
      </button>

      <h2>Sessions</h2>

      <div className="analysis-sessions">
        {analysisSessions.map((session, index) => (
          <AnalysisSessionCard key={`${session}-${index}`} title={session} />
        ))}
      </div>
    </section>
  )
}

function TrendClusterCard({ cluster, period }) {
  const marketCount = period === 'Projected' ? '28 Markets' : '23 Markets'

  return (
    <article className="trend-cluster-card">
      <div className="trend-cluster-content">
        <div className="trend-ranking-badge" style={{ color: cluster.color }}>
          <span className="trend-ranking-dot" style={{ backgroundColor: cluster.color }} />
          <span>#{cluster.rank}</span>
        </div>
        <h2>High-Growth Builders</h2>
        <p className="trend-description-label">Description</p>
        <p className="trend-description">
          Strong population growth + heavy housing starts. Healthy cap rates across multifamily/single-family.
        </p>
      </div>
      <div className="trend-cluster-actions">
        <button className="trend-market-count" type="button">{marketCount}</button>
      </div>
    </article>
  )
}

function TrendsPanelContent() {
  const [activePeriod, setActivePeriod] = useState(trendPeriods[0])

  return (
    <section className="market-list trends-list" aria-label="Market trends">
      <div className="filter-toolbar">
        <TabList items={trendPeriods} activeItem={activePeriod} onChange={setActivePeriod} variant="filters" />
        <div className="filter-actions">
          <IconButton label="Search trends" size="small">
            <SearchIcon />
          </IconButton>
          <IconButton label="Sort trends" size="small">
            <SortIcon />
          </IconButton>
        </div>
      </div>

      <div className="trend-cards">
        {trendClusters.map((cluster) => (
          <TrendClusterCard key={cluster.rank} cluster={cluster} period={activePeriod} />
        ))}
      </div>
    </section>
  )
}

function HighlightsPanelContent() {
  return (
    <section className="market-list highlights-list" aria-label="Market highlights">
      <h2 className="highlights-title">June 2025 F5P Data Highlights</h2>
      <p className="highlights-summary">
        Sun Belt states led the recent surge in renter occupancy as home-price pressures and demographic shifts
        pushed more households into rentals.
      </p>
      <button className="highlights-share" type="button">
        <ShareIcon />
        <span>Share</span>
      </button>

      <h3 className="highlights-section-title">Top Markets</h3>
      <div className="highlights-market-list">
        {highlightsMarkets.map((market, index) => (
          <article className="highlight-market-card" key={market}>
            <span className="highlight-rank">#{index + 1}</span>
            <p>{market}</p>
            <span className="highlight-location">
              <PinFilledIcon />
              <span>11.0079941 / -74.8361482</span>
            </span>
          </article>
        ))}
      </div>

      <h3 className="highlights-section-title highlights-what-title">What’s in it</h3>
      <div className="highlights-story-list">
        {highlightStories.map((story) => (
          <button className="highlight-story" key={story} type="button">
            <ArrowRightIcon />
            <span>{story}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function MarketsPanelContent({ activeMarket, activeSegmentTab, activeFilter, onFilterChange, onSegmentChange, onSelectMarket }) {
  const [isMarketSearchOpen, setIsMarketSearchOpen] = useState(false)
  const [marketSearchQuery, setMarketSearchQuery] = useState('')

  useEffect(() => {
    setIsMarketSearchOpen(false)
    setMarketSearchQuery('')
  }, [activeSegmentTab])

  const closeMarketSearch = () => {
    setIsMarketSearchOpen(false)
    setMarketSearchQuery('')
  }

  return (
    <>
      <TabList
        items={segmentTabs}
        activeItem={activeSegmentTab}
        onChange={onSegmentChange}
        variant="segments"
      />

      {activeSegmentTab === 'Trends' ? <TrendsPanelContent /> : null}
      {activeSegmentTab === 'Highlights' ? <HighlightsPanelContent /> : null}
      {activeSegmentTab === 'MSA' ? <section className="market-list" aria-label="Market list">
        {isMarketSearchOpen ? (
          <>
            <PanelSearchField
              label="Search list"
              value={marketSearchQuery}
              onChange={setMarketSearchQuery}
              onClose={closeMarketSearch}
            />
            <PanelSearchEmptyState />
          </>
        ) : (
          <>
            <div className="filter-toolbar">
              <TabList items={filters} activeItem={activeFilter} onChange={onFilterChange} variant="filters" />
              <div className="filter-actions">
                <IconButton label="Search list" size="small" onClick={() => setIsMarketSearchOpen(true)}>
                  <SearchIcon />
                </IconButton>
                <IconButton label="Sort markets" size="small">
                  <SortIcon />
                </IconButton>
              </div>
            </div>

            <div className="market-cards">
              {markets.map((market) => (
                <MarketCard
                  isActive={market.name === activeMarket?.name}
                  key={market.name}
                  market={market}
                  onSelect={onSelectMarket}
                />
              ))}
            </div>
          </>
        )}
      </section> : null}
    </>
  )
}

function DetailTabList({ activeTab, onChange }) {
  return (
    <div className="detail-tabs" role="tablist" aria-label="Market detail categories">
      {detailTabs.map((tab) => (
        <button
          className={`detail-tab ${tab.id === activeTab ? 'is-active' : ''}`}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTab}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function MarketDetailPanel({ market }) {
  const [activeTab, setActiveTab] = useState(detailTabs[0].id)
  const activeItemContent = libraryContent[activeTab]

  if (!market) {
    return null
  }

  return (
    <aside className="market-detail-panel" aria-label={`${market.name} market details`}>
      <header className="market-detail-header">
        <h1>{market.name}</h1>
        <button className="detail-pill-button" type="button">
          <UnitIcon />
          <span>View Listings</span>
        </button>
      </header>

      <div className="market-detail-content">
        <section className="detail-section" aria-labelledby="outlook-heading">
          <h2 id="outlook-heading">Outlook</h2>
          <article className="outlook-card">
            <div className="ranking-badge">
              <span className="ranking-dot" />
              <span>#1</span>
            </div>
            <h3>High-Growth Builders</h3>
            <p className="detail-label">Description</p>
            <p className="outlook-description">
              Strong population growth + heavy housing starts. Healthy cap rates across
              multifamily/single-family.
            </p>
            <button className="detail-pill-button detail-pill-muted" type="button">
              23 Markets
            </button>
          </article>
        </section>

        <section className="detail-section" aria-labelledby="items-heading">
          <h2 id="items-heading">Your Items</h2>
          <DetailTabList activeTab={activeTab} onChange={setActiveTab} />

          <div className="library-cards" aria-label={`Your ${activeTab}`}>
            {activeItemContent.items.map((item, index) => (
              <LibraryItemCard key={`${activeTab}-${item.name}-${index}`} item={item} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}

function MarketsPanel({ activeMarket, isCollapsed, onSelectMarket, onToggleCollapsed }) {
  const [activePrimaryTab, setActivePrimaryTab] = useState('Markets')
  const [activeSegmentTab, setActiveSegmentTab] = useState('MSA')
  const [activeFilter, setActiveFilter] = useState('All')

  return (
    <aside
      className={`markets-panel ${isCollapsed ? 'is-collapsed' : ''}`}
      aria-label="Markets map controls"
    >
      <header className="panel-header">
        <div className="panel-header-actions">
          <img className="brand-mark" src={brandIcon} alt="" />
          <button
            className="panel-toggle"
            type="button"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand sidepanel' : 'Collapse sidepanel'}
            onClick={onToggleCollapsed}
          >
            <SidepanelIcon />
          </button>
        </div>

        <div className="panel-account-actions">
          <IconButton label="Search markets">
            <SearchIcon />
          </IconButton>
          <div className="avatar" aria-label="Current user">
            BB
          </div>
        </div>
      </header>

      <div className="panel-body" aria-hidden={isCollapsed}>
        <TabList
          items={primaryTabs}
          activeItem={activePrimaryTab}
          onChange={setActivePrimaryTab}
          variant="primary"
        />
        {activePrimaryTab === 'Library' ? (
          <LibraryPanelContent />
        ) : activePrimaryTab === 'Analysis' ? (
          <AnalysisPanelContent />
        ) : (
          <MarketsPanelContent
            activeFilter={activeFilter}
            activeMarket={activeMarket}
            activeSegmentTab={activeSegmentTab}
            onFilterChange={setActiveFilter}
            onSegmentChange={setActiveSegmentTab}
            onSelectMarket={onSelectMarket}
          />
        )}
      </div>
    </aside>
  )
}

function App() {
  const [activeMarket, setActiveMarket] = useState(null)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  return (
    <main className="dashboard-shell" aria-label="Forty5Park market dashboard">
      <InteractiveMap
        activeMarket={activeMarket}
        isDetailOpen={Boolean(activeMarket)}
        isPanelCollapsed={isPanelCollapsed}
      />
      <MarketsPanel
        activeMarket={activeMarket}
        isCollapsed={isPanelCollapsed}
        onSelectMarket={setActiveMarket}
        onToggleCollapsed={() => setIsPanelCollapsed((isCollapsed) => !isCollapsed)}
      />
      <MarketDetailPanel market={activeMarket} />
    </main>
  )
}

export default App
