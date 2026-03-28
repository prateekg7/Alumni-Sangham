const clone = (value) => JSON.parse(JSON.stringify(value));

const DIRECTORY_PROFILES = [
  {
    id: 'sana-ahmed',
    name: 'Sana Ahmed',
    role: 'Alumni',
    title: 'Senior Product Manager',
    company: 'Atlassian',
    headline: 'Senior PM · Atlassian',
    focus: 'Product mentoring, B2B SaaS, and early-career PM coaching.',
    location: 'Bengaluru, India',
    region: 'India',
    chapter: 'Bengaluru',
    domain: 'Product',
    years: '8 years',
    supportModes: ['Referrals', 'Mentorship'],
    skills: ['Product Strategy', 'Growth', 'APM Hiring', 'Analytics'],
    referralOpen: true,
    batchLabel: "Batch '16",
    initials: 'SA',
    avatarTone: 'from-[#8f7cff] to-[#4d82ff]',
  },
  {
    id: 'arjun-mehta',
    name: 'Arjun Mehta',
    role: 'Alumni',
    title: 'Staff Engineer',
    company: 'Stripe',
    headline: 'Staff Engineer · Stripe',
    focus: 'Backend systems, interview prep, and distributed systems guidance.',
    location: 'Singapore',
    region: 'APAC',
    chapter: 'Singapore',
    domain: 'Engineering',
    years: '10 years',
    supportModes: ['Referrals', 'Mock Interviews'],
    skills: ['Backend', 'System Design', 'Distributed Systems', 'Reliability'],
    referralOpen: true,
    batchLabel: "Batch '15",
    initials: 'AM',
    avatarTone: 'from-[#8f7cff] to-[#4d82ff]',
  },
  {
    id: 'priya-menon',
    name: 'Priya Menon',
    role: 'Alumni',
    title: 'Founder',
    company: 'WaveStack',
    headline: 'Founder · WaveStack',
    focus: 'Startups, operator coaching, and product strategy.',
    location: 'London, UK',
    region: 'Europe',
    chapter: 'London',
    domain: 'Founder',
    years: '9 years',
    supportModes: ['Referrals', 'Founder Office Hours'],
    skills: ['Startups', 'Product Strategy', 'GTM', 'Operations'],
    referralOpen: true,
    batchLabel: "Batch '14",
    initials: 'PM',
    avatarTone: 'from-[#8f7cff] to-[#4d82ff]',
  },
  {
    id: 'neha-kapoor',
    name: 'Neha Kapoor',
    role: 'Alumni',
    title: 'Lead UX Designer',
    company: 'Google',
    headline: 'Lead UX Designer · Google',
    focus: 'Portfolio reviews, UX research coaching, and design storytelling for product teams.',
    location: 'Delhi NCR, India',
    region: 'India',
    chapter: 'Delhi NCR',
    domain: 'Design',
    years: '7 years',
    supportModes: ['Mentorship', 'Portfolio Reviews'],
    skills: ['UX Design', 'Research', 'Figma', 'Storytelling'],
    referralOpen: false,
    batchLabel: "Batch '17",
    initials: 'NK',
    avatarTone: 'from-[#ff9b78] to-[#f05d88]',
  },
  {
    id: 'rohan-iyer',
    name: 'Rohan Iyer',
    role: 'Alumni',
    title: 'Data Scientist',
    company: 'Northstar AI',
    headline: 'Data Scientist · Northstar AI',
    focus: 'Data-science mentorship, experimentation systems, and analytics career guidance.',
    location: 'San Francisco, USA',
    region: 'North America',
    chapter: 'San Francisco',
    domain: 'Data',
    years: '6 years',
    supportModes: ['Referrals', 'Mentorship'],
    skills: ['Data Science', 'ML', 'Analytics', 'Experimentation'],
    referralOpen: true,
    batchLabel: "Batch '18",
    initials: 'RI',
    avatarTone: 'from-[#78b8ff] to-[#5e7dff]',
  },
  {
    id: 'meera-joshi',
    name: 'Meera Joshi',
    role: 'Alumni',
    title: 'Mobile Platform Engineer',
    company: 'OrbitPay',
    headline: 'Mobile Platform Engineer · OrbitPay',
    focus: 'Mobile systems, platform engineering, and practical interview prep for app teams.',
    location: 'Amsterdam, Netherlands',
    region: 'Europe',
    chapter: 'Amsterdam',
    domain: 'Engineering',
    years: '5 years',
    supportModes: ['Mentorship', 'Career Prep'],
    skills: ['Android', 'iOS', 'Platform', 'Architecture'],
    referralOpen: false,
    batchLabel: "Batch '20",
    initials: 'MJ',
    avatarTone: 'from-[#8af0c4] to-[#33b28c]',
  },
];

