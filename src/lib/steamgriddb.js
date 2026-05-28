const BASE = 'https://www.steamgriddb.com/api/v2'

function headers(token) {
  return { Authorization: `Bearer ${token}` }
}

export async function searchGames(token, query) {
  const res = await fetch(`${BASE}/search/autocomplete/${encodeURIComponent(query)}`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(`SteamGridDB search failed: ${res.status}`)
  const data = await res.json()
  return data.data ?? []
}

// Fetch grid cover images (portrait "grid" format — 600x900) for a game id
export async function fetchCovers(token, gameId) {
  const res = await fetch(
    `${BASE}/grids/game/${gameId}?dimensions=600x900&limit=12`,
    { headers: headers(token) }
  )
  if (!res.ok) throw new Error(`SteamGridDB covers failed: ${res.status}`)
  const data = await res.json()
  return data.data ?? []
}
