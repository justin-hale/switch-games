const GITHUB_API = 'https://api.github.com'
const FILENAME = 'switch-games.json'

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

export async function fetchGist(token, gistId) {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(`Failed to fetch gist: ${res.status}`)
  const data = await res.json()
  const content = data.files[FILENAME]?.content
  if (!content) throw new Error('Gist file not found')
  return JSON.parse(content)
}

export async function saveGist(token, gistId, payload) {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({
      files: {
        [FILENAME]: { content: JSON.stringify(payload, null, 2) },
      },
    }),
  })
  if (!res.ok) throw new Error(`Failed to save gist: ${res.status}`)
  return res.json()
}

export async function createGist(token) {
  const initial = { games: [] }
  const res = await fetch(`${GITHUB_API}/gists`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      description: 'Switch Games Collection',
      public: false,
      files: {
        [FILENAME]: { content: JSON.stringify(initial, null, 2) },
      },
    }),
  })
  if (!res.ok) throw new Error(`Failed to create gist: ${res.status}`)
  const data = await res.json()
  return data.id
}