const SELF_PROFILES = {
  alumni: {
    id: 'me',
    role: 'Alumni',
    headline: 'Senior Product Manager · Atlassian',
    roleSummary: "Alumni · Batch '19 · IIT Patna CSE",
    location: 'Bengaluru, India',
    memberCode: 'ALM-19027',
    memberSince: 'Joined network · Jan 2024',
    baseLabel: 'Bengaluru Chapter',
    about:
      'Building B2B product surfaces at Atlassian and actively helping IIT Patna students with PM interviews, product sense preparation, and early-career referrals.',
    personalFields: [
      { label: 'Full name', value: 'Ryan Crawford' },
      { label: 'Email', value: 'ryan.crawford@alumni.iitp.ac.in' },
      { label: 'Phone', value: '+91 98765 10234' },
      { label: 'Location', value: 'Bengaluru, India' },
      { label: 'LinkedIn', value: 'linkedin.com/in/ryancrawford' },
      { label: 'Portfolio', value: 'ryancrawford.design' },
    ],
    roleFieldsTitle: 'Career details',
    roleFields: [
      { label: 'Current company', value: 'Atlassian' },
      { label: 'Current role', value: 'Senior Product Manager' },
      { label: 'Experience', value: '7+ years' },
      { label: 'Focus areas', value: 'Product growth, analytics, B2B SaaS' },
      { label: 'Mentorship', value: 'PM, APM, analytics case prep' },
      { label: 'Hiring support', value: 'Open to referral reviews once a month' },
    ],
    documents: [
      {
        type: 'Resume',
        title: 'Ryan_Crawford_Resume.pdf',
        updatedAt: 'Updated Feb 2026',
        visibility: 'Public to everyone who views this profile',
        summary: 'Product strategy, growth, analytics, hiring, and leadership experience.',
        tone: 'from-[#202636] to-[#12151b]',
        actionLabel: 'View resume',
      },
      {
        type: 'Mentorship brief',
        title: 'PM_Mentorship_Playbook.pdf',
        updatedAt: 'Updated Jan 2026',
        visibility: 'Visible to profile viewers',
        summary: 'How Ryan mentors students targeting product and analytics roles.',
        tone: 'from-[#272035] to-[#14161a]',
        actionLabel: 'Open file',
      },
      {
        type: 'Hiring note',
        title: 'Hiring_Signal_Checklist.pdf',
        updatedAt: 'Updated Mar 2026',
        visibility: 'Visible to profile viewers',
        summary: 'Resume and case-study signals Ryan looks for before sending a referral.',
        tone: 'from-[#1f2631] to-[#121418]',
        actionLabel: 'Open file',
      },
    ],
    trackTitle: 'Mentorship & impact',
    trackSubtitle: 'Where this alumni is currently active',
    trackItems: [
      {
        title: 'Product mentorship',
        meta: 'Open for PM, growth, and analytics interview support',
        note: '2 slots available this month',
        accent: '#8f7cff',
      },
      {
        title: 'Referral support',
        meta: 'Comfortable reviewing strong early-career product applications',
        note: 'Prefers resume + concise context',
        accent: '#5da4ff',
      },
      {
        title: 'Community contributions',
        meta: 'Shared 14 job leads and led 3 city meetups this quarter',
        note: 'Bengaluru chapter',
        accent: '#90c67e',
      },
      {
        title: 'Public writing',
        meta: 'Writes about product judgment and stakeholder management',
        note: '6 posts published',
        accent: '#f6b75b',
      },
    ],
    checklist: [
      { label: 'Personal data & resume', done: true },
      { label: 'Work experience', done: true },
      { label: 'Mentorship preferences', done: true },
      { label: 'Hiring availability', done: true },
      { label: 'Public statement', done: true },
      { label: 'City chapter details', done: false },
    ],
    referralTarget: {
      title: 'Students can request a referral',
      description:
        'Ryan is open to reviewing strong PM, APM, and product analytics candidates from IIT Patna.',
      openings: ['Associate Product Manager', 'Product Analyst', 'Business Operations'],
      note: 'Attach your resume and keep your note under 150 words.',
    },
  },
  student: {
    id: 'me',
    role: 'Student',
    headline: 'Final-year CSE Student · IIT Patna',
    roleSummary: "Student · Batch '27 · B.Tech CSE",
    location: 'Patna, India',
    memberCode: 'STD-27014',
    memberSince: 'Campus member · Aug 2023',
    baseLabel: 'Placement Season 2026',
    about:
      'Final-year CSE student focused on backend, data, and product analytics roles. Actively seeking internship and new-grad referrals through the alumni network.',
    personalFields: [
      { label: 'Full name', value: 'Aarav Sinha' },
      { label: 'Email', value: 'aarav.sinha@iitp.ac.in' },
      { label: 'Phone', value: '+91 98989 41230' },
      { label: 'Location', value: 'Patna, India' },
      { label: 'LinkedIn', value: 'linkedin.com/in/aaravsinha' },
      { label: 'Portfolio', value: 'aaravsinha.dev' },
    ],
    roleFieldsTitle: 'Academic & career details',
    roleFields: [
      { label: 'Program', value: 'B.Tech Computer Science' },
      { label: 'Graduation year', value: '2027' },
      { label: 'CGPA', value: '8.63 / 10' },
      { label: 'Target roles', value: 'Backend, product analytics, data roles' },
      { label: 'Preferred locations', value: 'Bengaluru, Hyderabad, remote' },
      { label: 'Referral goal', value: 'Internships and new-grad backend roles' },
    ],
    documents: [
      {
        type: 'Resume',
        title: 'Aarav_Sinha_Resume.pdf',
        updatedAt: 'Updated Mar 2026',
        visibility: 'Public to everyone who views this profile',
        summary: 'Backend projects, internships, coursework, and leadership experience.',
        tone: 'from-[#202636] to-[#12151b]',
        actionLabel: 'View resume',
      },
      {
        type: 'Project deck',
        title: 'Campus_Analytics_Capstone.pdf',
        updatedAt: 'Updated Feb 2026',
        visibility: 'Visible to profile viewers',
        summary: 'A capstone on student engagement analytics with dashboard screenshots.',
        tone: 'from-[#272035] to-[#14161a]',
        actionLabel: 'Open file',
      },
      {
        type: 'Open-source summary',
        title: 'OSS_Contribution_Log.pdf',
        updatedAt: 'Updated Jan 2026',
        visibility: 'Visible to profile viewers',
        summary: 'Contribution log and links to merged pull requests.',
        tone: 'from-[#1f2631] to-[#121418]',
        actionLabel: 'Open file',
      },
    ],
    trackTitle: 'Academic trajectory & projects',
    trackSubtitle: 'What this student is actively building',
    trackItems: [
      {
        title: 'Placement prep',
        meta: 'Backend interview prep with alumni mock sessions',
        note: 'Actively applying this semester',
        accent: '#8f7cff',
      },
      {
        title: 'Capstone project',
        meta: 'Analytics dashboard for campus engagement and event retention',
        note: 'React, Python, PostgreSQL',
        accent: '#5da4ff',
      },
      {
        title: 'Open-source',
        meta: 'Contributed bug fixes and test improvements to OSS tools',
        note: '12 merged PRs',
        accent: '#90c67e',
      },
      {
        title: 'Community role',
        meta: 'Placement prep circle and peer mentoring lead',
        note: 'Batch 2027 community',
        accent: '#f6b75b',
      },
    ],
    checklist: [
      { label: 'Personal data & resume', done: true },
      { label: 'Education details', done: true },
      { label: 'Projects', done: true },
      { label: 'Target roles', done: true },
      { label: 'Referral note', done: true },
      { label: 'Portfolio links', done: false },
      { label: 'Availability & preferences', done: false },
    ],
    referralTarget: null,
  },
};

