/**
 * Seeds demo alumni, optional student, discussion posts.
 * Usage: node scripts/seed.js
 * Requires MONGO_URI, JWT env vars not needed for seed.
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/modules/auth/user.model.js";
import Profile from "../src/modules/profiles/profile.model.js";
import Post from "../src/modules/posts/post.model.js";
import HallOfFame from "../src/modules/hallOfFame/hof.model.js";
import Notification from "../src/modules/notifications/notification.model.js";
import CollegeRecord from "../src/modules/directory/collegeRecord.model.js";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is required");
  process.exit(1);
}

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "Demo@1234";

const alumniFixtures = [
  {
    slug: "sana-ahmed",
    firstName: "Sana",
    lastName: "Ahmed",
    email: "sana.ahmed@alumni.iitp.ac.in",
    batchLabel: "Batch '16",
    gradYear: 2016,
    phone: "+91 98111 23567",
    department: "Computer Science",
    company: "Atlassian",
    title: "Senior Product Manager",
    headline: "Senior PM · Atlassian",
    focus: "Product mentoring, B2B SaaS, and early-career PM coaching.",
    city: "Bengaluru",
    country: "India",
    region: "India",
    chapter: "Bengaluru",
    domain: "Product",
    years: "8 years",
    supportModes: ["Referrals", "Mentorship"],
    skills: ["Product Strategy", "Growth", "APM Hiring", "Analytics"],
    referralOpen: true,
    about:
      "Leads product bets at Atlassian across B2B growth surfaces. Known in the IIT Patna network for structured PM mentorship.",
  },
  {
    slug: "arjun-mehta",
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun.mehta@alumni.iitp.ac.in",
    batchLabel: "Batch '15",
    gradYear: 2015,
    phone: "+65 8890 1256",
    department: "Computer Science",
    company: "Stripe",
    title: "Staff Engineer",
    headline: "Staff Engineer · Stripe",
    focus: "Backend systems, interview prep, and distributed systems guidance.",
    city: "Singapore",
    country: "Singapore",
    region: "APAC",
    chapter: "Singapore",
    domain: "Engineering",
    years: "10 years",
    supportModes: ["Referrals", "Mock Interviews"],
    skills: ["Backend", "System Design", "Distributed Systems", "Reliability"],
    referralOpen: true,
    about: "Builds distributed systems at Stripe and helps students prepare for backend interviews.",
  },
  {
    slug: "priya-menon",
    firstName: "Priya",
    lastName: "Menon",
    email: "priya.menon@alumni.iitp.ac.in",
    batchLabel: "Batch '14",
    gradYear: 2014,
    phone: "+44 7400 990112",
    department: "Electronics & Communication",
    company: "WaveStack",
    title: "Founder",
    headline: "Founder · WaveStack",
    focus: "Startups, operator coaching, and product strategy.",
    city: "London",
    country: "UK",
    region: "Europe",
    chapter: "London",
    domain: "Founder",
    years: "9 years",
    supportModes: ["Referrals", "Founder Office Hours"],
    skills: ["Startups", "Product Strategy", "GTM", "Operations"],
    referralOpen: true,
    about: "Founder-operator helping students think through startup roles and execution.",
  },
  {
    slug: "neha-kapoor",
    firstName: "Neha",
    lastName: "Kapoor",
    email: "neha.kapoor@alumni.iitp.ac.in",
    batchLabel: "Batch '17",
    gradYear: 2017,
    phone: "+91 98100 44112",
    department: "Design",
    company: "Google",
    title: "Lead UX Designer",
    headline: "Lead UX Designer · Google",
    focus: "Portfolio reviews, UX research coaching, and design storytelling.",
    city: "Delhi NCR",
    country: "India",
    region: "India",
    chapter: "Delhi NCR",
    domain: "Design",
    years: "7 years",
    supportModes: ["Mentorship", "Portfolio Reviews"],
    skills: ["UX Design", "Research", "Figma", "Storytelling"],
    referralOpen: false,
    about: "Design leadership and mentorship for product teams.",
  },
  {
    slug: "rohan-iyer",
    firstName: "Rohan",
    lastName: "Iyer",
    email: "rohan.iyer@alumni.iitp.ac.in",
    batchLabel: "Batch '18",
    gradYear: 2018,
    phone: "+1 415 555 0199",
    department: "Computer Science",
    company: "Northstar AI",
    title: "Data Scientist",
    headline: "Data Scientist · Northstar AI",
    focus: "Data-science mentorship, experimentation systems, and analytics career guidance.",
    city: "San Francisco",
    country: "USA",
    region: "North America",
    chapter: "San Francisco",
    domain: "Data",
    years: "6 years",
    supportModes: ["Referrals", "Mentorship"],
    skills: ["Data Science", "ML", "Analytics", "Experimentation"],
    referralOpen: true,
    about: "Analytics and experimentation focus with a strong alumni mentorship presence.",
  },
  {
    slug: "meera-joshi",
    firstName: "Meera",
    lastName: "Joshi",
    email: "meera.joshi@alumni.iitp.ac.in",
    batchLabel: "Batch '20",
    gradYear: 2020,
    phone: "+31 6 1234 5678",
    department: "Computer Science",
    company: "OrbitPay",
    title: "Mobile Platform Engineer",
    headline: "Mobile Platform Engineer · OrbitPay",
    focus: "Mobile systems, platform engineering, and interview prep for app teams.",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    chapter: "Amsterdam",
    domain: "Engineering",
    years: "5 years",
    supportModes: ["Mentorship", "Career Prep"],
    skills: ["Android", "iOS", "Platform", "Architecture"],
    referralOpen: false,
    about: "Platform engineer focused on mobile systems and practical interview prep.",
  },
];

async function upsertAlumni(row) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  let user = await User.findOne({ email: row.email.toLowerCase() });
  if (!user) {
    user = await User.create({
      firstName: row.firstName,
      lastName: row.lastName,
      batchLabel: row.batchLabel,
      email: row.email.toLowerCase(),
      passwordHash,
      role: "alumni",
      phone: row.phone,
      department: row.department,
      gradYear: row.gradYear,
      currentCompany: row.company,
    });
  }

  await Profile.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      role: "alumni",
      fullName: `${row.firstName} ${row.lastName}`,
      displaySlug: row.slug,
      department: row.department,
      currentCompany: row.company,
      currentJobTitle: row.title,
      headline: row.headline,
      focus: row.focus,
      city: row.city,
      country: row.country,
      region: row.region,
      chapter: row.chapter,
      domain: row.domain,
      yearsExperience: row.years,
      supportModes: row.supportModes,
      skills: row.skills,
      referralOpen: row.referralOpen,
      about: row.about,
      showInDirectory: true,
      profileComplete: true,
      linkedinUrl: `linkedin.com/in/${row.slug}`,
      portfolioUrl: `${row.slug}.portfolio`,
      referralTarget: row.referralOpen
        ? {
            title: `Request a referral from ${row.firstName}`,
            description: `Students can reach out for roles aligned with ${row.domain.toLowerCase()}.`,
            openings: row.skills.slice(0, 3),
            note: "Keep the request concise and explain fit.",
          }
        : null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return user;
}

async function seedHallOfFame() {
  const count = await HallOfFame.countDocuments();
  if (count > 0) return;

  await HallOfFame.insertMany([
    {
      name: "Sundar Pichai",
      department: "Metallurgical Engineering",
      batchYear: 1993,
      currentRole: "CEO, Alphabet & Google",
      category: "corporate_leader",
      achievement: "Leading one of the world's most influential technology companies.",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      linkedinUrl: null,
      displayOrder: 1,
    },
    {
      name: "Nikesh Arora",
      department: "Electrical Engineering",
      batchYear: 1989,
      currentRole: "CEO, Palo Alto Networks",
      category: "corporate_leader",
      achievement: "Transforming global cybersecurity through cloud-native platforms.",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      displayOrder: 2,
    },
    {
      name: "Arvind Krishna",
      department: "Electrical Engineering",
      batchYear: 1985,
      currentRole: "CEO, IBM",
      category: "corporate_leader",
      achievement: "Advancing hybrid cloud and quantum computing at global scale.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      displayOrder: 3,
    },
  ]);
}

async function seedWelcomeNotification() {
  const user = await User.findOne({ email: "sana.ahmed@alumni.iitp.ac.in" });
  if (!user) return;

  const existing = await Notification.countDocuments({ userId: user._id, type: "welcome" });
  if (existing > 0) return;

  await Notification.create({
    userId: user._id,
    type: "welcome",
    text: "Welcome back to Alumni Sangham. Your directory profile is live for students.",
    link: "/directory",
    isRead: false,
  });
}

async function seedCollegeRecords() {
  const count = await CollegeRecord.countDocuments();
  if (count > 0) return;

  await CollegeRecord.insertMany([
    {
      rollNumber: "2201CS01",
      enrollmentNumber: "EN2201CS01",
      name: "Demo Student Record",
      department: "Computer Science",
      batchYear: 2026,
      recordType: "student",
    },
    {
      rollNumber: "1601CS88",
      name: "Demo Alumni Record",
      department: "Computer Science",
      batchYear: 2020,
      recordType: "alumni",
    },
  ]);
}

async function seedPosts(usersBySlug) {
  const author = usersBySlug.get("sana-ahmed");
  if (!author) return;

  const count = await Post.countDocuments({ postType: "discussion" });
  if (count > 0) return;

  await Post.create({
    authorId: author._id,
    authorName: "Sana Ahmed",
    authorBatch: 2016,
    postType: "discussion",
    title: "PM internship openings for July 2026",
    body: "We are screening for early-career product candidates. Keep your profile complete and resume public.",
    community: "r/product-careers",
    tag: "Referral drop",
    authorMeta: "Alumni · Atlassian",
    upvotes: 128,
    commentsCount: 24,
  });
}

async function main() {
  await mongoose.connect(uri);
  console.log("Connected. Seeding...");

  const map = new Map();
  for (const row of alumniFixtures) {
    const user = await upsertAlumni(row);
    map.set(row.slug, user);
  }

  await seedPosts(map);
  await seedHallOfFame();
  await seedWelcomeNotification();
  await seedCollegeRecords();

  console.log(`Done. Demo alumni password (unless overridden): ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
