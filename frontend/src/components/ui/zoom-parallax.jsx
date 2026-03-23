import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { Globe, LayoutDashboard, Newspaper, Share2, Mail, Star, Bell, ShieldCheck } from 'lucide-react';

const HOF_CARDS = [
  { name: 'Sundar Pichai', role: 'CEO, Alphabet Inc.', src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
  { name: 'Arvind Krishna', role: 'CEO, IBM', src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
  { name: 'N. R. Narayana Murthy', role: 'Founder, Infosys', src: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop' },
  { name: 'Vinod Khosla', role: 'Founder, Khosla Ventures', src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' },
  { name: 'Thomas Kurian', role: 'CEO, Google Cloud', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }
];

const CARDS = [
  // Block 1 (Left Tall): x: 0 to 1/3, y: 0 to 2/3
  {
    id: 'block1',
    gridArea: '1 / 1 / 3 / 2', // rows 1-2, col 1
    gradient: 'from-violet-600/40 to-purple-900/30',
    border: 'border-violet-400/30',
    accent: 'text-violet-300',
    features: [
      { icon: Globe,       label: 'Alumni Directory',   desc: 'Interactive world map connecting alumni globally.' },
      { icon: ShieldCheck, label: 'Verified Profiles',   desc: 'Automated identity checks for every member.' },
    ],
  },
  // Block 2 (Top Wide): x: 1/3 to 1, y: 0 to 1/3
  {
    id: 'block2',
    gridArea: '1 / 2 / 2 / 4', // row 1, cols 2-3
    gradient: 'from-cyan-600/40 to-sky-900/30',
    border: 'border-cyan-400/30',
    accent: 'text-cyan-300',
    features: [
      { icon: LayoutDashboard, label: 'Role Dashboards',  desc: 'Tailored views for students, alumni, and admins.' },
    ],
  },
  // Center gap: x: 1/3 to 2/3, y: 1/3 to 2/3
  // (Empty, defined implicitly by grid gaps)
  
  // Block 3 (Bottom Wide): x: 0 to 2/3, y: 2/3 to 1
  {
    id: 'block3',
    gridArea: '3 / 1 / 4 / 3', // row 3, cols 1-2
    gradient: 'from-amber-500/40 to-orange-900/30',
    border: 'border-amber-400/30',
    accent: 'text-amber-300',
    features: [
      { icon: Newspaper, label: 'Blog & Jobs', desc: 'Unified feed for articles and internships.' },
      { icon: Share2,    label: 'Referrals',   desc: 'Request job referrals in one click.' },
    ],
  },
  // Block 4 (Right Tall): x: 2/3 to 1, y: 1/3 to 1
  {
    id: 'block4',
    gridArea: '2 / 3 / 4 / 4', // rows 2-3, col 3
    gradient: 'from-rose-600/40 to-pink-900/30',
    border: 'border-rose-400/30',
    accent: 'text-rose-300',
    features: [
      { icon: Mail, label: 'Email Connect', desc: 'Privacy-preserving email relay outreach.' },
      { icon: Star, label: 'Hall of Fame',  desc: 'Showcase distinguished achievements.' },
    ],
  },
];

export function ZoomParallax() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Scale the ENTIRE grid container from 1 to 5.
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 5]);

  // Heading fades out fast
  const headingOp = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headingY  = useTransform(scrollYProgress, [0, 0.15], [0, -20]);

  return (
    <div ref={container} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">

        {/* ── Heading (Platform Features badge) ── */}
        <motion.div
          style={{ opacity: headingOp, y: headingY }}
          className="absolute top-8 pointer-events-none z-30"
        >
          <span className="text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase text-cyan-400 bg-cyan-400/10 px-4 md:px-6 py-2 rounded-full border border-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            Platform Features
          </span>
        </motion.div>

        {/* ── Grid Container (Zooms Out & Flies Off) ── */}
        <motion.div
          style={{
            scale: gridScale,
            transformOrigin: 'center center',
          }}
          className="w-full h-full max-w-7xl max-h-[900px] p-4 md:p-8 shrink-0 pointer-events-auto"
        >
          <div className="grid grid-cols-3 grid-rows-3 gap-4 md:gap-6 w-full h-full relative z-10 pointer-events-none">
            {CARDS.map((card) => (
              <div
                key={card.id}
                style={{ gridArea: card.gridArea }}
                className={`group pointer-events-auto rounded-3xl border border-white/10 backdrop-blur-xl bg-gradient-to-br ${card.gradient} p-5 md:p-8 flex flex-col justify-center overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-white/40 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] shadow-2xl relative`}
              >
                {/* ambient glow inside card */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-15 bg-white blur-3xl pointer-events-none rounded-full" />
                {/* shiny hover edge reflection */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0" />

                <div className="space-y-6 relative z-10">
                  {card.features.map((f, fi) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label}>
                        <div className={`flex items-center gap-3 mb-2 ${card.accent}`}>
                          <Icon size={20} strokeWidth={2.2} />
                          <span className="text-xs md:text-sm font-bold tracking-widest uppercase">{f.label}</span>
                        </div>
                        <p className="text-sm border-l-2 border-white/10 pl-3 md:text-base text-white/70 leading-relaxed font-light">{f.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* ── THE PORTAL (Hall of Fame) ── */}
            {/* 
              This cell gets physically larger on the screen relative to the grid scaling.
              By applying overflow-hidden, it acts as a mask.
              Inside it, the motion.div uses a static scale(0.18) so the Hall of Fame fits inside the cell natively at scroll 0,
              and naturally scales up to ~1.0 size when the grid zooms 5x!
            */}
            <div className="col-start-2 row-start-2 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden pointer-events-auto w-full h-full flex items-center justify-center border border-white/5 shadow-[0_0_40px_rgba(251,191,36,0.1)] bg-black/40 backdrop-blur-sm z-20 group">
               <motion.div 
                 style={{ transform: 'scale(0.18)' }}
                 className="absolute flex flex-col items-center w-[100vw] shrink-0"
               >
                  {/* The actual Hall of Fame Content */}
                  <div className="w-full flex flex-col justify-center items-center pointer-events-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 mb-8 drop-shadow-2xl text-center">
                      Hall of Fame
                    </h2>
                    
                    <div className="w-full max-w-7xl overflow-hidden pb-8 flex items-center justify-center gap-6 px-4 md:px-24">
                       {HOF_CARDS.map(hof => (
                         <div key={hof.name} className="shrink-0 w-64 md:w-80 bg-black/40 border border-white/10 p-5 md:p-6 rounded-3xl backdrop-blur-xl group/card hover:-translate-y-2 transition-transform duration-300 hover:border-amber-400/30 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.2)]">
                           <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full overflow-hidden border-2 border-amber-500/30 group-hover/card:border-amber-400 transition-colors">
                             <img src={hof.src} className="w-full h-full object-cover" alt={hof.name} />
                           </div>
                           <h3 className="text-lg md:text-xl font-bold text-white text-center group-hover/card:text-amber-300 transition-colors">{hof.name}</h3>
                           <p className="text-amber-400/80 text-xs md:text-sm text-center font-medium mt-1 md:mt-2">{hof.role}</p>
                           <button className="mt-4 md:mt-6 w-full py-2 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs md:text-sm font-semibold transition-colors">View Profile</button>
                         </div>
                       ))}
                    </div>
                  </div>
               </motion.div>
            </div>

          </div>
        </motion.div>

        {/* Vignette */}
        <div
          className="absolute inset-0 z-40"
          style={{ boxShadow: 'inset 0 0 100px 30px rgba(0,0,0,0.7)' }}
        />
      </div>
    </div>
  );
}