const PUBLIC_PROFILES = {
  'sana-ahmed': {
    id: 'sana-ahmed',
    name: 'Sana Ahmed',
    initials: 'SA',
    role: 'Alumni',
    headline: 'Senior Product Manager · Atlassian',
    roleSummary: "Alumni · Batch '16 · IIT Patna CSE",
    location: 'Bengaluru, India',
    memberCode: 'ALM-16008',
    memberSince: 'Joined network · Oct 2023',
    baseLabel: 'Bengaluru Product Circle',
    about:
      'Leads product bets at Atlassian across B2B growth surfaces. Known in the IIT Patna network for structured PM mentorship and fast feedback on resume positioning.',
    personalFields: [
      { label: 'Full name', value: 'Sana Ahmed' },
      { label: 'Email', value: 'sana.ahmed@alumni.iitp.ac.in' },
      { label: 'Phone', value: '+91 98111 23567' },
      { label: 'Location', value: 'Bengaluru, India' },
      { label: 'LinkedIn', value: 'linkedin.com/in/sanaahmed' },
      { label: 'Portfolio', value: 'sanaahmed.me' },
    ],
    roleFieldsTitle: 'Career details',
    roleFields: [
      { label: 'Current company', value: 'Atlassian' },
      { label: 'Current role', value: 'Senior Product Manager' },
      { label: 'Experience', value: '8 years' },
      { label: 'Focus areas', value: 'Growth, experimentation, onboarding' },
      { label: 'Mentorship', value: 'PM cases, product strategy, writing' },
      { label: 'Referral support', value: 'Product internships and APM tracks' },
    ],
    documents: [
      {
        type: 'Resume',
        title: 'Sana_Ahmed_Resume.pdf',
        updatedAt: 'Updated Feb 2026',
        visibility: 'Public to everyone who views this profile',
        summary: 'Growth PM experience, experimentation systems, and mentorship highlights.',
        tone: 'from-[#202636] to-[#12151b]',
        actionLabel: 'View resume',
      },
      {
        type: 'Hiring playbook',
        title: 'PM_Hiring_Signals.pdf',
        updatedAt: 'Updated Jan 2026',
        visibility: 'Visible to profile viewers',
        summary: 'The signals Sana checks before forwarding a student profile.',
        tone: 'from-[#272035] to-[#14161a]',
        actionLabel: 'Open file',
      },
      {
        type: 'Talk deck',
        title: 'Growth_PM_Workshop.pdf',
        updatedAt: 'Updated Dec 2025',
        visibility: 'Visible to profile viewers',
        summary: 'Slides from a workshop on product growth loops and experimentation.',
        tone: 'from-[#1f2631] to-[#121418]',
        actionLabel: 'Open file',
      },
    ],
    trackTitle: 'Mentorship & hiring',
    trackSubtitle: 'How Sana is helping students right now',
    trackItems: [
      {
        title: 'Mentor office hours',
        meta: 'Monthly sessions for PM aspirants and analytics candidates',
        note: 'Next slot opens next week',
        accent: '#8f7cff',
      },
      {
        title: 'Resume reviews',
        meta: 'Prefers crisp bullets, outcomes, and decision framing',
        note: 'Resume must already be public on profile',
        accent: '#5da4ff',
      },
      {
        title: 'Hiring context',
        meta: 'Can review candidates for Atlassian product and strategy roles',
        note: 'Early-career only',
        accent: '#90c67e',
      },
      {
        title: 'Community posts',
        meta: 'Frequently posts PM interview prompts and curated opportunities',
        note: '4 posts this month',
        accent: '#f6b75b',
      },
    ],
    checklist: [
      { label: 'Personal data & resume', done: true },
      { label: 'Work experience', done: true },
      { label: 'Mentorship preferences', done: true },
      { label: 'Public statement', done: true },
      { label: 'Hiring note', done: true },
      { label: 'Resume visibility', done: true },
    ],
    referralTarget: {
      title: 'Request a referral from Sana',
      description:
        'Students can reach out for PM internships, APM roles, and product analytics tracks if the profile and resume are already polished.',
      openings: ['APM', 'Product Analyst', 'Growth Associate'],
      note: 'Keep the request concise and explain why you fit the role.',
    },
  },
  'arjun-mehta': {
    id: 'arjun-mehta',
    name: 'Arjun Mehta',
    initials: 'AM',
    role: 'Alumni',
    headline: 'Staff Engineer · Stripe',
    roleSummary: "Alumni · Batch '15 · IIT Patna CSE",
    location: 'Singapore',
    memberCode: 'ALM-15019',
    memberSince: 'Joined network · Mar 2023',
    baseLabel: 'Systems Engineering Circle',
    about:
      'Builds distributed systems at Stripe and helps IIT Patna students prepare for backend interviews, design rounds, and production thinking.',
    personalFields: [
      { label: 'Full name', value: 'Arjun Mehta' },
      { label: 'Email', value: 'arjun.mehta@alumni.iitp.ac.in' },
      { label: 'Phone', value: '+65 8890 1256' },
      { label: 'Location', value: 'Singapore' },
      { label: 'LinkedIn', value: 'linkedin.com/in/arjunmehta' },
      { label: 'Portfolio', value: 'arjun.systems' },
    ],
    roleFieldsTitle: 'Career details',
    roleFields: [
      { label: 'Current company', value: 'Stripe' },
      { label: 'Current role', value: 'Staff Engineer' },
      { label: 'Experience', value: '10 years' },
      { label: 'Focus areas', value: 'Distributed systems, reliability, infra' },
      { label: 'Mentorship', value: 'Backend interviews, system design, infra' },
      { label: 'Referral support', value: 'Strong backend and platform candidates' },
    ],
    documents: [
      {
        type: 'Resume',
        title: 'Arjun_Mehta_Resume.pdf',
        updatedAt: 'Updated Jan 2026',
        visibility: 'Public to everyone who views this profile',
        summary: 'Platform and distributed systems leadership across fintech products.',
        tone: 'from-[#202636] to-[#12151b]',
        actionLabel: 'View resume',
      },
      {
        type: 'System design notes',
        title: 'Backend_Interview_Framework.pdf',
        updatedAt: 'Updated Feb 2026',
        visibility: 'Visible to profile viewers',
        summary: 'How Arjun reviews system-design readiness for referrals.',
        tone: 'from-[#272035] to-[#14161a]',
        actionLabel: 'Open file',
      },
      {
        type: 'Talk notes',
        title: 'Reliability_Workshop.pdf',
        updatedAt: 'Updated Nov 2025',
        visibility: 'Visible to profile viewers',
        summary: 'Notes from a reliability workshop shared with campus peers.',
        tone: 'from-[#1f2631] to-[#121418]',
        actionLabel: 'Open file',
      },
    ],
    trackTitle: 'Systems mentorship',
    trackSubtitle: 'Arjun is best suited for backend and platform aspirants',
    trackItems: [
      {
        title: 'System design clinics',
        meta: 'Reviews design fundamentals before referrals go out',
        note: 'Monthly slots',
        accent: '#8f7cff',
      },
      {
        title: 'Backend referrals',
        meta: 'Supports strong infra and distributed systems candidates',
        note: 'Resume and GitHub both required',
        accent: '#5da4ff',
      },
      {
        title: 'Mock interviews',
        meta: 'Runs targeted sessions for reliability and backend rounds',
        note: 'Invite-only for shortlisted students',
        accent: '#90c67e',
      },
      {
        title: 'Knowledge sharing',
        meta: 'Posts on production engineering habits and scaling basics',
        note: '8 long-form notes published',
        accent: '#f6b75b',
      },
    ],
    checklist: [
      { label: 'Personal data & resume', done: true },
      { label: 'Work experience', done: true },
      { label: 'Mentorship preferences', done: true },
      { label: 'Public statement', done: true },
      { label: 'Hiring note', done: true },
      { label: 'Resume visibility', done: true },
    ],
    referralTarget: {
      title: 'Request a referral from Arjun',
      description:
        'Arjun reviews backend and systems candidates for infra-heavy internships and new-grad roles.',
      openings: ['Software Engineer', 'Infrastructure Intern', 'Platform Engineer'],
      note: 'Resume plus GitHub/project proof is strongly preferred.',
    },
  },
  'priya-menon': {
    id: 'priya-menon',
    name: 'Priya Menon',
    initials: 'PM',
    role: 'Alumni',
    headline: 'Founder · WaveStack',
    roleSummary: "Alumni · Batch '14 · IIT Patna ECE",
    location: 'London, UK',
    memberCode: 'ALM-14011',
    memberSince: 'Joined network · Sep 2022',
    baseLabel: 'Founder & Operator Circle',
    about:
      'Founder-operator helping students think through startup roles, product strategy, and early-stage execution. Often shares startup hiring leads with the network.',
    personalFields: [
      { label: 'Full name', value: 'Priya Menon' },
      { label: 'Email', value: 'priya.menon@alumni.iitp.ac.in' },
      { label: 'Phone', value: '+44 7400 990112' },
      { label: 'Location', value: 'London, UK' },
      { label: 'LinkedIn', value: 'linkedin.com/in/priyamenon' },
      { label: 'Portfolio', value: 'priyamenon.co' },
    ],
    roleFieldsTitle: 'Founder profile',
    roleFields: [
      { label: 'Current company', value: 'WaveStack' },
      { label: 'Current role', value: 'Founder' },
      { label: 'Experience', value: '9 years' },
      { label: 'Focus areas', value: 'Startup operations, product strategy, GTM' },
      { label: 'Mentorship', value: 'Startup careers, product strategy, founder thinking' },
      { label: 'Referral support', value: 'Select startup roles and operator internships' },
    ],
    documents: [
      {
        type: 'Resume',
        title: 'Priya_Menon_Resume.pdf',
        updatedAt: 'Updated Mar 2026',
        visibility: 'Public to everyone who views this profile',
        summary: 'Founder, operator, GTM and product strategy experience.',
        tone: 'from-[#202636] to-[#12151b]',
        actionLabel: 'View resume',
      },
      {
        type: 'Operator guide',
        title: 'Startup_Operator_Playbook.pdf',
        updatedAt: 'Updated Feb 2026',
        visibility: 'Visible to profile viewers',
        summary: 'How Priya evaluates operator and strategy candidates.',
        tone: 'from-[#272035] to-[#14161a]',
        actionLabel: 'Open file',
      },
      {
        type: 'Talk deck',
        title: 'Founder_Career_Note.pdf',
        updatedAt: 'Updated Dec 2025',
        visibility: 'Visible to profile viewers',
        summary: 'A talk about navigating startup careers straight out of college.',
        tone: 'from-[#1f2631] to-[#121418]',
        actionLabel: 'Open file',
      },
    ],
    trackTitle: 'Founder & operator network',
    trackSubtitle: 'Where Priya can be most helpful to students',
    trackItems: [
      {
        title: 'Startup role referrals',
        meta: 'Supports operator, product, and strategy internship candidates',
        note: 'High-trust warm intros only',
        accent: '#8f7cff',
      },
      {
        title: 'Founder office hours',
        meta: 'Helps students think about startup vs large-company tradeoffs',
        note: 'Monthly cohort session',
        accent: '#5da4ff',
      },
      {
        title: 'Community writing',
        meta: 'Shares tactical notes on startup execution and hiring',
        note: 'Weekly founder notes',
        accent: '#90c67e',
      },
      {
        title: 'City chapter support',
        meta: 'Helps organize London meetups and remote founder sessions',
        note: 'Open for collaboration',
        accent: '#f6b75b',
      },
    ],
    checklist: [
      { label: 'Personal data & resume', done: true },
      { label: 'Work experience', done: true },
      { label: 'Mentorship preferences', done: true },
      { label: 'Public statement', done: true },
      { label: 'Hiring note', done: true },
      { label: 'Resume visibility', done: true },
    ],
    referralTarget: {
      title: 'Request a referral from Priya',
      description:
        'Priya can occasionally support startup operator, product strategy, and founder-office roles.',
      openings: ['Founder\'s Office', 'Operator Intern', 'Product Strategy Analyst'],
      note: 'A concise context note and resume are mandatory before reaching out.',
    },
  },
};

