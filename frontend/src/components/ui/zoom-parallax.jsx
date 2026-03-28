import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'lucide-react/dist/esm/icons/globe.js';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.js';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.js';
import Share2 from 'lucide-react/dist/esm/icons/share-2.js';
import Mail from 'lucide-react/dist/esm/icons/mail.js';
import Star from 'lucide-react/dist/esm/icons/star.js';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';

const CARDS = [
  // Block 1 (Left Tall): x: 0 to 1/3, y: 0 to 2/3
  {
    id: 'block1',
    gridArea: '1 / 1 / 3 / 2', // rows 1-2, col 1
    gradient: 'from-blue-600/20 to-blue-950/60',
    border: 'border-blue-400/20',
    accent: 'text-white',
    features: [
      {
        icon: Globe,
        label: 'Alumni Directory',
        desc: 'Interactive world map connecting alumni globally.',
        navigateTo: '/directory',
      },
      {
        icon: ShieldCheck,
        label: 'Verified Profiles',
        desc: 'Automated identity checks for every member.',
        navigateTo: '/register',
      },
    ],
  },
  // Block 2 (Top Wide): x: 1/3 to 1, y: 0 to 1/3
  {
    id: 'block2',
    gridArea: '1 / 2 / 2 / 4', // row 1, cols 2-3
    gradient: 'from-sky-600/20 to-sky-950/60',
    border: 'border-sky-400/20',
    accent: 'text-white',
    features: [
      {
        icon: LayoutDashboard,
        label: 'Role Dashboards',
        desc: 'Tailored views for students, alumni, and admins.',
        navigateTo: '/dashboard',
      },
    ],
  },
  // Center gap: x: 1/3 to 2/3, y: 1/3 to 2/3
  // (Empty, defined implicitly by grid gaps)
  
  // Block 3 (Bottom Wide): x: 0 to 2/3, y: 2/3 to 1
  {
    id: 'block3',
    gridArea: '3 / 1 / 4 / 3', // row 3, cols 1-2
    gradient: 'from-cyan-600/20 to-cyan-950/60',
    border: 'border-cyan-400/20',
    accent: 'text-white',
    features: [
      {
        icon: Newspaper,
        label: 'Blog & Jobs',
        desc: 'Unified feed for articles and internships.',
        navigateTo: '/blog',
      },
      {
        icon: Share2,
        label: 'Referrals',
        desc: 'Request job referrals in one click.',
        navigateTo: '/profile/me?tab=referrals',
      },
    ],
  },
  // Block 4 (Right Tall): x: 2/3 to 1, y: 1/3 to 1
  {
    id: 'block4',
    gridArea: '2 / 3 / 4 / 4', // rows 2-3, col 3
    gradient: 'from-indigo-600/20 to-indigo-950/60',
    border: 'border-indigo-400/20',
    accent: 'text-white',
    features: [
      {
        icon: Mail,
        label: 'Email Connect',
        desc: 'Privacy-preserving email relay outreach.',
        navigateTo: '/directory',
      },
      {
        icon: Star,
        label: 'Distinguished',
        desc: 'Showcase outstanding alumni achievements.',
        navigateTo: '/',
        navigateHash: 'hall-of-fame',
      },
    ],
  },
];

export function ZoomParallax() {
  const navigate = useNavigate();
  const container = useRef(null);

  const goFeature = (f) => {
    if (!f?.navigateTo) {
      return;
    }
    if (f.navigateHash) {
      navigate({ pathname: f.navigateTo, hash: f.navigateHash });
      return;
    }
    if (f.navigateTo.includes('?')) {
      const [path, query] = f.navigateTo.split('?');
      const params = new URLSearchParams(query);
      navigate({ pathname: path, search: `?${params.toString()}` });
      return;
    }
    navigate(f.navigateTo);
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Scale the ENTIRE grid container from 1 to 5.
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 5]);

  // Heading fades out fast
  const headingOp = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headingY  = useTransform(scrollYProgress, [0, 0.15], [0, -20]);

  // Fades out the center portal content as it zooms towards the camera
  const portalOp = useTransform(scrollYProgress, [0.1, 0.6], [1, 0]);

  return (
    <div ref={container} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none relative">
        <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm pointer-events-none" />

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
                  {card.features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => goFeature(f)}
                        className="w-full rounded-2xl border border-transparent p-2 text-left transition hover:border-white/15 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                      >
                        <div className={`flex items-center gap-3 mb-2 ${card.accent}`}>
                          <Icon size={20} strokeWidth={2.2} />
                          <span className="text-xs md:text-sm font-bold tracking-widest uppercase">{f.label}</span>
                        </div>
                        <p className="text-sm border-l-2 border-white/10 pl-3 md:text-base text-white/70 leading-relaxed font-light">
                          {f.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* ── THE PORTAL (Gateway to Hall of Fame) ── */}
            <div className="col-start-2 row-start-2 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden pointer-events-none w-full h-full border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] z-20 group">
               <motion.div 
                 style={{ opacity: portalOp }}
                 className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 to-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 md:gap-6 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10"
               >
                 <Star className="w-10 h-10 md:w-14 md:h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-widest text-center uppercase drop-shadow-2xl leading-tight">
                   Hall of Fame
                 </h2>
                 <div className="h-[2px] w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                 <span className="text-white/80 text-[10px] md:text-xs uppercase font-extrabold tracking-[0.3em] md:tracking-[0.4em] text-center drop-shadow-md">
                   Scroll to enter
                 </span>
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
