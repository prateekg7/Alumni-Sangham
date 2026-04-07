import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.js';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square.js';
import PieChart from 'lucide-react/dist/esm/icons/pie-chart.js';
import Heart from 'lucide-react/dist/esm/icons/heart.js';
import Calendar from 'lucide-react/dist/esm/icons/calendar.js';
import Clock from 'lucide-react/dist/esm/icons/clock.js';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up.js';
import { Sidebar, SidebarBody } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Messages', href: '/blog', icon: MessageSquare },
  { label: 'Analytics', href: '/', icon: PieChart },
  { label: 'Saved', href: '/saved', icon: Heart },
  { label: 'Calendar', href: '/events', icon: Calendar },
  { label: 'History', href: '/directory', icon: Clock },
];

export function SidePanel({ isDesktop, sidebarOpen, onClose, user, onLogout }) {
  const location = useLocation();

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <Sidebar
      mobileOpen={sidebarOpen}
      expanded={false}
    >
      <SidebarBody className="flex flex-col justify-between h-full bg-[#18181A] border-r border-[#202228] w-[80px] fixed left-0 top-0 bottom-0 z-50 py-6">
        <div className="flex flex-col items-center gap-10 w-full">
          
          {/* Logo Area */}
          <Link to="/dashboard" className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#242427] flex items-center justify-center shadow-md border border-[#3e3e42]">
               <span className="text-white font-black text-lg">A</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex flex-col gap-8 w-full items-center">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={onClose}
                  className="group relative flex justify-center w-full"
                >
                  <Icon 
                    className={cn(
                      "h-[22px] w-[22px] transition-colors stroke-[2.5]", 
                      active ? "text-[#F5CE00]" : "text-[#4d4d50] hover:text-[#7f7f85]"
                    )} 
                  />
                  {/* Tooltip */}
                  <div className="absolute left-12 scale-0 rounded bg-[#2a2a2d] px-2 py-1 text-xs font-semibold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Expand Arrow */}
        <div className="flex flex-col items-center pb-4">
           <button className="text-[#3e3e42] hover:text-[#7f7f85] transition-colors">
             <ChevronUp className="h-6 w-6 stroke-[2]" />
           </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
