import { useState, useEffect, useCallback } from 'react'
import { fetchGist, saveGist } from '../lib/gist'

export function useGames(githubToken, gistId) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!githubToken || !gistId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGist(githubToken, gistId)
      setGames(data.games ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [githubToken, gistId])

  useEffect(() => { load() }, [load])

  async function persist(nextGames) {
    setGames(nextGames)
    await saveGist(githubToken, gistId, { games: nextGames })
  }

  async function addGame(game) {
    await persist([...games, game])
  }

  async function removeGame(id) {
    await persist(games.filter(g => g.id !== id))
  }

  async function setHolder(gameId, holderId) {
    await persist(
      games.map(g => g.id === gameId ? { ...g, holderId: holderId ?? null } : g)
    )
  }

  function sortKey(title) {
    return title.replace(/^the\s+/i, '')
  }

  const sorted = [...games].sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)))

  return { games: sorted, loading, error, reload: load, addGame, removeGame, setHolder }
}
