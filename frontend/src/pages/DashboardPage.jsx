import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';
import HeroSection from '../components/dashboard/HeroSection';
import DiscoverCard from '../components/dashboard/cards/DiscoverCard';
import LatestNewsCard from '../components/dashboard/cards/LatestNewsCard';
import CreatePostCard from '../components/dashboard/cards/CreatePostCard';
import CompleteProfileCard from '../components/dashboard/cards/CompleteProfileCard';
import RightPanel from '../components/dashboard/RightPanel';

export function DashboardPage() {
  const { user } = useOutletContext();
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#101010] text-white font-roboto overflow-hidden w-full absolute inset-0 z-[100]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav user={user} />

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          
          <div className="-mt-6 -mx-6 mb-6">
            <HeroSection user={user} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto min-h-full">
            <div className="flex-1 min-w-0 transition-all duration-300 flex flex-col">
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 bg-[#101010]">
                <DiscoverCard />
                <LatestNewsCard />
                <CreatePostCard />
                <CompleteProfileCard />
              </div>
            </div>

            <div className={`transition-all duration-300 flex-shrink-0 ${rightPanelCollapsed ? 'w-0 overflow-hidden' : 'w-full lg:w-[320px] xl:w-[380px]'}`}>
              <RightPanel user={user} isCollapsed={rightPanelCollapsed} onToggle={() => setRightPanelCollapsed(!rightPanelCollapsed)} />
            </div>

            {rightPanelCollapsed && (
              <button
                onClick={() => setRightPanelCollapsed(false)}
                className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-2 rounded-l hover:bg-yellow-500 transition-colors z-50 shadow-lg"
                title="Expand right panel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18L15 12L9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
