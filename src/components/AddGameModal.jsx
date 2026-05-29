import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { searchGames, fetchCovers } from '../lib/steamgriddb'

export default function AddGameModal({ workerUrl, onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [covers, setCovers] = useState([])
  const [selectedCover, setSelectedCover] = useState(null)
  const [manualUrl, setManualUrl] = useState('')
  const [step, setStep] = useState('search') // search | covers | manual
  const [searching, setSearching] = useState(false)
  const [loadingCovers, setLoadingCovers] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    if (!workerUrl) {
      setError('No Worker URL set. Add your Cloudflare Worker URL in Settings, or use manual URL entry below.')
      return
    }
    setSearching(true)
    setError(null)
    try {
      const results = await searchGames(workerUrl, query)
      setSearchResults(results)
    } catch (e) {
      setError(e.message)
    } finally {
      setSearching(false)
    }
  }

  async function handleSelectGame(game) {
    setSelectedGame(game)
    setLoadingCovers(true)
    setError(null)
    setStep('covers')
    try {
      const c = await fetchCovers(workerUrl, game.id)
      setCovers(c)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingCovers(false)
    }
  }

  function handleAdd() {
    const coverUrl = step === 'manual' ? manualUrl : selectedCover?.url
    const title = selectedGame?.name ?? query.trim()
    if (!title) return
    onAdd({ id: uuidv4(), title, coverUrl: coverUrl ?? '', holderId: null })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-white">Add Game</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Step: Search */}
          {step === 'search' && (
            <>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search for a game…"
                  className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  {searching ? 'Searching…' : 'Search'}
                </button>
              </form>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {searchResults.length > 0 && (
                <ul className="space-y-1">
                  {searchResults.map(g => (
                    <li key={g.id}>
                      <button
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-700 text-sm text-zinc-200 transition-colors"
                        onClick={() => handleSelectGame(g)}
                      >
                        {g.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border-t border-zinc-700 pt-4">
                <button
                  className="text-sm text-zinc-400 hover:text-white underline"
                  onClick={() => setStep('manual')}
                >
                  Enter cover URL manually instead
                </button>
              </div>
            </>
          )}

          {/* Step: Choose cover */}
          {step === 'covers' && (
            <>
              <div className="flex items-center gap-3">
                <button onClick={() => { setStep('search'); setSelectedGame(null); setCovers([]) }} className="text-zinc-400 hover:text-white text-sm">← Back</button>
                <span className="text-white font-medium">{selectedGame?.name}</span>
              </div>

              {loadingCovers && <p className="text-zinc-400 text-sm">Loading covers…</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}

              {!loadingCovers && covers.length === 0 && !error && (
                <p className="text-zinc-400 text-sm">No covers found.</p>
              )}

              <div className="grid grid-cols-3 gap-2">
                {covers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCover(c)}
                    className={`rounded-lg overflow-hidden ring-2 transition-all ${
                      selectedCover?.id === c.id ? 'ring-blue-500' : 'ring-transparent hover:ring-zinc-500'
                    }`}
                  >
                    <img src={c.url} alt="cover" className="w-full aspect-[2/3] object-cover" loading="lazy" />
                  </button>
                ))}
              </div>

              <button
                className="text-sm text-zinc-400 hover:text-white underline"
                onClick={() => setStep('manual')}
              >
                Use a custom URL instead
              </button>
            </>
          )}

          {/* Step: Manual URL */}
          {step === 'manual' && (
            <>
              <div className="flex items-center gap-3">
                <button onClick={() => setStep('search')} className="text-zinc-400 hover:text-white text-sm">← Back</button>
                <span className="text-zinc-300 text-sm">Manual cover URL</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Game title</label>
                  <input
                    type="text"
                    value={selectedGame?.name ?? query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Game title"
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Cover image URL</label>
                  <input
                    type="url"
                    value={manualUrl}
                    onChange={e => setManualUrl(e.target.value)}
                    placeholder="https://…"
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {manualUrl && (
                  <img src={manualUrl} alt="preview" className="w-32 rounded-lg" />
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-zinc-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={step === 'covers' && !selectedCover && step !== 'manual'}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Add Game
          </button>
        </div>
      </div>
    </div>
  )
}