const REFERRAL_BOARDS = {
  student: {
    title: 'My referral requests',
    description:
      'Track outgoing asks, keep your public resume ready, and personalize each request before sending it to an alumnus.',
    requests: [
      {
        name: 'Sana Ahmed',
        target: 'APM · Atlassian',
        status: 'Under review',
        meta: 'Resume attached · sent 2 days ago',
      },
      {
        name: 'Arjun Mehta',
        target: 'Software Engineer · Stripe',
        status: 'Awaiting send',
        meta: 'Need to tighten system-design context first',
      },
      {
        name: 'Priya Menon',
        target: 'Founder\'s Office · WaveStack',
        status: 'Intro call scheduled',
        meta: 'Chat confirmed for Friday evening',
      },
    ],
    checklist: [
      'Public resume is up to date',
      'Target role and company are clearly mentioned',
      'Why this alumnus is relevant is explained',
      'Projects or experience match the ask',
    ],
  },
  alumni: {
    title: 'Incoming referral requests',
    description:
      'Review student asks, open their public resume directly from the profile, and decide whether to mentor, shortlist, or request more context.',
    requests: [
      {
        name: 'Ananya Raj',
        target: 'Backend Intern · Stripe',
        status: 'New request',
        meta: 'Resume public · asks for backend systems referral',
      },
      {
        name: 'Kunal Verma',
        target: 'APM · Atlassian',
        status: 'Needs review',
        meta: 'Strong internships but note is too vague',
      },
      {
        name: 'Ritika Ghosh',
        target: 'Founder\'s Office · WaveStack',
        status: 'Interview prep pending',
        meta: 'Resume looks strong, waiting for final context note',
      },
    ],
    checklist: [
      'Resume is visible on student profile',
      'Target role is specific',
      'Student note explains fit',
      'Next step is clear: refer, mentor, or decline',
    ],
  },
};

