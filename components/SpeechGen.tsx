
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData } from '../utils/audio-utils';
import { VoiceName } from '../types';

const VOICES = [
  { id: VoiceName.Zephyr, desc: 'Warm and expressive' },
  { id: VoiceName.Kore, desc: 'Clear and authoritative' },
  { id: VoiceName.Puck, desc: 'Friendly and youthful' },
  { id: VoiceName.Charon, desc: 'Deep and resonant' },
  { id: VoiceName.Fenrir, desc: 'Sophisticated and precise' },
];

const SpeechGen: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Zephyr);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSynthesize = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this professionally and naturally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (err) {
      console.error('TTS Synthesis Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Speech Synthesis Lab</h2>
        <p className="text-gray-400">Transform written content into high-fidelity lifelike vocalizations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 space-y-4">
            <label className="text-sm font-semibold text-gray-400">Content to Synthesize</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to lifelike speech..."
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[300px] transition-all resize-none"
            />
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-500 uppercase font-mono">{text.length} Characters</span>
              <button
                onClick={handleSynthesize}
                disabled={isGenerating || !text.trim()}
                className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-10 py-3 rounded-full font-bold transition-all flex items-center gap-2"
              >
                {isGenerating ? 'Synthesizing...' : 'Synthesize Audio'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4">Voice Engine</h3>
            <div className="space-y-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedVoice === v.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{v.id}</span>
                    {selectedVoice === v.id && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
                  </div>
                  <p className="text-xs text-gray-500">{v.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 space-y-4">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                 <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Engine Stats</h4>
                 <p className="text-sm font-medium">Gemini 2.5 Flash TTS</p>
               </div>
             </div>
             <div className="h-[1px] bg-white/5" />
             <div className="flex justify-between text-xs">
               <span className="text-gray-500">Latency</span>
               <span className="text-green-400 font-mono">~250ms</span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="text-gray-500">Sample Rate</span>
               <span className="text-gray-300 font-mono">24kHz PCM</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechGen;
