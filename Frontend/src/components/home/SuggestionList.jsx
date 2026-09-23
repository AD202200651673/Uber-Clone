import React from 'react'
import { FiMapPin } from 'react-icons/fi'

const SuggestionList = ({ suggestions = [], onSelect, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="mt-4 rounded-[20px] bg-white/80 p-4 shadow-sm ring-1 ring-black/5 text-center text-sm text-[#5e5e5e]">
        Searching locations...
      </div>
    )
  }

  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className="mt-3 rounded-[20px] bg-white/95 p-1.5 sm:p-2 shadow-sm ring-1 ring-black/5">
      <div className="space-y-1">
        {suggestions.map((suggestion, index) => {
          const fullText = typeof suggestion === 'string'
            ? suggestion
            : (suggestion.name || suggestion.label || '')

          const parts = fullText.split(',')
          const title = parts[0]?.trim() || fullText
          const subtitle = parts.slice(1).join(',').trim() || suggestion.subtitle || ''

          return (
            <button
              key={`${fullText}-${index}`}
              type="button"
              onClick={() => onSelect(fullText)}
              className="flex min-h-[48px] w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition active:bg-neutral-100 hover:bg-[#f7f7f7]"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]">
                  <FiMapPin className="text-[#1b1c1c]" size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] sm:text-[14px] font-semibold text-[#1b1c1c]">{title}</p>
                  {subtitle && (
                    <p className="truncate text-[11px] sm:text-[12px] text-[#5e5e5e]">{subtitle}</p>
                  )}
                </div>
              </div>
              <FiMapPin className="shrink-0 text-[#888888] ml-2" size={14} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SuggestionList
