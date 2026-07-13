import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import brandIcon from './assets/brand-icon.svg'
import mapImage from './assets/map-dark.png'
import './App.css'

const primaryTabs = ['Markets', 'Library', 'Analysis']
const segmentTabs = ['MSA', 'Trends', 'Highlights']
const filters = ['All', 'Active', 'Restricted']
const detailTabs = ['Portfolios (3)', 'Buy Boxes', 'Developments (5)']
const portfolioItems = ['Core Income', 'Growth Watchlist', 'Value Add Pipeline']

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

function SortIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m8 14-3.5-3.5.71-.7L8 12.58l2.8-2.79.7.71L8 14Zm0-12 3.5 3.5-.7.7L8 3.42 5.21 6.2l-.71-.7L8 2Z" />
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

function IconButton({ children, label, size = 'medium' }) {
  return (
    <button className={`icon-button icon-button-${size}`} type="button" aria-label={label}>
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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M3.25 1.5v1m5.5-1v1m-6.5 1.25h7.5m-7.5-1.25h7.5c.41 0 .75.34.75.75v6c0 .41-.34.75-.75.75h-7.5a.75.75 0 0 1-.75-.75v-6c0-.41.34-.75.75-.75Z"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m6 3 5 5-5 5-.82-.82L9.36 8 5.18 3.82 6 3Z" />
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

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: 'Forty5Park',
      }),
      'bottom-right',
    )

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

  return (
    <div className="interactive-map" aria-label="Interactive US market map">
      <img className="map-fallback" src={mapImage} alt="" aria-hidden="true" />
      <div className="map-canvas" ref={mapContainerRef} />
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

function DetailTabList({ activeTab, onChange }) {
  return (
    <div className="detail-tabs" role="tablist" aria-label="Market detail categories">
      {detailTabs.map((tab) => (
        <button
          className={`detail-tab ${tab === activeTab ? 'is-active' : ''}`}
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

function MarketDetailPanel({ market }) {
  const [activeTab, setActiveTab] = useState(detailTabs[0])

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

          <div className="portfolio-list">
            {portfolioItems.map((item) => (
              <button className="portfolio-item" key={item} type="button">
                <span className="portfolio-info">
                  <strong>{item}</strong>
                  <span>
                    <CalendarIcon />
                    Last Updated: Aug 12, 2025
                  </span>
                </span>
                <ChevronRightIcon />
              </button>
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
        <TabList
          items={segmentTabs}
          activeItem={activeSegmentTab}
          onChange={setActiveSegmentTab}
          variant="segments"
        />

        <section className="market-list" aria-label="Market list">
          <div className="filter-toolbar">
            <TabList
              items={filters}
              activeItem={activeFilter}
              onChange={setActiveFilter}
              variant="filters"
            />
            <div className="filter-actions">
              <IconButton label="Search list" size="small">
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
        </section>
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
