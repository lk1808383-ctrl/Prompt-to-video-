import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Clock,
  Ratio,
  Palette,
  Camera,
  Sliders,
  Play,
  RotateCw,
  Zap,
  ChevronDown,
  Info,
  CheckCircle2,
  Flame,
  Shuffle,
} from 'lucide-react';
import {
  VideoLength,
  AspectRatio,
  VideoStyle,
  CameraMovement,
  VideoResolution,
  VideoItem,
  GenerationConfig,
} from '../types';
import { SAMPLE_PROMPTS } from '../data/mockVideos';

interface GeneratorSectionProps {
  onGenerateSuccess: (newVideo: VideoItem) => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  onOpenUpgrade: () => void;
  initialConfig?: Partial<GenerationConfig>;
}

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({
  onGenerateSuccess,
  credits,
  setCredits,
  onOpenUpgrade,
  initialConfig,
}) => {
  const [prompt, setPrompt] = useState(
    initialConfig?.prompt ||
      'Towering cyberpunk mega-skyscrapers drenched in neon rain with levitating air vehicles gliding between holographic advertisements in Neo-Shinjuku.'
  );
  const [length, setLength] = useState<VideoLength>(initialConfig?.length || '10s');
  const [ratio, setRatio] = useState<AspectRatio>(initialConfig?.ratio || '16:9');
  const [style, setStyle] = useState<VideoStyle>(initialConfig?.style || '3D Cyberpunk');
  const [camera, setCamera] = useState<CameraMovement>(initialConfig?.camera || 'Pan');
  const [resolution, setResolution] = useState<VideoResolution>(initialConfig?.resolution || '4K UHD');
  const [motionStrength, setMotionStrength] = useState<number>(initialConfig?.motionStrength || 8);
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 999999));
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Credit calculation
  const creditCost = length === '30s' ? 25 : length === '10s' ? 10 : 5;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // AI Prompt Enhancer
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      showToast('Please type a prompt first!');
      return;
    }

    const enhancements = [
      '8k cinematic render, volumetric purple and cyan fog, anamorphic lens flare, raytraced reflections, hyper-detailed textures, moody atmospheric lighting',
      'ultra-detailed octane render, dramatic rim lighting, particles floating in air, shallow depth of field, neon glow highlights',
      'masterpiece IMAX cinematography, dynamic camera angle, photorealistic physics, vivid cyberpunk color grading, 60fps fluid motion',
    ];

    const randomEnhance = enhancements[Math.floor(Math.random() * enhancements.length)];
    const cleanedPrompt = prompt.split(' --enhanced')[0];
    setPrompt(`${cleanedPrompt}, ${randomEnhance}`);
    showToast('Prompt enhanced with cinematic styling!');
  };

  // Surprise Me / Randomize Prompt
  const handleSurpriseMe = () => {
    const random = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(random);
  };

  // Real-time multi-stage AI simulation
  const handleStartGeneration = () => {
    if (!prompt.trim()) {
      showToast('Please describe your video scene.');
      return;
    }

    if (credits < creditCost) {
      showToast('Insufficient credits! Upgrade your plan for instant credits.');
      onOpenUpgrade();
      return;
    }

    // Deduct credits
    setCredits((prev) => Math.max(0, prev - creditCost));
    setIsGenerating(true);
    setProgress(0);
    setStageText('Parsing prompt semantics & syntax...');

    const stages = [
      { at: 15, text: 'Deconstructing semantic tokens into 3D latents...' },
      { at: 40, text: 'Diffusing spatio-temporal video noise matrix...' },
      { at: 65, text: 'Synthesizing 60 FPS optical motion vectors...' },
      { at: 85, text: 'Applying neural 4K upscaling & cinematic grade...' },
      { at: 96, text: 'Finalizing MP4 container stream...' },
    ];

    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += Math.floor(Math.random() * 4) + 2;

      for (let i = stages.length - 1; i >= 0; i--) {
        if (currentProg >= stages[i].at) {
          setStageText(stages[i].text);
          break;
        }
      }

      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        setProgress(100);
        setStageText('Render complete!');

        // Select suitable image based on style/camera
        const showcaseImages = [
          '/src/assets/images/cyber_neon_cityscape_1792130346433.jpg',
          '/src/assets/images/cyber_mech_android_1792130346692.jpg',
          '/src/assets/images/cyber_hyperspace_portal_1792130346208.jpg',
          '/src/assets/images/cyber_motorcycle_rider_1792130348246.jpg',
        ];

        let chosenThumb = showcaseImages[0];
        if (style === 'Realistic') chosenThumb = showcaseImages[1];
        else if (style === 'Cinematic') chosenThumb = showcaseImages[2];
        else if (style === 'Anime') chosenThumb = showcaseImages[3];
        else chosenThumb = showcaseImages[0];

        const newVideo: VideoItem = {
          id: `gen-${Date.now().toString().slice(-6)}`,
          title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
          prompt: prompt,
          enhancedPrompt: `${prompt} (Generated with VibeVideo AI ${resolution}, ${camera} camera motion)`,
          style: style,
          length: length,
          ratio: ratio,
          camera: camera,
          resolution: resolution,
          fps: 60,
          seed: seed,
          motionStrength: motionStrength,
          createdAt: 'Just now',
          likes: 1,
          views: 1,
          isLiked: false,
          thumbnail: chosenThumb,
          author: {
            name: 'You (Creator)',
            handle: '@creator',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          },
          tags: [style, ratio, camera],
        };

        setTimeout(() => {
          setIsGenerating(false);
          onGenerateSuccess(newVideo);
          showToast('Video synthesized successfully! Loaded into Live Player.');
        }, 500);
      } else {
        setProgress(currentProg);
      }
    }, 70);
  };

  return (
    <div className="rounded-xl border border-purple-500/20 bg-[#0c0c17]/95 p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-cyan-950/90 border border-cyan-400 px-3.5 py-2 text-xs font-semibold text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>AI Text-to-Video Studio</span>
          </h2>
          <p className="text-xs text-slate-400">
            Convert imaginative text descriptions into 60 FPS cinematic motion sequences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSurpriseMe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <Shuffle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={handleEnhancePrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/40 text-xs font-medium text-purple-300 hover:bg-purple-900/40 transition-colors"
          >
            <Wand2 className="h-3.5 w-3.5 text-purple-400" />
            <span>Enhance Prompt</span>
          </button>
        </div>
      </div>

      {/* Prompt Input Box */}
      <div className="relative mb-5">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to create..."
          disabled={isGenerating}
          className="w-full rounded-lg border border-purple-900/50 bg-[#07070e] p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all resize-none shadow-inner"
        />
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>Be descriptive with camera movement, mood, and lighting for best results.</span>
          <span className="font-mono">{prompt.length} chars</span>
        </div>
      </div>

      {/* Settings Grid Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {/* Setting 1: Video Length */}
        <div className="rounded-lg border border-purple-900/30 bg-[#07070e] p-3">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Duration</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['5s', '10s', '30s'] as VideoLength[]).map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                disabled={isGenerating}
                className={`py-1.5 text-xs font-semibold rounded transition-all ${
                  length === len
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Aspect Ratio */}
        <div className="rounded-lg border border-purple-900/30 bg-[#07070e] p-3">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
            <Ratio className="h-3.5 w-3.5 text-purple-400" />
            <span>Aspect Ratio</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                disabled={isGenerating}
                className={`py-1.5 text-xs font-semibold rounded transition-all ${
                  ratio === r
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 3: Video Style */}
        <div className="rounded-lg border border-purple-900/30 bg-[#07070e] p-3">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
            <Palette className="h-3.5 w-3.5 text-pink-400" />
            <span>Visual Style</span>
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as VideoStyle)}
            disabled={isGenerating}
            className="w-full rounded bg-white/[0.04] border border-slate-700/60 px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="3D Cyberpunk" className="bg-[#0f0f1a] text-slate-200">3D Cyberpunk</option>
            <option value="Cinematic" className="bg-[#0f0f1a] text-slate-200">Cinematic</option>
            <option value="Realistic" className="bg-[#0f0f1a] text-slate-200">Realistic</option>
            <option value="Anime" className="bg-[#0f0f1a] text-slate-200">Anime</option>
          </select>
        </div>

        {/* Setting 4: Camera Movement */}
        <div className="rounded-lg border border-purple-900/30 bg-[#07070e] p-3">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
            <Camera className="h-3.5 w-3.5 text-emerald-400" />
            <span>Camera Dynamics</span>
          </label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value as CameraMovement)}
            disabled={isGenerating}
            className="w-full rounded bg-white/[0.04] border border-slate-700/60 px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="Pan" className="bg-[#0f0f1a] text-slate-200">Horizontal Pan</option>
            <option value="Zoom" className="bg-[#0f0f1a] text-slate-200">Cinematic Zoom In</option>
            <option value="Tilt" className="bg-[#0f0f1a] text-slate-200">Crane Vertical Tilt</option>
            <option value="Orbit" className="bg-[#0f0f1a] text-slate-200">Orbital 360 Arc</option>
          </select>
        </div>
      </div>

      {/* Advanced Accordion Toggle */}
      <div className="mb-5">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Advanced Engine Tuning (Seed, Motion Strength, 4K)</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </button>

        {isAdvancedOpen && (
          <div className="mt-3 p-3.5 rounded-lg border border-purple-900/40 bg-[#07070e]/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Motion Latent Strength</span>
                <span className="font-mono text-cyan-400">{motionStrength}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={motionStrength}
                onChange={(e) => setMotionStrength(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Output Resolution</span>
                <span className="font-mono text-purple-300">{resolution}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {(['1080p FHD', '4K UHD'] as VideoResolution[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-1 text-[11px] rounded font-medium ${
                      resolution === res ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-400'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Diffusion Seed</span>
                <button
                  onClick={() => setSeed(Math.floor(Math.random() * 999999))}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5"
                >
                  <RotateCw className="h-2.5 w-2.5" /> Randomize
                </button>
              </div>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded bg-white/[0.04] border border-slate-700/60 px-2.5 py-1 text-xs font-mono text-slate-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Generation Bar with Glassmorphic Progress & Trigger Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-purple-900/30">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span>Estimated Compute: <strong className="text-white font-mono">{creditCost} Credits</strong></span>
          <span className="text-slate-600">·</span>
          <span>Balance: <strong className="text-cyan-300 font-mono">{credits}</strong></span>
        </div>

        <div className="w-full sm:w-auto">
          {isGenerating ? (
            /* Multi-functional Glassmorphism Active Loading State */
            <div className="w-full sm:min-w-[320px] rounded-lg p-3 bg-purple-950/30 border border-purple-500/40 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.3)]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                  <span>Synthesizing Video...</span>
                </span>
                <span className="font-mono text-xs text-purple-300 font-bold">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-1.5 text-[11px] font-mono text-slate-400 truncate">
                &gt; {stageText}
              </div>
            </div>
          ) : (
            /* Primary Multi-functional Generation Button */
            <button
              onClick={handleStartGeneration}
              className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-7 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-200 hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4 text-cyan-200 animate-pulse" />
              <span>Generate 4K Video</span>
              <span className="ml-1 text-xs font-mono font-normal opacity-80">({creditCost} credits)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
