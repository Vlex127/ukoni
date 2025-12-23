"use client";

import { useState, useEffect, useRef } from "react";
import {
  Archive,
  ArrowLeft,
  Bold,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  File,
  Image as ImageIcon,
  Italic,
  LayoutTemplate,
  List,
  Mail,
  Menu,
  MousePointer2,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  X,
  Loader2,
  BarChart3
} from "lucide-react";

// Types
type Campaign = {
  id: number | string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  createdAt: string;
  audience?: string;
  scheduledAt?: string;
  stats?: {
    open: string;
    click: string;
  };
};

export default function MailPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedMail, setSelectedMail] = useState<string | number | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Campaign | null>(null);
  
  // Data State
  const [subscriberData, setSubscriberData] = useState({ totalActive: 0, totalAll: 0 });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to determine if we are in "Detail Mode" (Mobile logic)
  const isDetailView = selectedMail !== null || isComposing || editingDraft !== null;

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(r => setTimeout(r, 600)); 
      
      const [subRes, emailRes] = await Promise.all([
        fetch('/api/subscribers'),
        fetch('/api/emails')
      ]);
      
      const subData = await subRes.json();
      const emailData = await emailRes.json();

      setSubscriberData(subData);
      setCampaigns(Array.isArray(emailData) ? emailData : []);
    } catch (error) {
      console.error("Failed to load data", error);
      setCampaigns([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Filtering Logic ---
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesTab = 
      activeTab === 'All' || 
      campaign.status.toLowerCase() === activeTab.toLowerCase().slice(0, -1) || 
      campaign.status.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch = 
      searchQuery === '' || 
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.content && campaign.content.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const handleDeleteDraft = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    try {
      const response = await fetch('/api/emails/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchData();
        setSelectedMail(null);
      }
    } catch (error) {
      alert('Failed to delete draft');
    }
  };

  // --- View Switcher ---
  const renderMainContent = () => {
    if (isComposing || editingDraft) {
      return (
        <ComposeView 
          onCancel={() => {
            setIsComposing(false);
            setEditingDraft(null);
          }} 
          subscriberData={subscriberData} 
          refreshCampaigns={fetchData}
          editingDraft={editingDraft}
        />
      );
    }
    
    if (selectedMail !== null) {
      const mail = campaigns.find((m) => m.id === selectedMail);
      return (
        <DetailView 
          mail={mail} 
          onBack={() => setSelectedMail(null)} 
          onEditDraft={(draft) => {
            setEditingDraft(draft);
            setSelectedMail(null);
          }}
          onDeleteDraft={handleDeleteDraft}
        />
      );
    }
    return <EmptyState onCompose={() => setIsComposing(true)} />;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      
      {/* SIDEBAR (List View) 
        - Mobile: Hidden if viewing a detail
        - Desktop: Always visible (w-96)
      */}
      <div className={`
        flex-col border-r border-slate-200 bg-white shadow-sm z-10 transition-all duration-300
        ${isDetailView ? 'hidden lg:flex' : 'flex w-full'} 
        lg:w-96 shrink-0
      `}>
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
                <Mail size={20} />
             </div>
             <div>
               <h1 className="text-lg font-bold text-slate-900 leading-none">Campaigns</h1>
               <p className="text-xs text-slate-500 mt-1 font-medium">Newsletter Manager</p>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { setSelectedMail(null); setIsComposing(true); }}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-100"
            >
              <Plus size={16} /> <span className="hidden sm:inline">New Email</span><span className="sm:hidden">New</span>
            </button>
            <button 
              onClick={async () => {
                  try {
                    await fetch('/api/admin/trigger-scheduled', { method: 'POST' });
                    fetchData();
                  } catch (e) {}
              }}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <CalendarIcon size={16} /> <span className="hidden sm:inline">Sync Schedule</span><span className="sm:hidden">Sync</span>
            </button>
          </div>

          <div className="relative group">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
             <input
               type="text"
               placeholder="Search campaigns..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent border focus:bg-white focus:border-indigo-200 rounded-lg text-sm transition-all focus:ring-4 focus:ring-indigo-50/50 outline-none"
             />
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold overflow-x-auto no-scrollbar">
            {["All", "Drafts", "Sent", "Scheduled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 px-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
                <p className="text-xs text-slate-400">Loading...</p>
             </div>
          ) : filteredCampaigns.length === 0 ? (
             <div className="text-center py-10 px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-900">No emails found</p>
             </div>
          ) : (
             <div className="divide-y divide-slate-50 pb-20 lg:pb-0">
                {filteredCampaigns.map((item) => {
                  const dateObj = item.createdAt ? new Date(item.createdAt) : new Date();
                  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const isActive = selectedMail === item.id;

                  return (
                    <div 
                      key={item.id}
                      onClick={() => { setIsComposing(false); setSelectedMail(item.id); }}
                      className={`p-4 cursor-pointer transition-all hover:bg-slate-50 border-l-4 ${
                        isActive 
                        ? "bg-indigo-50/60 border-indigo-500" 
                        : "border-transparent"
                      }`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-semibold text-sm truncate pr-2 max-w-[70%] ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>
                             {item.subject || 'Untitled Draft'}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{dateStr}</span>
                       </div>
                       
                       <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                          {item.content?.replace(/<[^>]*>?/gm, '') || 'No content...'}
                       </p>

                       <div className="flex items-center gap-2">
                          <StatusDot status={item.status} />
                          <span className="text-[10px] font-medium text-slate-400 capitalize">{item.status || 'Draft'}</span>
                       </div>
                    </div>
                  );
                })}
             </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT (Detail View)
        - Mobile: Hidden if NOT viewing detail (List Mode)
        - Desktop: Always visible (flex-1)
      */}
      <div className={`
        flex-1 bg-slate-50 h-full overflow-hidden flex flex-col relative w-full
        ${!isDetailView ? 'hidden lg:flex' : 'flex'}
      `}>
         {renderMainContent()}
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatusDot({ status }: { status?: string }) {
  const color = 
    status === 'sent' ? 'bg-emerald-500' : 
    status === 'scheduled' ? 'bg-amber-500' : 
    'bg-slate-300';
    
  return <div className={`w-2 h-2 rounded-full ${color}`} />;
}

// 1. Empty State
function EmptyState({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
       <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-100 mb-6">
          <LayoutTemplate size={40} className="text-indigo-200 lg:w-12 lg:h-12" />
       </div>
       <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2">Select a Campaign</h2>
       <p className="text-slate-500 max-w-xs lg:max-w-md mb-8 leading-relaxed text-sm lg:text-base">
         Choose a newsletter from the list or start a new campaign.
       </p>
       <button 
          onClick={onCompose}
          className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95 text-sm lg:text-base"
       >
          Start New Campaign
       </button>
    </div>
  );
}

// 2. Detail View
function DetailView({ mail, onBack, onEditDraft, onDeleteDraft }: { 
  mail?: Campaign, 
  onBack: () => void,
  onEditDraft?: (draft: Campaign) => void,
  onDeleteDraft?: (id: string | number) => void
}) {
   if (!mail) return null;
   
   const date = new Date(mail.createdAt).toLocaleDateString('en-US', { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
   });

   return (
      <div className="flex flex-col h-full bg-slate-50/50 w-full">
         {/* Top Bar */}
         <div className="h-16 px-4 lg:px-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-3">
               <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition lg:hidden text-slate-600">
                  <ArrowLeft size={20}/>
               </button>
               <div className="flex items-center gap-2">
                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    mail.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                    mail.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                 }`}>
                    {mail.status || 'Draft'}
                 </span>
               </div>
            </div>
            
            <div className="flex gap-1 lg:gap-2">
               {mail.status === "draft" && (
                  <>
                    <button 
                       onClick={() => onDeleteDraft && onDeleteDraft(mail.id)}
                       className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                       title="Delete Draft"
                    >
                       <Trash2 size={18} />
                    </button>
                    <button 
                       onClick={() => onEditDraft && onEditDraft(mail)}
                       className="px-3 lg:px-4 py-2 bg-indigo-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                    >
                       <File size={14} className="lg:w-4 lg:h-4" /> <span className="hidden sm:inline">Edit Campaign</span><span className="sm:hidden">Edit</span>
                    </button>
                  </>
               )}
            </div>
         </div>

         {/* Content Scroll Area */}
         <div className="flex-1 overflow-y-auto p-4 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
               
               {/* Header Info */}
               <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight mb-4 break-words">{mail.subject}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 pb-6 border-b border-slate-200">
                     <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-slate-400" />
                        <span>{date}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Users size={16} className="text-slate-400" />
                        <span>To: <span className="font-semibold text-slate-700">{mail.audience || 'All Subscribers'}</span></span>
                     </div>
                  </div>
               </div>

               {/* Stats Cards */}
               {mail.status === "sent" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                     <StatCard label="Open Rate" value={mail.stats?.open} icon={<MousePointer2 size={18} />} color="text-indigo-600" bg="bg-indigo-50" />
                     <StatCard label="Click Rate" value={mail.stats?.click} icon={<CheckCircle2 size={18} />} color="text-emerald-600" bg="bg-emerald-50" />
                     <StatCard label="Engagement" value="High" icon={<BarChart3 size={18} />} color="text-amber-600" bg="bg-amber-50" />
                  </div>
               )}

               {/* Email Preview Frame */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  </div>
                  <div 
                     className="p-4 lg:p-8 prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-900 min-h-[400px] text-sm lg:text-base"
                     dangerouslySetInnerHTML={{ __html: mail.content || '<p class="text-slate-400 italic text-center py-20">No content available</p>' }} 
                  />
               </div>

            </div>
         </div>
      </div>
   );
}

function StatCard({ label, value, icon, color, bg }: any) {
   return (
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
         <div className={`p-3 rounded-lg ${bg} ${color}`}>
            {icon}
         </div>
         <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-slate-900">{value || '0%'}</p>
         </div>
      </div>
   )
}

// 3. Compose View
function ComposeView({ onCancel, subscriberData, refreshCampaigns, editingDraft }: { 
  onCancel: () => void, 
  subscriberData: any, 
  refreshCampaigns: () => void,
  editingDraft?: Campaign | null
}) {
   const [subject, setSubject] = useState(editingDraft?.subject || '');
   const [content, setContent] = useState(editingDraft?.content || ''); 
   const [audience, setAudience] = useState(editingDraft?.audience || 'all');
   const [statusMsg, setStatusMsg] = useState('');
   const [isProcessing, setIsProcessing] = useState(false);
   const [scheduledTime, setScheduledTime] = useState('');
   
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const applyFormat = (format: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      
      let formattedText = '';
      switch (format) {
         case 'bold': formattedText = `**${selectedText}**`; break;
         case 'italic': formattedText = `*${selectedText}*`; break;
         case 'list': formattedText = `\n- ${selectedText}`; break;
         default: return;
      }

      const newContent = content.substring(0, start) + formattedText + content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }, 0);
   };

   const handleSubmit = async (action: 'draft' | 'send' | 'schedule') => {
      if (!subject && !content) {
         setStatusMsg('Please add content.');
         return;
      }
      setIsProcessing(true);
      setStatusMsg('');

      const payload = {
         id: editingDraft?.id,
         subject,
         content,
         audience,
         status: action === 'send' ? 'sent' : action === 'schedule' ? 'scheduled' : 'draft',
         scheduledAt: action === 'schedule' ? scheduledTime : undefined
      };

      try {
         const endpoint = action === 'send' ? '/api/send-email' : '/api/emails';
         const method = editingDraft && action !== 'send' ? 'PUT' : 'POST';

         const res = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });

         if (res.ok) {
            refreshCampaigns();
            if (action === 'draft') {
               setStatusMsg('Saved!');
               setTimeout(() => setStatusMsg(''), 3000);
            } else {
               onCancel();
            }
         } else {
            setStatusMsg('Failed.');
         }
      } catch (err) {
         setStatusMsg('Error.');
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom-4 duration-300 w-full">
         
         {/* Top Bar */}
         <div className="h-16 px-4 lg:px-6 border-b border-slate-100 flex justify-between items-center bg-white z-20 shrink-0">
            <h2 className="font-bold text-base lg:text-lg text-slate-800 flex items-center gap-2">
               {editingDraft ? 'Edit Campaign' : 'New Campaign'}
            </h2>
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition">
               <X size={20} />
            </button>
         </div>

         <div className="flex flex-1 overflow-hidden">
            {/* Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Meta Inputs */}
                <div className="px-4 lg:px-8 py-4 lg:py-6 space-y-4 lg:space-y-6 shrink-0 overflow-y-auto max-h-[40vh] lg:max-h-none">
                   <div className="group">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                      <input 
                         type="text" 
                         value={subject}
                         onChange={(e) => setSubject(e.target.value)}
                         placeholder="Email Subject..." 
                         className="w-full text-xl lg:text-2xl font-bold text-slate-900 placeholder:text-slate-300 border-none p-0 focus:ring-0 bg-transparent"
                         autoFocus
                      />
                   </div>

                   <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                      <div className="flex-1">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Audience</label>
                         <div className="relative">
                            <select 
                               value={audience}
                               onChange={(e) => setAudience(e.target.value)}
                               className="w-full bg-slate-50 border-none rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                            >
                               <option value="all">All Subscribers ({subscriberData.totalAll || 0})</option>
                               <option value="active">Active Only ({subscriberData.totalActive || 0})</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                         </div>
                      </div>
                      
                      {/* Formatting Tools */}
                      <div className="flex-1">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tools</label>
                         <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg w-fit">
                            <ToolbarBtn icon={<Bold size={16} />} onClick={() => applyFormat('bold')} />
                            <ToolbarBtn icon={<Italic size={16} />} onClick={() => applyFormat('italic')} />
                            <ToolbarBtn icon={<List size={16} />} onClick={() => applyFormat('list')} />
                            <div className="w-px h-4 bg-slate-300 mx-1"></div>
                            <ToolbarBtn icon={<ImageIcon size={16} />} onClick={() => {}} />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="h-px bg-slate-100 w-full mx-auto max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-4rem)] shrink-0" />

                {/* Main Text Area */}
                <textarea 
                   ref={textareaRef}
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   className="flex-1 w-full px-4 lg:px-8 py-4 lg:py-6 outline-none resize-none text-slate-600 leading-relaxed text-sm lg:text-base font-serif"
                   placeholder="Start writing..."
                ></textarea>
            </div>
         </div>

         {/* Bottom Action Bar */}
         <div className="p-3 lg:p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/95 backdrop-blur-md sticky bottom-0 z-30 shrink-0">
            <div className="text-sm font-medium w-full sm:w-auto text-center sm:text-left order-2 sm:order-1">
               {isProcessing ? (
                  <span className="flex items-center justify-center sm:justify-start gap-2 text-indigo-600"><Loader2 size={14} className="animate-spin" /> Saving...</span>
               ) : statusMsg ? (
                  <span className={statusMsg.includes('Failed') ? 'text-red-500' : 'text-emerald-600'}>{statusMsg}</span>
               ) : (
                  <span className="text-slate-400 text-xs hidden sm:inline">Markdown supported</span>
               )}
            </div>
            
            <div className="flex w-full sm:w-auto gap-2 items-center order-1 sm:order-2 justify-between sm:justify-end">
               <button 
                  onClick={() => handleSubmit('draft')}
                  disabled={isProcessing}
                  className="px-3 py-2 text-slate-600 text-xs lg:text-sm font-semibold hover:bg-slate-100 rounded-lg transition whitespace-nowrap"
               >
                  Save Draft
               </button>

               <div className="flex items-center gap-1">
                 {/* Mobile condensed date input */}
                 <div className="flex items-center bg-slate-100 rounded-lg p-1">
                     <input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="bg-transparent border-none text-[10px] lg:text-xs text-slate-600 py-1 px-1 lg:px-2 w-28 lg:w-36 focus:ring-0"
                     />
                     <button 
                        onClick={() => handleSubmit('schedule')}
                        disabled={!scheduledTime || isProcessing}
                        className="p-1.5 text-amber-600 hover:bg-white rounded-md transition shadow-sm disabled:opacity-50 disabled:shadow-none"
                     >
                        <CalendarIcon size={16} />
                     </button>
                 </div>

                 <button 
                    onClick={() => handleSubmit('send')}
                    disabled={isProcessing}
                    className="px-4 lg:px-6 py-2 bg-indigo-600 text-white text-xs lg:text-sm font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70"
                 >
                    <Send size={14} className="lg:w-4 lg:h-4" /> <span className="hidden sm:inline">Send</span>
                 </button>
               </div>
            </div>
         </div>
      </div>
   );
}

function ToolbarBtn({ icon, onClick }: { icon: any, onClick?: () => void }) {
   return (
      <button 
         onClick={onClick}
         className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-md transition"
      >
         {icon}
      </button>
   );
}