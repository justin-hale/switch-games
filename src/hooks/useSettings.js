import { useState } from 'react'

const KEYS = {
  githubToken: 'sg_github_token',
  gistId: 'sg_gist_id',
  workerUrl: 'sg_worker_url',
}

function load(key) {
  return localStorage.getItem(key) ?? ''
}

export function useSettings() {
  const [githubToken, setGithubTokenState] = useState(() => load(KEYS.githubToken))
  const [gistId, setGistIdState] = useState(() => load(KEYS.gistId))
  const [workerUrl, setWorkerUrlState] = useState(() => load(KEYS.workerUrl))

  function setGithubToken(v) { localStorage.setItem(KEYS.githubToken, v); setGithubTokenState(v) }
  function setGistId(v) { localStorage.setItem(KEYS.gistId, v); setGistIdState(v) }
  function setWorkerUrl(v) { localStorage.setItem(KEYS.workerUrl, v.replace(/\/$/, '')); setWorkerUrlState(v.replace(/\/$/, '')) }

  return {
    githubToken, setGithubToken,
    gistId, setGistId,
    workerUrl, setWorkerUrl,
    isConfigured: !!(githubToken && gistId),
  }
}
