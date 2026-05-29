export async function searchGames(workerUrl, query) {
  const res = await fetch(`${workerUrl}/search/autocomplete/${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  const data = await res.json()
  return data.data ?? []
}

export async function fetchCovers(workerUrl, gameId) {
  const res = await fetch(`${workerUrl}/grids/game/${gameId}?dimensions=600x900&limit=12`)
  if (!res.ok) throw new Error(`Cover fetch failed: ${res.status}`)
  const data = await res.json()
  return data.data ?? []
}
