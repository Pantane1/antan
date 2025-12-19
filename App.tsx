
import React, { useState } from 'react';
import LiveVoice from './components/LiveVoice';
import VideoGen from './components/VideoGen';
import SpeechGen from './components/SpeechGen';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('live');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight gradient-text uppercase">Pantane</h1>
        </div>
        
        <nav className="hidden md:flex items-center bg-black/40 rounded-full p-1 border border-white/10">
          <button 
            onClick={() => setView('live')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${view === 'live' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Live Voice
          </button>
          <button 
            onClick={() => setView('video')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${view === 'video' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Video Engine
          </button>
          <button 
            onClick={() => setView('speech')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${view === 'speech' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Speech Lab
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">API: READY</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {view === 'live' && <LiveVoice />}
        {view === 'video' && <VideoGen />}
        {view === 'speech' && <SpeechGen />}
      </main>

      {/* Mobile Nav */}
      <footer className="md:hidden glass border-t border-white/5 sticky bottom-0 z-50 flex justify-around p-3">
        <button onClick={() => setView('live')} className={`flex flex-col items-center ${view === 'live' ? 'text-blue-400' : 'text-gray-400'}`}>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
           <span className="text-[10px] mt-1 font-bold">Live</span>
        </button>
        <button onClick={() => setView('video')} className={`flex flex-col items-center ${view === 'video' ? 'text-blue-400' : 'text-gray-400'}`}>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
           <span className="text-[10px] mt-1 font-bold">Video</span>
        </button>
        <button onClick={() => setView('speech')} className={`flex flex-col items-center ${view === 'speech' ? 'text-blue-400' : 'text-gray-400'}`}>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
           <span className="text-[10px] mt-1 font-bold">Speech</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
