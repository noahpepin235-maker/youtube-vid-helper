import React, { useState } from 'react';
import { 
  Youtube, 
  Sparkles, 
  LayoutDashboard, 
  DollarSign, 
  MonitorPlay, 
  Scissors, 
  Camera,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  TrendingUp,
  Download,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { generateCreatorGuide } from './services/gemini';
import { AppState, GenerationStatus, CreatorGuide } from './types';
import SoftwareCard from './components/StrategyCard';

// --- Constants ---

const HOOK_TEMPLATES = [
  "I tried [Skill] for 30 Days",
  "The Secret to [Result] without [Pain]",
  "Stop doing [Mistake] in 2024",
  "How I Made [Amount] in [Time]",
  "[Product A] vs [Product B]: The Truth",
  "The [Topic] Iceberg Explained",
  "10 [Niche] Gadgets You Need",
  "Why [Popular Thing] is Dead",
  "Beginner's Guide to [Subject]"
];

// --- UI Helpers ---

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

// --- Page Components ---

const OverviewPage = ({ data }: { data: CreatorGuide }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Hook Card */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-white" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-indigo-300 font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Viral Hook Script
          </h3>
          <CopyButton text={data.hook} />
        </div>
        <div className="bg-black/30 rounded-lg p-4 font-serif text-lg text-slate-200 italic leading-relaxed border-l-4 border-indigo-500">
          "{data.hook}"
        </div>
        <p className="text-slate-500 text-sm mt-4">Say this in the first 0-5 seconds.</p>
      </div>

      {/* Thumbnail Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-200 font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-pink-500" /> Thumbnail Concept
          </h3>
          <CopyButton text={data.thumbnail} />
        </div>
        <p className="text-slate-300 leading-relaxed">
          {data.thumbnail}
        </p>
      </div>
    </div>

    {/* Titles */}
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-slate-200 font-bold mb-4">Title Candidates</h3>
      <div className="space-y-3">
        {data.titles.map((title, i) => (
          <div key={i} className="flex items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 group hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold">
                {i + 1}
                </span>
                <span className="text-slate-200 font-medium">{title}</span>
            </div>
            <CopyButton text={title} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MonetizationPage = ({ data }: { data: CreatorGuide }) => (
  <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
    {data.monetization.map((method, i) => (
      <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{method.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                Potential: {method.potentialEarnings}
              </span>
              <span className={`text-xs px-2 py-1 rounded border font-medium ${
                method.difficulty === 'Low' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                method.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                Difficulty: {method.difficulty}
              </span>
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed border-t border-slate-700 pt-4 mt-2">
          {method.strategy}
        </p>
      </div>
    ))}
  </div>
);

const EditingPage = ({ data }: { data: CreatorGuide }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="relative border-l-2 border-indigo-500/30 ml-3 md:ml-6 space-y-8 pb-4">
      {data.editingWorkflow.map((step, i) => (
        <div key={i} className="relative pl-8 md:pl-12 group">
          <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900 group-hover:scale-125 transition-transform"></span>
          <h3 className="text-lg font-bold text-white mb-2">{step.phase} - {step.action}</h3>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm group-hover:border-indigo-500/30 transition-colors">
            <p className="text-slate-300">{step.tips}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductionPage = ({ data }: { data: CreatorGuide }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden animate-in fade-in duration-500">
    <div className="p-6 border-b border-slate-700 bg-slate-900/50">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Camera className="w-5 h-5 text-purple-400" /> Essential Gear
      </h2>
    </div>
    <div className="p-6">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.equipment.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

function App() {
  const [idea, setIdea] = useState('');
  const [appState, setAppState] = useState<AppState>({
    status: GenerationStatus.IDLE,
    data: null,
    error: null,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'monetization' | 'software' | 'editing' | 'production'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setAppState({ status: GenerationStatus.GENERATING, data: null, error: null });
    setActiveTab('overview'); 
    
    try {
      const guide = await generateCreatorGuide(idea);
      setAppState({ status: GenerationStatus.COMPLETED, data: guide, error: null });
    } catch (err: any) {
      setAppState({ status: GenerationStatus.ERROR, data: null, error: err.message || "Failed to generate guide" });
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monetization', label: 'Monetization', icon: DollarSign },
    { id: 'software', label: 'Best Software', icon: MonitorPlay },
    { id: 'editing', label: 'Edit Guide', icon: Scissors },
    { id: 'production', label: 'Gear & Filming', icon: Camera },
  ];

  const renderContent = () => {
    if (appState.status === GenerationStatus.IDLE) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in duration-700">
          <div className="bg-indigo-500/10 p-6 rounded-full mb-6">
            <Youtube className="w-16 h-16 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your AI Studio awaits</h2>
          <p className="text-slate-400 max-w-md">
            Enter a video idea above to generate a complete production plan, software toolkit, and money-making strategy.
          </p>
        </div>
      );
    }

    if (appState.status === GenerationStatus.GENERATING) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">Analyzing Video Market...</h3>
            <p className="text-slate-400">Curating the best tools and strategies for "{idea}"</p>
          </div>
        </div>
      );
    }

    if (appState.status === GenerationStatus.ERROR) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-300 px-4">
          <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-slate-400 text-center max-w-md mb-8">
            {appState.error}
          </p>
          <button 
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      );
    }

    if (!appState.data) return null;

    switch (activeTab) {
      case 'overview': return <OverviewPage data={appState.data} />;
      case 'monetization': return <MonetizationPage data={appState.data} />;
      case 'software': return <SoftwareCard data={appState.data.software} />;
      case 'editing': return <EditingPage data={appState.data} />;
      case 'production': return <ProductionPage data={appState.data} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-md h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">CreatorFlow</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (appState.status === GenerationStatus.COMPLETED) {
                   setActiveTab(item.id as any);
                }
              }}
              disabled={appState.status !== GenerationStatus.COMPLETED}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === item.id && appState.status === GenerationStatus.COMPLETED
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && <ArrowRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
           <div className="bg-slate-800 rounded-xl p-4">
             <div className="flex items-center gap-2 mb-2 text-indigo-400">
               <TrendingUp className="w-4 h-4" />
               <span className="text-xs font-bold uppercase">Pro Tip</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
               Quality audio retains viewers longer than 4K video. Invest in a mic first.
             </p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
               <Youtube className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">CreatorFlow</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-40 bg-slate-900 lg:hidden p-4 pt-20 animate-in slide-in-from-top-10">
             <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (appState.status === GenerationStatus.COMPLETED) {
                      setActiveTab(item.id as any);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  disabled={appState.status !== GenerationStatus.COMPLETED}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 bg-slate-800'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Top Bar / Search */}
        <div className="max-w-5xl w-full mx-auto pt-8 px-6 lg:px-12">
           <div className="flex flex-col md:flex-row gap-4 mb-8 z-20 relative">
              {/* Template Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                  className="h-full px-4 bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl flex items-center gap-2 transition-all text-slate-300 hover:text-white hover:shadow-lg hover:shadow-indigo-500/10 whitespace-nowrap"
                  title="Choose a viral structure"
                >
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span className="hidden md:inline font-medium">Templates</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTemplateMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-700">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select a Structure</p>
                    </div>
                    <div className="p-1.5 grid gap-0.5 max-h-80 overflow-y-auto custom-scrollbar">
                      {HOOK_TEMPLATES.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setIdea(template);
                            setIsTemplateMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></span>
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="relative flex-grow group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="Enter your video idea (e.g. 'How to bake sourdough bread')"
                  className="relative w-full bg-slate-900 text-white placeholder-slate-500 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-5 py-4 text-lg shadow-xl outline-none transition-all"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={appState.status === GenerationStatus.GENERATING || !idea.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
              >
                {appState.status === GenerationStatus.GENERATING ? (
                  <span className="animate-spin">✦</span>
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Analyze Idea
              </button>
           </div>
           
           {/* Section Title */}
           {appState.status === GenerationStatus.COMPLETED && (
             <div className="mb-6 pb-4 border-b border-slate-800/50">
                <h1 className="text-3xl font-bold