import React from 'react';
import { motion } from 'framer-motion';

const HOF_MEMBERS = [
  { 
    name: 'Sundar Pichai', 
    role: 'CEO, Alphabet & Google', 
    batch: '1993',
    achievement: 'Leading one of the world\'s most influential technology companies.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' 
  },
  { 
    name: 'Nikesh Arora', 
    role: 'CEO, Palo Alto Networks', 
    batch: '1989',
    achievement: 'Transforming global cybersecurity through innovative cloud-native solutions.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' 
  },
  { 
    name: 'Arvind Krishna', 
    role: 'CEO, IBM', 
    batch: '1985',
    achievement: 'Pioneering Quantum Computing and Hybrid Cloud technologies.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' 
  },
  { 
    name: 'Shantanu Narayen', 
    role: 'CEO, Adobe', 
    batch: '1986',
    achievement: 'Revolutionizing creative software and digital experiences globally.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' 
  },
  { 
    name: 'Thomas Kurian', 
    role: 'CEO, Google Cloud', 
    batch: '1990',
    achievement: 'Driving enterprise cloud transformation and AI-first engineering.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' 
  }
];

export function HallOfFame({ sectionId = 'hall-of-fame' }) {
  return (
    <section
      id={sectionId}
      className="w-full min-h-screen bg-black/70 backdrop-blur-sm relative flex flex-col items-center justify-center py-24 px-6 md:px-12"
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 uppercase tracking-tighter"
          >
            Hall of Fame
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-amber-200/40 text-sm md:text-lg tracking-[0.3em] uppercase mt-4"
          >
            Honoring our most distinguished alumni
          </motion.p>
        </div>

        {/* Horizontal Scroll / Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {HOF_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-amber-500/20 mb-6 group-hover:border-amber-400/50 transition-colors shadow-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h3>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20">
                    Batch of {member.batch}
                  </span>
                </div>
                
                <p className="text-amber-400/80 font-semibold text-sm mb-4">
                  {member.role}
                </p>
                
                <p className="text-white/50 text-sm leading-relaxed italic">
                  "{member.achievement}"
                </p>

                <motion.button 
                  whileHover={{ x: 5 }}
                  className="mt-8 flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  View full story <span className="text-amber-500">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
