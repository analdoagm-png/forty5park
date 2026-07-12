import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="intro">
        <div className="eyebrow">Forty5Park</div>
        <h1>React project ready.</h1>
        <p>
          The app is scaffolded with Vite and waiting for the next layer of
          product details.
        </p>
      </section>

      <section className="status-panel" aria-label="Project status">
        <div>
          <span>Stack</span>
          <strong>React + Vite</strong>
        </div>
        <div>
          <span>Entry point</span>
          <strong>src/App.jsx</strong>
        </div>
        <div>
          <span>Dev command</span>
          <strong>npm run dev</strong>
        </div>
      </section>
    </main>
  )
}

export default App
