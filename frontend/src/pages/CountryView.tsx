import { Link, useParams } from 'react-router-dom'
import { countryNotes } from '../data/coffees'
import { useCoffeeStore } from '../store/useCoffeeStore'
import { CountryId } from '../types/coffee'

export function CountryView() {
  const params = useParams<{ countryId: CountryId }>()
  const countryId: CountryId = params.countryId === 'spain' ? 'spain' : 'italy'
  const nodes = useCoffeeStore((state) => state.nodes)

  const coffees = nodes.filter((node) => node.country === countryId)

  return (
    <section className="space-y-4">
      <header className="panel rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wide text-coffee-200">Country View</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-white">
          {countryId[0].toUpperCase() + countryId.slice(1)}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">{countryNotes[countryId]}</p>
        <div className="mt-4 flex gap-2">
          <Link
            to="/country/italy"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              countryId === 'italy'
                ? 'bg-coffee-400 text-night-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Italy
          </Link>
          <Link
            to="/country/spain"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              countryId === 'spain'
                ? 'bg-coffee-400 text-night-950'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Spain
          </Link>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {coffees.map((coffee) => (
          <article key={coffee.id} className="panel rounded-xl p-4">
            <h3 className="font-display text-lg text-white">{coffee.name}</h3>
            <p className="mt-2 text-sm text-slate-300">{coffee.preparation}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-2 py-1">Milk {coffee.milk}%</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Water {coffee.water}%</span>
              <span className="rounded-full bg-white/10 px-2 py-1">{coffee.volume_ml} ml</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Strength {coffee.strength}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