function overrideSelfProfile(profile, user) {
  const overridden = clone(profile);
  overridden.name = user.name;
  overridden.email = user.email;
  overridden.initials = user.initials;
  overridden.roleSummary = `${user.role} · ${user.batchLabel} · ${user.role === 'Student' ? 'B.Tech CSE' : 'IIT Patna CSE'}`;
  overridden.personalFields = overridden.personalFields.map((field) => {
    if (field.label === 'Full name') {
      return { ...field, value: user.name };
    }
    if (field.label === 'Email') {
      return { ...field, value: user.email };
    }
    return field;
  });
  return overridden;
}

function buildGeneratedProfileFromDirectory(entry) {
  const fileStem = entry.name.replace(/\s+/g, '_');
  const supportSummary = entry.supportModes.join(', ');
  const resumeVisibility = 'Public to everyone who views this profile';

  return {
    id: entry.id,
    name: entry.name,
    initials: entry.initials,
    role: 'Alumni',
    headline: entry.headline,
    roleSummary: `Alumni · ${entry.batchLabel} · IIT Patna`,
    location: entry.location,
    memberCode: `ALM-${entry.batchLabel.replace(/\D/g, '') || '24'}${entry.initials}`,
    memberSince: 'Joined network · 2024',
    baseLabel: `${entry.chapter} Chapter`,
    about: `${entry.focus} Active in the alumni network through ${supportSummary.toLowerCase()}.`,
    personalFields: [
      { label: 'Full name', value: entry.name },
      { label: 'Email', value: `${entry.id}@alumni.iitp.ac.in` },
      { label: 'Phone', value: '+91 90000 00000' },
      { label: 'Location', value: entry.location },
      { label: 'LinkedIn', value: `linkedin.com/in/${entry.id}` },
      { label: 'Portfolio', value: `${entry.id}.portfolio` },
    ],
    roleFieldsTitle: 'Career details',
    roleFields: [
      { label: 'Current company', value: entry.company },
      { label: 'Current role', value: entry.title },
      { label: 'Experience', value: entry.years },
      { label: 'Focus areas', value: entry.skills.join(', ') },
      { label: 'Mentorship', value: supportSummary },
      {
        label: 'Referral support',
        value: entry.referralOpen ? `Open for ${entry.domain.toLowerCase()}-aligned referrals` : 'Mentorship-focused profile at the moment',
      },
    ],
    documents: [
      {
        type: 'Resume',
        title: `${fileStem}_Resume.pdf`,
        updatedAt: 'Updated Mar 2026',
        visibility: resumeVisibility,
        summary: `${entry.domain} experience, leadership, and work highlights from ${entry.company}.`,
        tone: 'from-[#202636] to-[#12151b]',
        actionLabel: 'View resume',
      },
      {
        type: 'Profile brief',
        title: `${fileStem}_Mentorship_Brief.pdf`,
        updatedAt: 'Updated Jan 2026',
        visibility: 'Visible to profile viewers',
        summary: `How ${entry.name.split(' ')[0]} supports the IIT Patna network through ${supportSummary.toLowerCase()}.`,
        tone: 'from-[#272035] to-[#14161a]',
        actionLabel: 'Open file',
      },
      {
        type: 'Knowledge note',
        title: `${fileStem}_Career_Notes.pdf`,
        updatedAt: 'Updated Feb 2026',
        visibility: 'Visible to profile viewers',
        summary: `A short note covering ${entry.skills.slice(0, 2).join(' and ')} for students navigating this track.`,
        tone: 'from-[#1f2631] to-[#121418]',
        actionLabel: 'Open file',
      },
    ],
    trackTitle: `${entry.domain} network`,
    trackSubtitle: `How ${entry.name.split(' ')[0]} is helping students and alumni in the ${entry.domain.toLowerCase()} lane`,
    trackItems: [
      {
        title: entry.supportModes[0],
        meta: `${entry.name.split(' ')[0]} is active around ${entry.skills.slice(0, 2).join(' and ')}.`,
        note: `${entry.chapter} chapter`,
        accent: '#8f7cff',
      },
      {
        title: 'Skill depth',
        meta: `Most relevant for ${entry.skills.join(', ')} conversations.`,
        note: `${entry.years} experience`,
        accent: '#5da4ff',
      },
      {
        title: 'Community presence',
        meta: `Active in the network through ${supportSummary.toLowerCase()}.`,
        note: `${entry.company}`,
        accent: '#90c67e',
      },
    ],
    checklist: [
      { label: 'Personal data & resume', done: true },
      { label: 'Work experience', done: true },
      { label: 'Mentorship preferences', done: true },
      { label: 'Public statement', done: true },
      { label: 'Resume visibility', done: true },
    ],
    referralTarget: entry.referralOpen
      ? {
          title: `Request a referral from ${entry.name.split(' ')[0]}`,
          description: `${entry.name.split(' ')[0]} is open to reviewing strong ${entry.domain.toLowerCase()} candidates once the public resume is polished.`,
          openings: entry.skills.slice(0, 3),
          note: 'Keep the request concise and attach context through your public profile.',
        }
      : null,
  };
}

export function getDirectoryProfiles() {
  return clone(DIRECTORY_PROFILES);
}

export function getProfileById(profileId) {
  if (!profileId) {
    return null;
  }

  if (PUBLIC_PROFILES[profileId]) {
    return clone(PUBLIC_PROFILES[profileId]);
  }

  const directoryProfile = DIRECTORY_PROFILES.find((profile) => profile.id === profileId);
  if (!directoryProfile) {
    return null;
  }

  return buildGeneratedProfileFromDirectory(directoryProfile);
}

export function getSelfProfile(user) {
  const roleKey = user.role.toLowerCase() === 'student' ? 'student' : 'alumni';
  return overrideSelfProfile(SELF_PROFILES[roleKey], user);
}

export function getReferralBoard(role) {
  const roleKey = role.toLowerCase() === 'student' ? 'student' : 'alumni';
  return clone(REFERRAL_BOARDS[roleKey]);
}
