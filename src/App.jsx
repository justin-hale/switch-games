import { useState } from 'react'
import { useSettings } from './hooks/useSettings'
import { useGames } from './hooks/useGames'
import GameCard from './components/GameCard'
import AddGameModal from './components/AddGameModal'
import SettingsModal from './components/SettingsModal'

export default function App() {
  const settings = useSettings()
  const { games, loading, error, addGame, removeGame, setHolder } = useGames(
    settings.githubToken,
    settings.gistId
  )
  const [showAdd, setShowAdd] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <h1 className="text-lg font-bold tracking-tight">Switch Games</h1>
          {games.length > 0 && (
            <span className="text-xs text-zinc-500 ml-1">({games.length})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            + Add Game
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="p-4">
        {/* Not configured yet */}
        {!settings.isConfigured && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-4xl">🔧</p>
            <h2 className="text-xl font-semibold text-zinc-200">First-time setup</h2>
            <p className="text-zinc-400 max-w-sm text-sm">
              Configure a GitHub PAT and Gist ID to store your collection. You can also add a
              SteamGridDB API key for automatic cover art search.
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Open Settings
            </button>
          </div>
        )}

        {/* Loading */}
        {settings.isConfigured && loading && (
          <div className="flex items-center justify-center py-24 text-zinc-500 text-sm">
            Loading your collection…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Empty state */}
        {settings.isConfigured && !loading && games.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-4xl">🕹️</p>
            <p className="text-zinc-400 text-sm">No games yet. Hit <strong className="text-zinc-300">+ Add Game</strong> to start your collection.</p>
          </div>
        )}

        {/* Game Grid */}
        {games.length > 0 && (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {games.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onSetHolder={setHolder}
                onRemove={removeGame}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAdd && (
        <AddGameModal
          steamToken={settings.steamToken}
          onAdd={addGame}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
