import { useState } from 'react'

const KEYS = {
  githubToken: 'sg_github_token',
  gistId: 'sg_gist_id',
  steamToken: 'sg_steam_token',
}

function load(key) {
  return localStorage.getItem(key) ?? ''
}

export function useSettings() {
  const [githubToken, setGithubTokenState] = useState(() => load(KEYS.githubToken))
  const [gistId, setGistIdState] = useState(() => load(KEYS.gistId))
  const [steamToken, setSteamTokenState] = useState(() => load(KEYS.steamToken))

  function setGithubToken(v) {
    localStorage.setItem(KEYS.githubToken, v)
    setGithubTokenState(v)
  }
  function setGistId(v) {
    localStorage.setItem(KEYS.gistId, v)
    setGistIdState(v)
  }
  function setSteamToken(v) {
    localStorage.setItem(KEYS.steamToken, v)
    setSteamTokenState(v)
  }

  const isConfigured = !!(githubToken && gistId)

  return {
    githubToken, setGithubToken,
    gistId, setGistId,
    steamToken, setSteamToken,
    isConfigured,
  }
}
