import React from 'react';
import Search from 'lucide-react/dist/esm/icons/search.js';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';

export function TopBar({ user }) {
  return (
    <header className="fixed top-0 right-0 left-[76px] z-40 h-[60px] bg-[#1e1e1e]">
      <div className="flex h-full items-center justify-between px-8">
        
        {/* Left: Search Box */}
        <div className="flex items-center w-full max-w-sm text-[#7f7f85]">
          <span className="text-sm border-none bg-transparent outline-none flex-1 placeholder:text-[#4d4d50] text-[#cfcfcf]">
            Search Activities........
          </span>
          <Search className="h-4 w-4 ml-2 stroke-[2] opacity-70" />
        </div>

        {/* Right: User Profile Menu */}
        <div className="flex flex-1 justify-end items-center gap-3">
          <div className="relative flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-[#e8e8e8] flex items-center justify-center shrink-0 shadow-sm relative">
              {/* Green dot notification mock */}
              <div className="absolute -top-[14px] left-1/2 w-4 h-4 bg-[#239257] rounded-full"></div>
            </div>
            
            <div className="text-sm font-medium text-[#d9d9d9]">
              {user.name}
            </div>
            
            <ChevronDown className="h-4 w-4 text-[#7f7f85] transition-transform hover:text-white cursor-pointer" />
          </div>
        </div>

      </div>
    </header>
  );
}
