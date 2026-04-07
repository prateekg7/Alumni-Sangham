import { useState } from 'react';
import { List, Zap, MessageSquare, Wifi } from 'lucide-react';

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);

  const navItems = [
    { icon: <List size={22} />, label: 'Activities' },
    { icon: <Zap size={22} />, label: 'Trending' },
    { icon: <MessageSquare size={22} />, label: 'Messages' },
    { icon: <Wifi size={22} />, label: 'Network' },
  ];

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-[#000000] flex flex-col items-center py-6 flex-shrink-0 h-full z-20 overflow-hidden transition-all duration-300 ease-in-out ${hovered ? 'w-52' : 'w-[72px]'}`}
    >
      {/* Logo */}
      <div className="flex items-center mb-12 w-full px-5 flex-shrink-0">
        <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-md flex-shrink-0">
          <span className="text-white font-black text-2xl">A</span>
        </div>
        <span
          className={`ml-3 text-white font-bold text-xl tracking-tight whitespace-nowrap transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          Alumni
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-8 w-full flex-1 px-5">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="text-white/60 group-hover:text-white transition-colors flex-shrink-0">
              {item.icon}
            </div>
            <span
              className={`text-white/60 group-hover:text-white font-medium text-sm whitespace-nowrap transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
