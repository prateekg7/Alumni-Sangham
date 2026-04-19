import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { DEPARTMENTS } from '../../lib/departments';

export function DepartmentDropdown({ value, onChange, theme = 'dark', error, label, fullWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedItem = DEPARTMENTS.find(d => d.value === value);

  const isLight = theme === 'light';
  
  // Custom styling mimicking the target inputs
  const lightBtnClass = "w-full flex justify-between items-center text-left rounded-xl border border-white/55 bg-white px-4 py-3 text-sm transition-all focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45";
  const lightDropdownClass = "absolute z-50 w-full mt-1 border rounded-xl shadow-xl max-h-60 overflow-y-auto bg-[rgba(255,255,255,0.95)] backdrop-blur-xl border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.1)]";
  const lightItemClass = "px-4 py-2.5 text-sm cursor-pointer transition text-[#24181e] hover:bg-[#e8528d]/10";

  // For the dark theme (Profile Page), we use absolute styles
  const baseBtnClass = `mt-2 w-full flex justify-between items-center text-left rounded-[6px] border px-3 py-2.5 text-sm outline-none transition`;
  const btnStyle = !isLight ? {
    background: 'rgba(255,255,255,0.06)',
    borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.12)',
    color: value ? '#f0f0f0' : 'rgba(255,255,255,0.58)',
  } : {};

  return (
    <div ref={wrapperRef} className={`relative flex-1 w-full ${fullWidth ? 'md:col-span-2' : ''}`}>
      {!isLight && label && <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgba(255,255,255,0.32)]">{label}</div>}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={(isLight ? lightBtnClass : baseBtnClass) + " cursor-pointer"}
        style={btnStyle}
      >
        <span className={isLight && !value ? 'text-[#8b737d]' : (isLight ? 'text-[#24181e]' : '')}>
          {selectedItem ? selectedItem.label : (isLight ? 'Select Department' : `Select ${label}`)}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ opacity: isLight ? 0.5 : 0.6 }} />
      </div>

      {isOpen && (
        <div className={isLight ? lightDropdownClass : `absolute z-[60] w-full mt-1 border rounded-[6px] shadow-xl max-h-60 overflow-y-auto bg-[#36454F] border-[rgba(255,255,255,0.08)]`}>
          <ul className="py-1">
            {DEPARTMENTS.map((item) => (
              <li
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setIsOpen(false);
                }}
                className={isLight ? lightItemClass : `px-3 py-2 text-sm cursor-pointer transition text-[#f0f0f0] hover:bg-[rgba(255,255,255,0.06)]`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error ? <div className="mt-1 text-xs text-red-500">{error}</div> : null}
    </div>
  );
}
