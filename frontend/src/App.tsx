import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CompareView } from './components/CompareView'
import { CountryView } from './pages/CountryView'
import { ExplorerView } from './pages/ExplorerView'

function Navigation() {
  const location = useLocation()
  const linkClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-coffee-400 text-night-950'
        : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
    }`

  return (
    <header className="border-b border-white/10 bg-night-900/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-white">
            Coffee Explorer
          </h1>
          <p className="text-xs text-slate-400">Italy + Spain Coffee Graph Atlas</p>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClass(location.pathname === '/')}>
            Explorer
          </Link>
          <Link to="/compare" className={linkClass(location.pathname === '/compare')}>
            Compare
          </Link>
          <Link
            to="/country/italy"
            className={linkClass(location.pathname.startsWith('/country'))}
          >
            Country
          </Link>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="relative min-h-screen bg-night-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-coffee-400/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Routes>
            <Route path="/" element={<ExplorerView />} />
            <Route path="/compare" element={<CompareView />} />
            <Route path="/country/:countryId" element={<CountryView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
