import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useOutletContext, useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ThumbsUp, ArrowRight, ArrowLeft, Clock, Calendar, User, PenLine, History } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';

/* ───────────────────── recent posts helpers ───────────────────── */

const RECENT_POSTS_KEY = 'alumni-blog-recent-posts';

function getRecentPosts() {
  try {
    const raw = localStorage.getItem(RECENT_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addRecentPost(blog) {
  const existing = getRecentPosts().filter((p) => p.id !== blog.id);
  const entry = { id: blog.id, title: blog.title, author: blog.author, date: blog.date, visitedAt: Date.now() };
  const updated = [entry, ...existing].slice(0, 15);
  localStorage.setItem(RECENT_POSTS_KEY, JSON.stringify(updated));
  return updated;
}

/* ───────────────────────── static data ───────────────────────── */

const categories = [
  'All',
  'Career',
  'Mentorship',
  'Networking',
  'Entrepreneurship',
  'Women in Tech',
  'Global',
  'Wellness',
  'Learning',
];

const categoryColors = {
  Career: { bg: '#facc15', text: '#000' },
  Mentorship: { bg: '#6C63FF', text: '#fff' },
  Networking: { bg: '#34D399', text: '#000' },
  Entrepreneurship: { bg: '#F472B6', text: '#000' },
  'Women in Tech': { bg: '#A78BFA', text: '#fff' },
  Global: { bg: '#60A5FA', text: '#000' },
  Wellness: { bg: '#FB923C', text: '#000' },
  Learning: { bg: '#2DD4BF', text: '#000' },
};

const initialBlogs = [
  {
    id: 1,
    category: 'Career',
    date: 'Mar 15, 2024',
    title: 'Career Journey: From Student to Industry Leader',
    description:
      'Discover the inspiring story of how one alumnus navigated the tech industry and became a thought leader.',
    content: `When I graduated from IITP in 2015, I had no idea where the road would take me. Armed with a degree in Computer Science and a burning curiosity, I stepped into the tech world with nothing but raw ambition.

**The Early Days**

My first role was as a junior developer at a mid-sized startup in Bangalore. The learning curve was steep — I was writing production code within my first week, debugging systems I barely understood. But that pressure shaped me. I learned to ask the right questions, to read codebases like novels, and to never be afraid of breaking things in staging.

**The Pivot**

After three years, I realized I was more drawn to the "why" behind products than the "how." I transitioned into product management — a move that many engineers questioned. But understanding the technical foundation gave me an edge that most PMs didn't have. I could talk to engineers in their language while translating business needs into actionable specs.

**Key Lessons**

1. **Network relentlessly** — The alumni network was instrumental in every career move I made. A casual coffee chat with a senior alumnus led to my first PM role.
2. **Stay curious** — Technologies change, but the ability to learn quickly never goes out of style.
3. **Give back** — Mentoring current students has been one of the most rewarding experiences of my career. It keeps me grounded and connected to my roots.
4. **Embrace discomfort** — Every major career leap felt terrifying at first. That's usually a sign you're growing.

**Where I Am Today**

Today, I lead a product team at a Fortune 500 company, building tools that impact millions of users daily. But I still remember the late-night coding sessions in the hostel, the friendships forged over midnight chai, and the professors who pushed us to think beyond textbooks.

To every student reading this: your journey is uniquely yours. Don't compare timelines. Focus on depth, build genuine connections, and never stop learning.`,
    author: 'Sarah Johnson',
    initial: 'S',
    avatarColor: '#facc15',
    readTime: '8 min read',
    likes: 0,
  },
  {
    id: 2,
    category: 'Mentorship',
    date: 'Mar 12, 2024',
    title: 'Mentoring the Next Generation: Tips & Strategies',
    description:
      'Learn effective mentoring techniques that can help you guide and inspire the next generation of students.',
    content: `Mentorship isn't about having all the answers — it's about asking the right questions and creating a safe space for growth. Over the past decade, I've mentored over 50 students and early-career professionals, and here's what I've learned.

**Why Mentorship Matters**

In a world of infinite online resources, you might wonder if mentorship is still relevant. The answer is a resounding yes. While information is abundant, wisdom — the ability to apply knowledge in context — is scarce. That's what a good mentor provides.

**Building Trust First**

The foundation of any mentoring relationship is trust. Before diving into career advice, take time to understand your mentee as a person. What drives them? What are their fears? What does success look like to them — not to you, but to them?

**Practical Strategies**

1. **Listen more than you speak** — A 70/30 listening-to-talking ratio works well. Your mentee needs to feel heard before they can absorb advice.
2. **Share failures, not just successes** — Vulnerability builds connection. Telling someone about your rejected applications or failed projects is far more valuable than listing achievements.
3. **Set structured check-ins** — Consistency beats intensity. A 30-minute biweekly call is more effective than a sporadic 2-hour deep dive.
4. **Challenge assumptions gently** — When a mentee says "I can't do X," explore why. Often the barrier is psychological, not practical.
5. **Know when to step back** — The goal of mentorship is to make yourself unnecessary. Celebrate when your mentee outgrows your guidance.

**The Ripple Effect**

The most beautiful thing about mentorship is its compounding nature. When you mentor one person well, they go on to mentor others. I've seen chains of mentorship that span three generations of alumni, creating a web of support that benefits the entire community.

Start small. Reach out to one student this week. You might change their trajectory — and yours.`,
    author: 'Michael Chen',
    initial: 'M',
    avatarColor: '#6C63FF',
    readTime: '6 min read',
    likes: 0,
  },
  {
    id: 3,
    category: 'Networking',
    date: 'Mar 10, 2024',
    title: 'Building Networks That Last a Lifetime',
    description:
      'Practical strategies for building and maintaining professional networks that lead to meaningful career growth.',
    content: `Your network is your net worth — but only if it's built on genuine connections rather than transactional exchanges. Here's how to build a professional network that actually lasts.

**Quality Over Quantity**

Having 500+ LinkedIn connections means nothing if you can't reach out to any of them for a real conversation. Focus on building deep relationships with 20-30 people rather than shallow connections with hundreds.

**The Alumni Advantage**

Your alumni network is one of the most underutilized resources available to you. Shared experiences create instant rapport. When you reach out to a fellow alumnus, you're not a stranger — you're family.

**Networking Without Being Awkward**

1. **Lead with value** — Before asking for anything, think about what you can offer. Share an article, make an introduction, or provide feedback.
2. **Be specific in your asks** — "Can I pick your brain?" is vague and off-putting. Instead, try: "I'm considering a transition to product management. Could you share how you made a similar switch and what you'd do differently?"
3. **Follow up meaningfully** — After a conversation, send a brief thank-you note mentioning something specific you discussed. This shows you were genuinely engaged.
4. **Attend events strategically** — Don't try to meet everyone at a conference. Identify 3-4 people you genuinely want to connect with and focus your energy there.

**Maintaining Your Network**

The hardest part isn't building connections — it's maintaining them. Set reminders to check in with key contacts quarterly. A simple "Saw this article and thought of you" goes a long way.

Remember: the best time to build your network is before you need it.`,
    author: 'Priya Patel',
    initial: 'P',
    avatarColor: '#34D399',
    readTime: '5 min read',
    likes: 0,
  },
  {
    id: 4,
    category: 'Entrepreneurship',
    date: 'Mar 8, 2024',
    title: 'Entrepreneurship Lessons from Alumni Success Stories',
    description:
      'Key takeaways from alumni who built successful startups from the ground up — funding, hiring, and scaling.',
    content: `Building a startup is the hardest thing I've ever done — and the most rewarding. After interviewing 15 alumni founders, here are the patterns that separate those who succeed from those who don't.

**Start With a Problem, Not a Solution**

Every successful alumni founder I spoke with started by deeply understanding a problem before writing a single line of code. One founder spent three months shadowing hospital administrators before building their healthcare platform. That patience paid off — their product-market fit was almost immediate.

**The Funding Myth**

Contrary to popular belief, most successful alumni startups didn't start with massive funding rounds. They bootstrapped, validated, and only raised capital when they had clear evidence of traction. The alumni network was crucial here — angel investments from fellow alumni who understood the problem space.

**Hiring Your First Team**

1. **Hire for attitude, train for skill** — Early-stage startups need people who can wear multiple hats and thrive in ambiguity.
2. **Leverage the alumni network** — Your first 5 hires should ideally come from your extended network. Trust and shared values matter more than impressive resumes at this stage.
3. **Be transparent about the risks** — Don't oversell the opportunity. The best early employees join because they believe in the mission, not the paycheck.

**Scaling Lessons**

- What got you from 0 to 1 won't get you from 1 to 10. Be willing to tear down and rebuild processes.
- Culture is set in the first 20 hires. Be intentional about it.
- Customer feedback is oxygen. Never lose direct contact with your users.

**The Alumni Edge**

Several founders credited the alumni network as their unfair advantage — from finding co-founders to landing first customers to getting warm introductions to investors. The shared IITP experience creates a foundation of trust that's hard to replicate.`,
    author: 'Rahul Verma',
    initial: 'R',
    avatarColor: '#F472B6',
    readTime: '10 min read',
    likes: 0,
  },
  {
    id: 5,
    category: 'Women in Tech',
    date: 'Mar 5, 2024',
    title: 'Breaking Barriers: Women Leading in Technology',
    description:
      'Spotlight on remarkable women alumni who are shattering glass ceilings and redefining leadership in tech.',
    content: `When I entered the tech industry a decade ago, being the only woman in the room was the norm, not the exception. Today, things are changing — slowly but meaningfully — and alumni women are at the forefront of that change.

**The Numbers**

Women represent 28% of the tech workforce globally, but in leadership positions, that number drops to under 15%. Our alumni network tells a more encouraging story: over 35% of women graduates from the last five batches hold senior roles within five years of graduation.

**Profiles in Leadership**

I spoke with five remarkable alumni women who are leading in diverse areas of tech:

- **Meera Krishnan** (Batch 2012) leads AI research at a major tech company, managing a team of 40 researchers.
- **Shruti Agarwal** (Batch 2014) co-founded a fintech startup that has processed over $2 billion in transactions.
- **Divya Nair** (Batch 2016) is the youngest VP of Engineering at a unicorn startup, overseeing platform architecture.

**Common Threads**

1. **They sought out sponsors, not just mentors** — A mentor gives advice; a sponsor advocates for you in rooms you're not in. All five women credited at least one sponsor for a pivotal career moment.
2. **They built support systems** — From alumni study groups to informal leadership circles, they created communities that provided both professional guidance and emotional support.
3. **They stayed technical** — None of them abandoned their technical roots. Understanding the technology gave them credibility and confidence in leadership roles.

**What Needs to Change**

While progress is real, challenges remain. Unconscious bias in hiring, the motherhood penalty, and the "prove it again" pattern still affect women disproportionately. As an alumni community, we have a responsibility to actively create pathways, not just celebrate those who made it despite the obstacles.

If you're a woman in tech reading this: you belong here. Your perspective isn't just valuable — it's essential.`,
    author: 'Ananya Sharma',
    initial: 'A',
    avatarColor: '#A78BFA',
    readTime: '7 min read',
    likes: 0,
  },
  {
    id: 6,
    category: 'Learning',
    date: 'Mar 3, 2024',
    title: 'Continuous Learning: Staying Relevant in a Fast-Paced World',
    description:
      'Why lifelong learning matters more than ever and how alumni are upskilling to stay ahead of the curve.',
    content: `The half-life of a technical skill is now about 2.5 years. That means half of what you learned in college is already becoming obsolete. But this isn't a cause for alarm — it's an invitation to embrace the mindset of continuous learning.

**The Learning Landscape**

The ways we learn have transformed dramatically. MOOCs, YouTube tutorials, AI-assisted coding, peer learning groups — the resources available today would have been unimaginable a decade ago. But with abundance comes the paradox of choice.

**A Framework for Continuous Learning**

1. **T-shaped knowledge** — Go deep in one area (the vertical bar of the T) while maintaining broad awareness across related fields (the horizontal bar). This makes you both an expert and a versatile collaborator.
2. **Learn in public** — Write blog posts, give talks, contribute to open source. Teaching is the most effective form of learning.
3. **Structured curiosity** — Dedicate 5 hours per week to intentional learning. Treat it like a non-negotiable meeting with yourself.
4. **Learn from people, not just content** — Join communities, attend meetups, find study partners. Human context makes knowledge stick.

**What Top Alumni Are Learning Now**

Based on a survey of 200 alumni:
- **45%** are learning AI/ML skills, regardless of their current role
- **30%** are developing leadership and management capabilities
- **15%** are exploring adjacent domains (e.g., engineers learning design, designers learning data)
- **10%** are pursuing formal education (MBA, specialized certifications)

**The Unlearning Challenge**

Sometimes the hardest part isn't learning new things — it's unlearning old patterns. The way we solved problems five years ago might be actively harmful today. Stay humble enough to question your own expertise.

**Building a Learning Culture**

If you're in a leadership position, create an environment where learning is celebrated, not just tolerated. Allocate time for exploration, reward curiosity, and model the behavior yourself.

The degree you earned was a starting point, not a destination. Keep moving.`,
    author: 'David Kim',
    initial: 'D',
    avatarColor: '#2DD4BF',
    readTime: '9 min read',
    likes: 0,
  },
  {
    id: 7,
    category: 'Global',
    date: 'Feb 28, 2024',
    title: 'Alumni Making an Impact on the Global Stage',
    description:
      'From international NGOs to Fortune 500 companies — stories of alumni creating change across borders.',
    content: `Our alumni network spans 40+ countries, and the stories of impact are as diverse as the geographies they represent. From Silicon Valley to Singapore, from London to Lagos, IITP graduates are leaving their mark on the global stage.

**Global Mobility**

Over 30% of our alumni have worked internationally at some point in their careers. The skills honed at IITP — analytical thinking, adaptability, and resilience — translate remarkably well across cultures and industries.

**Spotlight: Three Global Impact Stories**

**Vikram in Climate Tech (Berlin)**
After working in traditional software for five years, Vikram pivoted to climate technology. His startup, now based in Berlin, uses satellite imagery and ML to monitor deforestation in real-time. "The problem-solving skills from IITP are universal," he says. "Climate doesn't care about borders."

**Sana at the United Nations (New York)**
Sana works on digital transformation projects at the UN, helping developing nations build digital infrastructure. Her work has impacted governance systems serving over 50 million people. "Being at IITP taught me that technology is a means to human dignity, not an end in itself."

**Rajan in Healthcare (Singapore)**
Rajan's medical AI company in Singapore has developed diagnostic tools used in 15 countries across Southeast Asia. Revenue is secondary to impact: "If our tool catches one cancer early, every late night at IITP was worth it."

**Building Global Connections**

1. **Join alumni chapters abroad** — We have active chapters in 12 major cities worldwide. These provide instant community when you move to a new country.
2. **Offer your perspective** — Your unique background is an asset in global teams. Don't try to blend in — stand out.
3. **Stay connected to roots** — The most impactful global alumni are those who maintain strong ties with the IITP community, often channeling resources and knowledge back.

The world is your campus. Act accordingly.`,
    author: 'Elena Rodriguez',
    initial: 'E',
    avatarColor: '#60A5FA',
    readTime: '6 min read',
    likes: 0,
  },
  {
    id: 8,
    category: 'Wellness',
    date: 'Feb 25, 2024',
    title: 'Balancing Ambition with Well-Being',
    description:
      'How top-performing alumni manage burnout, set boundaries, and maintain mental health while excelling at work.',
    content: `Burnout isn't a badge of honor — it's a signal that something needs to change. As high-achievers from a competitive environment, many of us struggle with this lesson. Here's what I've learned from both personal experience and conversations with fellow alumni.

**The Burnout Epidemic**

A recent survey of 300 alumni revealed alarming numbers:
- **62%** have experienced burnout at least once in their career
- **45%** report working more than 50 hours per week regularly
- **38%** say they struggle to disconnect from work during weekends

These numbers don't reflect strength — they reflect a systemic problem with how we define success.

**Redefining Success**

The most fulfilled alumni I know have broadened their definition of success beyond career metrics. Yes, titles and compensation matter. But so do:
- Quality of relationships
- Physical and mental health
- Creative pursuits outside work
- Sleep quality (yes, really)
- Time spent in nature

**Practical Wellness Strategies**

1. **Set hard boundaries** — Define your non-negotiables. Mine are: no emails after 8 PM, no work on Sundays, and 8 hours of sleep non-negotiable. These boundaries have made me more productive, not less.
2. **Move your body daily** — Exercise isn't optional for knowledge workers. Even 20 minutes of walking dramatically improves cognitive function and mood.
3. **Build a support system** — Talk about stress openly. The alumni network has informal support groups where people share struggles without judgment.
4. **Take real vacations** — Not "work from a different location" vacations. Actual disconnection. Your team will survive without you for a week, and you'll return with fresh perspective.
5. **Seek professional help early** — Therapy isn't a sign of weakness. Several senior alumni I spoke with credit professional support as a key factor in their sustained success.

**For Managers**

If you manage people, your wellness practices set the tone for your entire team. When you send emails at midnight, you're implicitly normalizing that behavior. Lead by example.

**A Personal Note**

I hit burnout hard in 2021. I was working 70-hour weeks, sleeping poorly, and my relationships were suffering. It took a health scare to wake me up. Don't wait for that moment. Start making changes today.

Your career is a marathon, not a sprint. Pace yourself accordingly.`,
    author: 'Neha Gupta',
    initial: 'N',
    avatarColor: '#FB923C',
    readTime: '5 min read',
    likes: 0,
  },
];

/* ───────────────────────── sub-components ───────────────────────── */

function HeroBanner() {
  return (
    <div
      className="w-full px-8 py-14 md:px-16 md:py-20"
      style={{ background: '#facc15' }}
    >
      <h1 className="text-4xl font-black tracking-tight text-black md:text-5xl lg:text-6xl leading-tight">
        The Alumni{' '}
        <span className="text-white">Blog</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base text-black/70 md:text-lg font-medium">
        Stories, insights, and knowledge shared by the community. Career advice, industry perspectives, and lessons learned.
      </p>
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles..."
        className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] py-3.5 pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all focus:border-[#facc15]/50 focus:ring-1 focus:ring-[#facc15]/30 text-sm"
      />
    </div>
  );
}

function CategoryPills({ active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 outline-none"
            style={
              isActive
                ? {
                    background: '#facc15',
                    color: '#000',
                    boxShadow: '0 0 16px rgba(245, 206, 0, 0.35)',
                  }
                : {
                    background: '#2a2a3d',
                    color: '#ccc',
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#3a3a52';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#2a2a3d';
                e.currentTarget.style.color = '#ccc';
              }
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function BlogCard({ blog, onLike }) {
  return (
    <article
      className="group rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
    >
      {/* top */}
      <div>
        <span className="text-xs text-gray-400">{blog.date}</span>

        <h3 className="mt-2 text-lg font-bold text-gray-900 leading-snug group-hover:text-[#eab308] transition-colors duration-200">
          {blog.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          {blog.description}
        </p>
      </div>

      {/* author row */}
      <div className="mt-5 flex items-center gap-3">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{ background: blog.avatarColor, color: '#000' }}
        >
          {blog.initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{blog.author}</p>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {blog.readTime}
          </p>
        </div>
      </div>

      {/* footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onLike(blog.id)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-[#eab308]"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{blog.likes}</span>
        </button>
        <Link
          to={`/blog/${blog.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#eab308] transition-all hover:gap-2"
        >
          Read More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

/* ───────────────────── blog detail view ───────────────────── */

function renderMarkdownContent(text) {
  // Simple markdown-like rendering for bold text and paragraphs
  const lines = text.split('\n');
  const elements = [];
  let currentParagraph = [];

  const processInline = (line, idx) => {
    // Handle **bold** text
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${idx}-${i}`} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={elements.length} className="text-[15px] leading-8 text-gray-600">
          {currentParagraph}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      return;
    }

    // Headings
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      flushParagraph();
      elements.push(
        <h3 key={elements.length} className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {trimmed.slice(2, -2)}
        </h3>
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      const content = trimmed.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={elements.length} className="flex gap-3 py-1.5 pl-2">
          <span className="text-[#eab308] font-bold text-sm mt-0.5">{trimmed.match(/^\d+/)[0]}.</span>
          <p className="text-[15px] leading-7 text-gray-600">{processInline(content, idx)}</p>
        </div>
      );
      return;
    }

    // Bullet lists
    if (trimmed.startsWith('- ')) {
      flushParagraph();
      const content = trimmed.slice(2);
      elements.push(
        <div key={elements.length} className="flex gap-3 py-1.5 pl-2">
          <span className="text-[#eab308] mt-2">•</span>
          <p className="text-[15px] leading-7 text-gray-600">{processInline(content, idx)}</p>
        </div>
      );
      return;
    }

    // Regular text
    if (currentParagraph.length > 0) {
      currentParagraph.push(' ');
    }
    currentParagraph.push(...processInline(trimmed, idx));
  });

  flushParagraph();
  return elements;
}

export function BlogDetailPage() {
  const { user } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = initialBlogs.find((b) => b.id === Number(id));

  // Record visit
  useEffect(() => {
    if (blog) {
      addRecentPost(blog);
    }
  }, [blog?.id]);

  if (!blog) {
    return (
      <div className="flex h-screen bg-[#101010] text-white font-roboto overflow-hidden w-full absolute inset-0 z-[100]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <TopNav user={user} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-4">🔍</p>
              <h2 className="text-2xl font-bold text-white mb-2">Article not found</h2>
              <p className="text-white/50 mb-6">The article you're looking for doesn't exist.</p>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#facc15] px-6 py-3 text-sm font-bold text-black transition-all hover:bg-[#e0bb00]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colors = categoryColors[blog.category] || { bg: '#6C63FF', text: '#fff' };

  // Get related articles (same category, excluding current)
  const related = initialBlogs
    .filter((b) => b.category === blog.category && b.id !== blog.id)
    .slice(0, 2);

  // If no same-category articles, pick random ones
  const relatedArticles = related.length > 0
    ? related
    : initialBlogs.filter((b) => b.id !== blog.id).slice(0, 2);

  return (
    <div className="flex h-screen bg-[#101010] text-white font-roboto overflow-hidden w-full absolute inset-0 z-[100]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav user={user} />

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Back navigation bar */}
          <div className="sticky top-0 z-10 bg-[#101010]/90 backdrop-blur-md border-b border-white/5 px-8 py-3">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[#facc15]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </button>
          </div>

          {/* Article content in white card */}
          <div className="px-6 py-10 md:px-12 max-w-[900px] mx-auto">
            {/* Category + meta */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="rounded-full px-4 py-1.5 text-xs font-bold"
                style={{ background: colors.bg, color: colors.text }}
              >
                {blog.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                <Calendar className="h-3 w-3" />
                {blog.date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                <Clock className="h-3 w-3" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
              {blog.title}
            </h1>

            <p className="mt-4 text-base text-white/50 leading-relaxed">
              {blog.description}
            </p>

            {/* White article card */}
            <div className="mt-8 rounded-2xl bg-white p-8 md:p-10">
              {/* Author strip */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold"
                  style={{ background: blog.avatarColor, color: '#000' }}
                >
                  {blog.initial}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{blog.author}</p>
                  <p className="flex items-center gap-1 text-sm text-gray-400">
                    <User className="h-3.5 w-3.5" />
                    Alumni Contributor
                  </p>
                </div>
              </div>

              {/* Article body */}
              <div className="pt-6 space-y-1 blog-detail-body">
                {renderMarkdownContent(blog.content)}
              </div>
            </div>

            {/* Related articles */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedArticles.map((related) => {
                  const relColors = categoryColors[related.category] || { bg: '#6C63FF', text: '#fff' };
                  return (
                    <Link
                      key={related.id}
                      to={`/blog/${related.id}`}
                      className="group rounded-2xl bg-white p-5 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="rounded-full px-3 py-1 text-[10px] font-bold"
                          style={{ background: relColors.bg, color: relColors.text }}
                        >
                          {related.category}
                        </span>
                        <span className="text-[11px] text-gray-400">{related.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#eab308] transition-colors">
                        {related.title}
                      </h3>
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {related.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

/* ───────────── create post composer (alumni only) ───────────── */

function CreatePostComposer({ user, onPost }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) return;
    onPost({ title: title.trim(), description: text.trim() });
    setTitle('');
    setText('');
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 rounded-2xl bg-[#1a1a2e] border border-white/10 p-4 text-left transition-all hover:border-[#facc15]/30"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#facc15] text-sm font-bold text-black">
          {user.initials || user.name?.[0] || 'A'}
        </div>
        <span className="text-sm text-white/40">Share your insights with the community...</span>
        <PenLine className="ml-auto h-4 w-4 text-white/30" />
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-[#1a1a2e] border border-white/10 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#facc15] text-sm font-bold text-black">
          {user.initials || user.name?.[0] || 'A'}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{user.name}</p>
          <p className="text-xs text-white/40">Alumni</p>
        </div>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title"
        className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#facc15]/40 mb-3"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write your article or insight..."
        className="w-full rounded-lg border border-white/10 bg-[#101010] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none resize-none focus:border-[#facc15]/40"
      />
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => { setExpanded(false); setTitle(''); setText(''); }}
          className="rounded-lg px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || !text.trim()}
          className="rounded-lg bg-[#facc15] px-5 py-2 text-sm font-bold text-black transition-all hover:bg-[#e0bb00] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Publish
        </button>
      </div>
    </div>
  );
}

/* ───────────── recent posts sidebar ───────────── */

function RecentPostsSidebar() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    setRecentPosts(getRecentPosts());

    // Listen for storage changes (in case detail page updates in same tab)
    const interval = setInterval(() => {
      setRecentPosts(getRecentPosts());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatVisitedTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="sticky top-0">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-[#facc15]" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Posts</h3>
      </div>

      {recentPosts.length === 0 ? (
        <div className="rounded-xl bg-[#1a1a2e] border border-white/8 p-4 text-center">
          <p className="text-xs text-white/30">No posts visited yet</p>
          <p className="mt-1 text-[11px] text-white/20">Click "Read More" on any article to track it here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recentPosts.map((post) => (
            <Link
              key={`${post.id}-${post.visitedAt}`}
              to={`/blog/${post.id}`}
              className="group rounded-xl bg-[#1a1a2e] border border-white/6 p-3 transition-all hover:border-[#facc15]/20 hover:bg-[#1e1e35]"
            >
              <p className="text-xs font-semibold text-white/75 leading-snug group-hover:text-[#facc15] transition-colors line-clamp-2">
                {post.title}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-white/30">{post.author}</span>
                <span className="text-[10px] text-white/20">{formatVisitedTime(post.visitedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── main listing page ───────────────────────── */

export function BlogsPage() {
  const { user } = useOutletContext();
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState(initialBlogs);

  const isAlumni = user?.role === 'Alumni';

  const handleLike = (id) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b)),
    );
  };

  const handlePost = useCallback(({ title, description }) => {
    const newBlog = {
      id: Date.now(),
      category: 'Career',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title,
      description,
      content: description,
      author: user?.name || 'Alumni',
      initial: (user?.name?.[0] || user?.initials?.[0] || 'A').toUpperCase(),
      avatarColor: '#facc15',
      readTime: `${Math.max(1, Math.ceil(description.split(' ').length / 200))} min read`,
      likes: 0,
    };
    setBlogs((prev) => [newBlog, ...prev]);
  }, [user]);

  const filtered = useMemo(() => {
    let list = blogs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }
    return list;
  }, [blogs, search]);

  return (
    <div className="flex h-screen bg-[#101010] text-white font-roboto overflow-hidden w-full absolute inset-0 z-[100]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav user={user} />

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Hero Banner */}
          <HeroBanner />

          {/* Content area: 80/20 split */}
          <div className="flex gap-6 px-6 py-8 md:px-10 lg:px-14 max-w-[1400px] mx-auto">

            {/* Left: Blog feed (~80%) */}
            <div className="flex-[4] min-w-0">
              {/* Search */}
              <SearchBar value={search} onChange={setSearch} />

              {/* Create post — alumni only */}
              {isAlumni && (
                <div className="mt-5">
                  <CreatePostComposer user={user} onPost={handlePost} />
                </div>
              )}

              {/* Blog list — single column, stacked like Reddit */}
              <div className="mt-6 flex flex-col gap-5">
                {filtered.length > 0 ? (
                  filtered.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} onLike={handleLike} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 text-5xl">📝</div>
                    <p className="text-lg font-semibold text-white/60">
                      No articles found
                    </p>
                    <p className="mt-2 text-sm text-white/35">
                      Try adjusting your search
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Recent Posts sidebar (~20%) */}
            <div className="hidden lg:block flex-[1] min-w-[220px] max-w-[280px] pt-1">
              <RecentPostsSidebar />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
