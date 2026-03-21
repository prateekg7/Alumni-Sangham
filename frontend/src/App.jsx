import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <main>
        <Hero />
        
        {/* Fill dummy content to allow scrolling further than the Hero */}
        <div className="h-screen bg-black flex items-center justify-center border-t border-white/5 relative z-10 pb-32">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500 mb-8">
              A Network Built For Greatness
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
              This space will host the home, about, features, and hall of fame sections as requested.
              The scroll completes, seamlessly transitioning the user from the high-fidelity drone entry into the content block.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
