import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmoothScroll } from './ui/smooth-scroll';
import { StaggeredGrid } from './ui/staggered-grid';
import { Award } from 'lucide-react';

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
  const navigate = useNavigate();

  const bentoItems = HOF_MEMBERS.map((member, i) => ({
    id: i,
    title: member.name,
    subtitle: `Batch of ${member.batch}`,
    description: member.achievement,
    icon: <Award className="w-5 h-5" />,
    image: member.image,
    onClick: () => navigate(`/alumni/${member.name.toLowerCase().replace(' ', '-')}`)
  }));

  const backgroundItems = HOF_MEMBERS.map(m => ({
    src: m.image,
    onClick: () => navigate(`/alumni/${m.name.toLowerCase().replace(' ', '-')}`)
  }));

  return (
    <SmoothScroll>
      <section
        id={sectionId}
        className="w-full min-h-[150vh] pb-[20vh] bg-black/90 relative flex flex-col items-center justify-center overflow-hidden"
      >
        <StaggeredGrid 
          images={backgroundItems}
          bentoItems={bentoItems}
          centerText="ALUMNI" 
          showFooter={false}
        />
      </section>
    </SmoothScroll>
  );
}
