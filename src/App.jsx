import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import brandIcon from './assets/brand-icon.svg'
import mapImage from './assets/map-dark.png'
import './App.css'

const primaryTabs = ['Markets', 'Library', 'Analysis']
const segmentTabs = ['MSA', 'Trends', 'Highlights']
const filters = ['All', 'Active', 'Restricted']

const markets = [
  {
    name: 'Michigan',
    address: '3600 W Sovereign Path, Lecanto, FL (28.8419 N, 82.4811 W)',
    coordinates: [-82.4811, 28.8419],
  },
  {
    name: 'Georgia',
    address: '201 W Main St, Tavares, FL (28.8058 N, 81.7342 W)',
    coordinates: [-81.7342, 28.8058],
    count: 4,
  },
  {
    name: 'Texas',
    address: '255 N Kentucky Ave, Lakeland, FL (28.0406 N, 81.9499 W)',
    coordinates: [-81.9499, 28.0406],
  },
  {
    name: 'Illinois',
    address: '2295 Victoria Ave, Fort Myers, FL (26.6406 N, 81.8723 W)',
    coordinates: [-81.8723, 26.6406],
  },
  {
    name: 'California',
    address: '1301 Riverplace Blvd, Jacksonville, FL (30.3219 N, 81.6557 W)',
    coordinates: [-81.6557, 30.3219],
  },
  {
    name: 'New York',
    address: '444 Biscayne Blvd, Miami, FL (25.7743 N, 80.1937 W)',
    coordinates: [-80.1937, 25.7743],
  },
  {
    name: 'Arizona',
    address: '110 SE 25th Ave, Ocala, FL (29.1872 N, 82.1406 W)',
    coordinates: [-82.1406, 29.1872],
  },
]

const usBounds = [
  [-127.5, 23.5],
  [-65, 50.5],
]

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

function InteractiveMap({ activeMarket, isPanelCollapsed, onSelectMarket }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

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

    markets.forEach((market) => {
      const markerElement = document.createElement('button')
      markerElement.className = 'map-marker'
      markerElement.type = 'button'
      markerElement.setAttribute('aria-label', `Show ${market.name}`)

      markerElement.addEventListener('click', () => {
        onSelectMarket(market)
      })

      const marker = new maplibregl.Marker({
        anchor: 'center',
        element: markerElement,
      })
        .setLngLat(market.coordinates)
        .addTo(map)

      markersRef.current.push({ marketName: market.name, marker, markerElement })
    })

    mapRef.current = map

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [onSelectMarket])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    mapRef.current.resize()

    if (!activeMarket) {
      mapRef.current.fitBounds(usBounds, {
        duration: 360,
        padding: { top: 56, right: 40, bottom: 36, left: isPanelCollapsed ? 216 : 336 },
      })
    }
  }, [activeMarket, isPanelCollapsed])

  useEffect(() => {
    markersRef.current.forEach(({ marketName, markerElement }) => {
      markerElement.classList.toggle('is-active', marketName === activeMarket?.name)
    })

    if (activeMarket && mapRef.current) {
      mapRef.current.easeTo({
        center: activeMarket.coordinates,
        duration: 700,
        essential: true,
        offset: [isPanelCollapsed ? 100 : 160, 0],
        zoom: 5.9,
      })
    }
  }, [activeMarket, isPanelCollapsed])

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
        <span>Show {market.name} on map</span>
      </button>
    </article>
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
        isPanelCollapsed={isPanelCollapsed}
        onSelectMarket={setActiveMarket}
      />
      <MarketsPanel
        activeMarket={activeMarket}
        isCollapsed={isPanelCollapsed}
        onSelectMarket={setActiveMarket}
        onToggleCollapsed={() => setIsPanelCollapsed((isCollapsed) => !isCollapsed)}
      />
    </main>
  )
}

export default App
