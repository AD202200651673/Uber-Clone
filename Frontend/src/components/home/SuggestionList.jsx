import React from 'react'
import { FiMapPin } from 'react-icons/fi'

const SuggestionList = ({ suggestions, onSelect }) => (
  <div className="mt-4 rounded-[20px] bg-white/80 p-2 shadow-sm ring-1 ring-black/5">
    <div className="space-y-1">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.label}
          type="button"
          onClick={() => onSelect(suggestion.label)}
          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-[#f7f7f7]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f1f0]">
              <FiMapPin />
            </div>
            <div>
              <p className="text-[14px] font-semibold">{suggestion.label}</p>
              <p className="text-[12px] text-[#5e5e5e]">{suggestion.subtitle}</p>
            </div>
          </div>
          <FiMapPin className="text-[#5e5e5e]" />
        </button>
      ))}
    </div>
  </div>
)

export default SuggestionList
