import { useState } from 'react'
import members from '../data/members.json'

const AVATAR_COLORS = {
  justin: 'bg-blue-700',
  christina: 'bg-pink-700',
  oliver: 'bg-green-700',
  thea: 'bg-purple-700',
}

function Avatar({ member, className }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = member.name.slice(0, 1).toUpperCase()
  const color = AVATAR_COLORS[member.id] ?? 'bg-zinc-600'

  if (imgFailed) {
    return (
      <div className={`${className} ${color} rounded-full flex items-center justify-center text-white font-semibold`}>
        {initials}
      </div>
    )
  }

  return (
    <img
      src={member.avatar}
      alt={member.name}
      className={`${className} rounded-full object-cover`}
      onError={() => setImgFailed(true)}
    />
  )
}

export default function GameCard({ game, onSetHolder, onRemove }) {
  const [showMenu, setShowMenu] = useState(false)
  const holder = members.find(m => m.id === game.holderId)

  return (
    <div className="relative group rounded-lg overflow-hidden bg-zinc-800 shadow-lg">
      {/* Cover art */}
      <div className="aspect-[2/3] w-full overflow-hidden">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-700 px-2">
            <span className="text-xs text-zinc-400 text-center">{game.title}</span>
          </div>
        )}
      </div>

      {/* Title bar */}
      <div className="px-2 py-1.5 bg-zinc-900/80">
        <p className="text-xs text-zinc-300 truncate" title={game.title}>{game.title}</p>
      </div>

      {/* Holder avatar — bottom right of cover */}
      <button
        className="absolute bottom-8 right-1.5 rounded-full ring-2 ring-zinc-900 hover:ring-blue-500 transition-all cursor-pointer"
        onClick={() => setShowMenu(v => !v)}
        title={holder ? `Held by ${holder.name}` : 'Assign holder'}
      >
        {holder ? (
          <Avatar member={holder} className="w-7 h-7 text-xs" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center text-zinc-400 text-xs">
            +
          </div>
        )}
      </button>

      {/* Holder picker dropdown */}
      {showMenu && (
        <div
          className="absolute bottom-16 right-1.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 min-w-36 overflow-hidden"
          onMouseLeave={() => setShowMenu(false)}
        >
          <div className="px-3 py-1.5 text-xs text-zinc-500 font-medium border-b border-zinc-700">
            Who has it?
          </div>
          {members.map(m => (
            <button
              key={m.id}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 transition-colors ${
                game.holderId === m.id ? 'text-blue-400' : 'text-zinc-200'
              }`}
              onClick={() => { onSetHolder(game.id, game.holderId === m.id ? null : m.id); setShowMenu(false) }}
            >
              <Avatar member={m} className="w-5 h-5 text-xs" />
              {m.name}
            </button>
          ))}
          {game.holderId && (
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-700 border-t border-zinc-700"
              onClick={() => { onSetHolder(game.id, null); setShowMenu(false) }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Remove button — visible on hover */}
      <button
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-zinc-400 hover:text-red-400 hover:bg-black/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        onClick={() => onRemove(game.id)}
        title="Remove game"
      >
        ✕
      </button>
    </div>
  )
}
