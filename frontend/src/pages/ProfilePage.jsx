import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { fetchMyProfile, fetchPublicProfile } from '../lib/api';
import { MessageSquare, Upload, Eye } from 'lucide-react';

// Indian States for Address Dropdown
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function CardHeader({ title, onEdit, isEditing, onSave, onCancel }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900">{title}</h3>
      {isEditing ? (
        <div className="flex gap-3">
          <button onClick={onCancel} className="text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors">
            Cancel
          </button>
          <button onClick={onSave} className="text-[11px] font-bold tracking-widest uppercase text-black hover:opacity-70 transition-colors">
            Save
          </button>
        </div>
      ) : (
        <button onClick={onEdit} className="text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
          Edit
        </button>
      )}
    </div>
  );
}

function ProfileHeaderCard({ profile, isOwnProfile }) {
  const avatarUrl = profile?.avatarUrl || profile?.profileImage || profile?.image || profile?.avatar || profile?.picture || "https://images.unsplash.com/photo-1549480017-d773068e594d?q=80&w=2674&auto=format&fit=crop";
  const name = profile?.name || "Prateek Gupta";
  const title = profile?.title || "Software Engineer at Apple";

  return (
    <div className="bg-white px-10 py-10 rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6 flex justify-between items-center border border-gray-100/50">
      <div className="flex items-center gap-8">
        <div className="w-24 h-24 rounded overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-black/5">
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-1">{name}</h1>
          <p className="text-sm font-medium text-gray-500 mb-5">{title}</p>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#111]">
            <button className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              Upload Resume
            </button>
            <div className="w-px h-3 bg-gray-200"></div>
            <button className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              View Profile
            </button>
          </div>
        </div>
      </div>
      {isOwnProfile && (
        <button className="bg-black text-white text-xs font-bold uppercase tracking-[0.15em] px-8 py-3.5 hover:bg-gray-800 transition-colors rounded-[2px] shadow-sm">
          Edit Profile
        </button>
      )}
    </div>
  );
}

function PersonalInfoCard({ profile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    firstName: "Prateek",
    lastName: "Gupta",
    email: "p.gupta@apple.com",
    phone: "+1 (213) 555-1234",
    gender: "Male",
    dob: "May 15, 1998" // Assuming YYYY-MM-DD normally, using explicit string for UI prototype
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div id="personal-info" className="bg-white px-10 pt-10 pb-12 rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6 border border-gray-100/50 scroll-mt-12">
      <CardHeader title="Personal Information" isEditing={isEditing} onEdit={() => setIsEditing(true)} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
      
      <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
        {[
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Phone", name: "phone" },
          { label: "Gender", name: "gender" },
          { label: "Date of Birth", name: "dob" }
        ].map(field => (
          <div key={field.name}>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{field.label}</div>
            {isEditing ? (
              field.name === 'gender' ? (
                <select name={field.name} value={data[field.name]} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : field.name === 'dob' ? (
                 <input type="text" name={field.name} value={data[field.name]} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" placeholder="Month DD, YYYY" />
              ) : (
                <input type={field.type || "text"} name={field.name} value={data[field.name]} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" />
              )
            ) : (
              <div className="text-sm font-semibold text-gray-900">{data[field.name]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressCard({ profile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    fullAddress: "Cupertino HQ, One Apple Park Way",
    cityState: "Cupertino, California",
    country: "United States"
  });
  const [isIndianLayout, setIsIndianLayout] = useState(false);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div id="address-info" className="bg-white px-10 pt-10 pb-12 rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6 border border-gray-100/50 scroll-mt-12">
      <CardHeader title="Location & Address" isEditing={isEditing} onEdit={() => setIsEditing(true)} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
      
      {isEditing && (
         <div className="mb-6 flex items-center justify-end gap-3 text-xs font-semibold text-gray-600">
             <span>Indian Layout Format</span>
             <button onClick={() => setIsIndianLayout(!isIndianLayout)} className={`w-10 h-5 rounded-full relative transition-colors ${isIndianLayout ? 'bg-black' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${isIndianLayout ? 'left-5' : 'left-0.5'}`}></div>
             </button>
         </div>
      )}

      <div className="flex flex-col gap-y-10 mt-8">
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Address</div>
          {isEditing ? (
            <input name="fullAddress" value={data.fullAddress} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" />
          ) : (
            <div className="text-sm font-semibold text-gray-900">{data.fullAddress}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-12">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{isIndianLayout ? "State" : "City / State"}</div>
            {isEditing ? (
               isIndianLayout ? (
                 <select name="cityState" value={INDIAN_STATES.includes(data.cityState) ? data.cityState : INDIAN_STATES[0]} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               ) : (
                 <input name="cityState" value={data.cityState} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" />
               )
            ) : (
              <div className="text-sm font-semibold text-gray-900">{data.cityState}</div>
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Country</div>
            {isEditing ? (
              <input name="country" value={data.country} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" />
            ) : (
              <div className="text-sm font-semibold text-gray-900">{data.country}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AcademicRecordsCard({ profile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    institution: "IIT Patna",
    batch: "Class of 2020"
  });

  const BRANCHES = ["Computer Science & Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"];

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div id="academic-info" className="bg-white px-10 pt-10 pb-12 rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6 border border-gray-100/50 scroll-mt-12">
      <CardHeader title="Academic Records" isEditing={isEditing} onEdit={() => setIsEditing(true)} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
      
      <div className="grid grid-cols-2 gap-y-10 gap-x-12 mt-8">
        <div>
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Degree</div>
           {isEditing ? <input name="degree" value={data.degree} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" /> : <div className="text-sm font-semibold text-gray-900">{data.degree}</div>}
        </div>
        <div>
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Branch</div>
           {isEditing ? (
             <select name="branch" value={data.branch} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors">
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
             </select>
           ) : <div className="text-sm font-semibold text-gray-900">{data.branch}</div>}
        </div>
        <div>
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Institution</div>
           {isEditing ? <input name="institution" value={data.institution} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" /> : <div className="text-sm font-semibold text-gray-900">{data.institution}</div>}
        </div>
        <div>
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Batch</div>
           {isEditing ? <input name="batch" value={data.batch} onChange={handleChange} className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-2 outline-none focus:border-black transition-colors" /> : <div className="text-sm font-semibold text-gray-900">{data.batch}</div>}
        </div>
      </div>
    </div>
  );
}

function ProfessionalJourneyCard({ profile }) {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      dateRange: "2022 \u2014 PRESENT",
      role: "Senior Software Engineer",
      company: "Apple Inc.",
      description: "Leading the performance optimization for core system frameworks."
    },
    {
      id: 2,
      dateRange: "2020 \u2014 2022",
      role: "Software Engineer",
      company: "Microsoft",
      description: "Developed cloud-scale services for Azure infrastructure."
    }
  ]);

  return (
    <div id="professional-journey" className="bg-white px-10 pt-10 pb-12 rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-12 border border-gray-100/50 scroll-mt-12">
      <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-8">
        <h3 className="text-[13px] font-bold tracking-[0.2em] uppercase text-gray-900">Professional Journey</h3>
        <button className="text-[10px] font-bold tracking-[0.15em] uppercase text-black border border-black px-6 py-2.5 rounded-[2px] hover:bg-black hover:text-white transition-all">
          Add New Entry
        </button>
      </div>

      <div className="relative pl-6 border-l border-gray-200 space-y-16 py-2">
        {experiences.map((exp, idx) => (
          <div key={exp.id} className="relative">
            <div className={`absolute -left-[30px] w-2 h-2 rounded-full border-2 border-white top-1 ${idx === 0 ? 'bg-black' : 'bg-gray-300'}`}></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">{exp.dateRange}</span>
              <h4 className="text-lg font-bold text-gray-900 tracking-tight leading-tight mb-2 flex items-center justify-between group">
                 {exp.role}
                 <button className="text-[9px] font-bold tracking-widest text-gray-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity pr-4 hover:text-gray-900">Edit</button>
              </h4>
              <span className="text-sm font-semibold text-gray-500 mb-3 block">{exp.company}</span>
              <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal-info');
  const params = useParams();
  const { user } = useOutletContext();
  const isOwnProfile = !params.profileId || params.profileId === 'me';
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['personal-info', 'address-info', 'academic-info', 'professional-journey'];
      let current = '';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            current = section;
          }
        }
      }
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="w-full max-w-[1200px] mx-auto px-6 py-12 flex gap-16 relative">
        
        {/* Left Navigation Sidebar */}
        <div className="w-56 shrink-0 sticky top-12 h-[calc(100vh-6rem)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-10 pl-4">Account Settings</div>
            
            <nav className="flex flex-col space-y-6">
              {[
                { id: 'personal-info', label: 'Personal Information' },
                { id: 'address-info', label: 'Address Info' },
                { id: 'academic-info', label: 'Academic Info' },
                { id: 'professional-journey', label: 'Professional Journey' }
              ].map(item => {
                const isActive = activeSection === item.id;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => scrollTo(item.id)}
                    className="flex items-center text-left transition-all"
                  >
                    <div className={`w-4 flex justify-center text-black mr-2 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      •
                    </div>
                    <span className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'font-semibold text-gray-400 hover:text-gray-600'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mb-8 pl-4">
             <button className="bg-black text-white w-full py-4 flex items-center justify-center gap-2.5 rounded-[2px] transition hover:bg-gray-800 shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Ask Request</span>
             </button>
          </div>
        </div>

        {/* Right Scrollable Cards */}
        <div className="flex-1">
          <ProfileHeaderCard profile={profile} isOwnProfile={isOwnProfile} />
          <PersonalInfoCard profile={profile} />
          <AddressCard profile={profile} />
          <AcademicRecordsCard profile={profile} />
          <ProfessionalJourneyCard profile={profile} />

          <div className="text-center pb-[30vh]">
            <p className="text-[11px] font-semibold text-gray-500 tracking-wide text-center pt-8">
              © 2026 Indian Institute of Technology Patna. Professional Academic Network.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
