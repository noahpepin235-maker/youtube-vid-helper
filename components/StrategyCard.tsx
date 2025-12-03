import React from 'react';
import { Monitor, Smartphone, Tablet, Check, Search, ExternalLink } from 'lucide-react';
import { SoftwareRecommendation } from '../types';

interface Props {
  data: SoftwareRecommendation[];
}

const SoftwareCard: React.FC<Props> = ({ data }) => {
  const getIcon = (platform: string) => {
    if (platform.toLowerCase().includes('mobile') || platform.toLowerCase().includes('phone')) return <Smartphone className="w-5 h-5" />;
    if (platform.toLowerCase().includes('tablet') || platform.toLowerCase().includes('ipad')) return <Tablet className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {data.map((category, idx) => (
        <div key={idx} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              {getIcon(category.platform)}
            </div>
            <h3 className="font-semibold text-white">{category.platform}</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {category.apps.map((app, appIdx) => (
              <div key={appIdx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-indigo-500/50 transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-200">{app.name}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    app.type === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    app.type === 'Paid' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {app.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3 flex-grow">{app.description}</p>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-900/20 w-fit px-2 py-1 rounded">
                        <Check className="w-3 h-3" /> Best for: {app.bestFor}
                    </div>
                    
                    <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(app.name + ' ' + category.platform + ' software')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded transition-colors group-hover/btn:bg-indigo-600"
                    >
                        <Search className="w-3 h-3" /> Find on Google <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoftwareCard;