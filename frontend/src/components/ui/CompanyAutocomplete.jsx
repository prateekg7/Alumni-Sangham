import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PRE_CURATED_COMPANIES } from '../../lib/companies';

export function CompanyAutocomplete({ value, onChange, fullWidth, theme = 'dark' }) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (typeof query !== 'string' || query.trim().length < 2) return [];
    
    const exactTerm = query.trim().toLowerCase();
    
    // Filter the static list (now just strings)
    const matched = PRE_CURATED_COMPANIES.filter(c => 
      c.toLowerCase().includes(exactTerm)
    );
    
    // Sort so exact/prefix matches bubble to top
    return matched.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      if (aLower === exactTerm && bLower !== exactTerm) return -1;
      if (bLower === exactTerm && aLower !== exactTerm) return 1;
      const aStarts = aLower.startsWith(exactTerm);
      const bStarts = bLower.startsWith(exactTerm);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;
      return 0;
    }).slice(0, 10);
  }, [query]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (val.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item);
    onChange(item);
    setIsOpen(false);
  };

  const isLight = theme === 'light';
  
  const lightInputClass = "w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45";
  const darkInputClass = "w-full rounded-[6px] border border-white/10 bg-[#17181f] px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/40";
  
  return (
    <div ref={wrapperRef} className={`relative ${fullWidth ? 'md:col-span-2' : ''}`}>
      {!isLight && <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.38)' }}>Current company</div>}
      <div className={`relative ${!isLight ? 'mt-2' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (typeof query === 'string' && query.trim().length >= 2) setIsOpen(true); }}
          className={isLight ? lightInputClass : darkInputClass}
          placeholder="Current Company"
        />
      </div>

      {isOpen && typeof query === 'string' && query.trim().length >= 2 && suggestions.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 border rounded-xl shadow-xl max-h-60 overflow-y-auto ${isLight ? 'bg-white/95 backdrop-blur-xl border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'bg-[#17181f] border-white/10'}`}>
          <ul className="py-1">
            {suggestions.map((item, idx) => (
              <li
                key={`${item}-${idx}`}
                onClick={() => handleSelect(item)}
                className={`px-4 py-2 text-sm cursor-pointer transition ${isLight ? 'text-[#24181e] hover:bg-[#e8528d]/10' : 'text-white/86 hover:bg-white/5'}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
