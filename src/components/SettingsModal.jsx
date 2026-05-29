import { useState } from 'react'
import { createGist } from '../lib/gist'

export default function SettingsModal({ settings, onClose }) {
  const { githubToken, setGithubToken, gistId, setGistId, workerUrl, setWorkerUrl } = settings
  const [localGithub, setLocalGithub] = useState(githubToken)
  const [localGist, setLocalGist] = useState(gistId)
  const [localWorker, setLocalWorker] = useState(workerUrl)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)

  async function handleCreateGist() {
    if (!localGithub) return
    setCreating(true)
    setCreateError(null)
    try {
      const id = await createGist(localGithub)
      setLocalGist(id)
    } catch (e) {
      setCreateError(e.message)
    } finally {
      setCreating(false)
    }
  }

  function handleSave() {
    setGithubToken(localGithub)
    setGistId(localGist)
    setWorkerUrl(localWorker)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* GitHub */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">GitHub</h3>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">
                Personal Access Token
                <span className="ml-1 text-zinc-600">(classic token with <code className="bg-zinc-800 px-1 rounded">gist</code> scope)</span>
              </label>
              <input
                type="password"
                value={localGithub}
                onChange={e => setLocalGithub(e.target.value)}
                placeholder="ghp_…"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Gist ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localGist}
                  onChange={e => setLocalGist(e.target.value)}
                  placeholder="Paste existing Gist ID, or create one →"
                  className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleCreateGist}
                  disabled={!localGithub || creating}
                  className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  {creating ? 'Creating…' : 'Create new'}
                </button>
              </div>
              {createError && <p className="text-red-400 text-xs mt-1">{createError}</p>}
            </div>
          </section>

          {/* Cloudflare Worker */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">Cover Art Search</h3>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">
                Cloudflare Worker URL
                <span className="ml-1 text-zinc-600">(optional — needed for SteamGridDB search)</span>
              </label>
              <input
                type="url"
                value={localWorker}
                onChange={e => setLocalWorker(e.target.value)}
                placeholder="https://your-worker.workers.dev"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-zinc-400 hover:text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
