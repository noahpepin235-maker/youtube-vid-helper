import React, { useRef, useEffect } from 'react';
import { Video, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import { VideoState, GenerationStatus } from '../types';

interface Props {
  videoState: VideoState;
  idea: string;
}

const VideoPlayer: React.FC<Props> = ({ videoState, idea }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoState.url && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    }
  }, [videoState.url]);

  const renderContent = () => {
    switch (videoState.status) {
      case GenerationStatus.IDLE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900">
            <Video className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Ready to create</p>
            <p className="text-sm opacity-70">Enter an idea to generate a video preview</p>
          </div>
        );
      
      case GenerationStatus.GENERATING:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-slate-900 relative overflow-hidden">
             {/* Abstract background animation */}
            <div className="absolute inset-0 opacity-20">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
              <h3 className="text-xl font-semibold text-white mb-2">Creating Video</h3>
              <p className="text-slate-400 text-center max-w-xs">
                Generating scenes for "{idea}"...<br/>
                <span className="text-xs text-slate-500 mt-2 block">Powered by Veo 3.1 (This may take a minute)</span>
              </p>
            </div>
          </div>
        );

      case GenerationStatus.COMPLETED:
        return (
          <div className="relative w-full h-full bg-black group">
            {videoState.url ? (
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                controls 
                loop 
                playsInline
                poster="https://picsum.photos/1920/1080?blur=5" // Fallback poster
              >
                <source src={videoState.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
               <div className="flex items-center justify-center h-full text-red-400">Video URL missing</div>
            )}
             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
               AI Generated
             </div>
          </div>
        );

      case GenerationStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-red-400 p-6 text-center">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
            <p className="text-sm opacity-80 max-w-md">{videoState.error}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
       {renderContent()}
    </div>
  );
};

export default VideoPlayer;
