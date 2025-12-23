"use client";
import { useState, useEffect } from "react";
import {
  Camera,
  Check,
  Globe,
  Mail,
  MapPin,
  Save,
  Shield,
  User,
  X,
  Facebook,
  Linkedin,
  Bell
} from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  about: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  facebook: string | null;
  emailVerified: boolean;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    about: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: '',
    facebook: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionToken = localStorage.getItem('session_token');
        if (!sessionToken) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            about: data.user.about || '',
            location: data.user.location || '',
            website: data.user.website || '',
            twitter: data.user.twitter || '',
            linkedin: data.user.linkedin || '',
            facebook: data.user.facebook || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        alert('No session found');
        return;
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* --- Header / Cover Section --- */}
      <div className="relative mb-20">
        {/* Cover Image */}
        <div className="h-64 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] relative overflow-hidden shadow-sm">
          {/* Abstract Pattern overlay */}
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          {/* Change Cover Button */}
          <button className="absolute bottom-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition border border-white/20">
             <Camera size={16} /> Change Cover
          </button>
        </div>

        {/* Profile Info Float */}
        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end gap-6">
          {/* Avatar with Status Indicator */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-xl">
               <div className="w-full h-full bg-gray-200 rounded-[1.7rem] relative overflow-hidden">
                  {/* Replace with actual image */}
                  {user?.picture ? (
                    <Image src={user.picture} alt="User" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <User size={48} />
                    </div>
                  )}
               </div>
            </div>
            {/* Edit Avatar Button */}
            <button className="absolute bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition border-4 border-white">
               <Camera size={14} />
            </button>
          </div>

          {/* Name & Role (Visible on larger screens) */}
          <div className="mb-2 hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-gray-500 font-medium">Senior Administrator & Editor</p>
          </div>
        </div>
        
        {/* Mobile Name Fallback */}
        <div className="md:hidden mt-16 px-4">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-gray-500 font-medium">Senior Administrator</p>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-12 gap-8 mt-4">
        
        {/* Left Column: Navigation & Mini Bio (Span 4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
           
           {/* Navigation Tabs */}
           <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
              <TabButton 
                active={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")} 
                icon={<User size={18} />} 
                label="Overview" 
              />
              <TabButton 
                active={activeTab === "settings"} 
                onClick={() => setActiveTab("settings")} 
                icon={<Shield size={18} />} 
                label="Profile Settings" 
              />
               <TabButton 
                active={activeTab === "notifications"} 
                onClick={() => setActiveTab("notifications")} 
                icon={<Bell size={18} />} 
                label="Notifications" 
              />
           </div>

           {/* Contact / Social Card */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Contact Info</h3>
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <Mail size={16} />
                    </div>
                    <span>{user?.email || 'user@example.com'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                      <Globe size={16} />
                    </div>
                    <span>{user?.website || 'www.example.com'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                      <MapPin size={16} />
                    </div>
                    <span>{user?.location || 'Location not set'}</span>
                 </div>
              </div>

              <hr className="my-6 border-gray-100" />
              
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Socials</h3>
              <div className="flex gap-2">
                 {user?.twitter && (
                   <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                     <SocialButton icon={<X size={18} />} />
                   </a>
                 )}
                 {user?.linkedin && (
                   <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                     <SocialButton icon={<Linkedin size={18} />} />
                   </a>
                 )}
                 {user?.facebook && (
                   <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                     <SocialButton icon={<Facebook size={18} />} />
                   </a>
                 )}
                 {!user?.twitter && !user?.linkedin && !user?.facebook && (
                   <span className="text-sm text-gray-400">No social links added yet</span>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: Tab Content (Span 8) */}
        <div className="col-span-12 lg:col-span-8">
          
          {activeTab === "overview" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Bio Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                 <p className="text-gray-500 leading-relaxed mb-4">
                    {user?.about || 'No bio added yet. Tell us about yourself!'}
                 </p>
                 <div className="flex flex-wrap gap-2">
                    <SkillBadge label="Content Strategy" />
                    <SkillBadge label="SEO Writing" />
                    <SkillBadge label="Team Leadership" />
                    <SkillBadge label="React" />
                    <SkillBadge label="Next.js" />
                 </div>
              </div>

              {/* Activity Stats Row */}
              <div className="grid grid-cols-3 gap-6">
                 <StatCard value="85" label="Projects Done" color="text-blue-600" bg="bg-blue-50" />
                 <StatCard value="1.2M" label="Total Views" color="text-purple-600" bg="bg-purple-50" />
                 <StatCard value="4.8" label="Rating" color="text-orange-600" bg="bg-orange-50" />
              </div>

               {/* Recent Activity List */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                 <div className="space-y-6">
                    <ActivityItem 
                      title="Published a new article"
                      desc="Mastering Server Actions in Next.js 14"
                      time="2 hours ago"
                      type="post"
                    />
                    <ActivityItem 
                      title="Commented on Design Trends"
                      desc="Great insights on the color theory section..."
                      time="5 hours ago"
                      type="comment"
                    />
                    <ActivityItem 
                      title="Updated Profile Picture"
                      desc="Changed avatar image"
                      time="1 day ago"
                      type="update"
                    />
                 </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form className="space-y-6" onSubmit={handleSubmit}>
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                      <div className="flex gap-3">
                         <button type="button" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                         <button 
                           type="submit"
                           disabled={isLoading}
                           className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition flex items-center gap-2 disabled:opacity-50"
                         >
                            <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
                         </button>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <InputGroup 
                        label="Name" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <InputGroup 
                        label="Email Address" 
                        placeholder="Enter your email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <InputGroup 
                        label="Phone Number" 
                        placeholder="Enter phone number" 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <InputGroup 
                        label="Location" 
                        placeholder="Enter your location" 
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                      <InputGroup 
                        label="Website" 
                        placeholder="Enter your website" 
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Bio</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition h-32 resize-none"
                        placeholder="Tell us a little about yourself..."
                        value={formData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                      ></textarea>
                   </div>

                   <hr className="border-gray-100 my-8" />

                   <h3 className="text-lg font-bold text-gray-900 mb-4">Social Links</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <InputGroup 
                        label="X (Twitter)" 
                        placeholder="@username or profile URL" 
                        value={formData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                      />
                      <InputGroup 
                        label="LinkedIn" 
                        placeholder="LinkedIn profile" 
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <InputGroup 
                        label="Facebook" 
                        placeholder="Facebook profile" 
                        value={formData.facebook}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                      />
                   </div>
                </form>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
   return (
      <button 
         onClick={onClick}
         className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
            active 
            ? "bg-blue-50 text-blue-600" 
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
         }`}
      >
         {icon} {label}
      </button>
   );
}

function SocialButton({ icon }: { icon: any }) {
   return (
      <button className="w-10 h-10 rounded-xl border border-gray-100 text-gray-400 flex items-center justify-center hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50 transition">
         {icon}
      </button>
   );
}

function SkillBadge({ label }: { label: string }) {
   return (
      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
         {label}
      </span>
   );
}

function StatCard({ value, label, color, bg }: { value: string, label: string, color: string, bg: string }) {
   return (
      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl ${bg}`}>
         <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
         <span className="text-xs font-medium text-gray-500 mt-1">{label}</span>
      </div>
   );
}

function ActivityItem({ title, desc, time, type }: { title: string, desc: string, time: string, type: 'post' | 'comment' | 'update' }) {
   const getIcon = () => {
      if (type === 'post') return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
      if (type === 'comment') return <div className="w-2 h-2 rounded-full bg-purple-500"></div>;
      return <div className="w-2 h-2 rounded-full bg-orange-500"></div>;
   }

   return (
      <div className="flex gap-4">
         <div className="flex flex-col items-center mt-1.5">
            {getIcon()}
            <div className="w-px h-full bg-gray-100 mt-2"></div>
         </div>
         <div className="pb-6">
            <h4 className="text-sm font-bold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            <span className="text-xs text-gray-400 mt-2 block">{time}</span>
         </div>
      </div>
   );
}

function InputGroup({ label, placeholder, type = "text", value, onChange }: { 
  label: string; 
  placeholder: string; 
  type?: string; 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
   return (
      <div className="space-y-2">
         <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
         <input 
            type={type} 
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
         />
      </div>
   );
}