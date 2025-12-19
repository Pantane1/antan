
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const MESSAGES = [
  "Synchronizing creative matrices...",
  "Rendering cinematic pathways...",
  "Applying temporal smoothing...",
  "Polishing pixel harmonics...",
  "Optimizing frame structures...",
  "Finalizing visual composition..."
];

const VideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(MESSAGES[0]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check API Key
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setError("Professional API key required for Video Engine. Redirecting to selection...");
      await (window as any).aistudio.openSelectKey();
      // Proceed assuming success per instructions
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio
        }
      });

      // Polling
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await videoResponse.blob();
        setVideoUrl(URL.createObjectURL(videoBlob));
      } else {
        throw new Error("Generation completed but no video link found.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("Session expired or invalid. Re-authenticating...");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError(err.message || "An unexpected error occurred during generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Veo Video Engine</h2>
        <p className="text-gray-400">High-fidelity generative cinematic video from natural language.</p>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300 ml-1">Visualization Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A surreal landscape where mountains are made of velvet and the rivers flow with liquid gold, cinematic lighting, 8k resolution..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => setAspectRatio('16:9')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${aspectRatio === '16:9' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              16:9 Landscape
            </button>
            <button 
              onClick={() => setAspectRatio('9:16')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${aspectRatio === '9:16' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              9:16 Portrait
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            {isGenerating ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating...</>
            ) : 'Generate Video'}
          </button>
        </div>

        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-gray-500 uppercase tracking-widest text-center block hover:underline">Requires Billing Account</a>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {isGenerating ? (
        <div className="aspect-video bg-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center animate-pulse">
           <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6" />
           <p className="text-xl font-medium text-white mb-2">{loadingMsg}</p>
           <p className="text-gray-500 text-sm max-w-sm">Cinematic rendering takes about 2-3 minutes. Please stay with us.</p>
        </div>
      ) : videoUrl ? (
        <div className="space-y-4">
           <div className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${aspectRatio === '9:16' ? 'max-w-xs mx-auto' : 'aspect-video'}`}>
             <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
           </div>
           <div className="flex justify-center">
             <a href={videoUrl} download="pantane-gen.mp4" className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Download Video
             </a>
           </div>
        </div>
      ) : null}
    </div>
  );
};

export default VideoGen;
