import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GeneratorSection } from './components/GeneratorSection';
import { VideoPlayer } from './components/VideoPlayer';
import { ExploreGrid } from './components/ExploreGrid';
import { PricingSection } from './components/PricingSection';
import { HistorySection } from './components/HistorySection';
import { CheckoutModal } from './components/CheckoutModal';
import { VideoItem, GenerationConfig } from './types';
import { INITIAL_VIDEOS } from './data/mockVideos';
import { Sparkles, Film, ArrowRight, Zap, Play, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'explore' | 'history' | 'pricing'>('generator');
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('vibevideo_credits');
    return saved ? parseInt(saved, 10) : 250;
  });

  const [currentPlan, setCurrentPlan] = useState<string>('Free Starter');

  // Video list state
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('vibevideo_community_videos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_VIDEOS;
      }
    }
    return INITIAL_VIDEOS;
  });

  // History state
  const [history, setHistory] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('vibevideo_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_VIDEOS[0], INITIAL_VIDEOS[1]];
      }
    }
    return [INITIAL_VIDEOS[0], INITIAL_VIDEOS[1]];
  });

  // Active video currently shown in the Live Video Player
  const [activeVideo, setActiveVideo] = useState<VideoItem>(INITIAL_VIDEOS[0]);

  // Generator configuration seed/defaults when remixing
  const [remixConfig, setRemixConfig] = useState<Partial<GenerationConfig> | undefined>(undefined);

  // Upgrade Modal State
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState('Pro Creator');
  const [selectedUpgradePrice, setSelectedUpgradePrice] = useState(14);

  // Persist credits
  useEffect(() => {
    localStorage.setItem('vibevideo_credits', credits.toString());
  }, [credits]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('vibevideo_history', JSON.stringify(history));
  }, [history]);

  // Handle successful generation
  const handleGenerateSuccess = (newVideo: VideoItem) => {
    // Add to history
    setHistory((prev) => [newVideo, ...prev]);
    // Add to community videos as well
    setVideos((prev) => [newVideo, ...prev]);
    // Make it the active video in the live player
    setActiveVideo(newVideo);
  };

  // Toggle Like on a video
  const handleToggleLike = (videoId: string) => {
    const updateLike = (list: VideoItem[]) =>
      list.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likes: isLiked ? v.likes + 1 : Math.max(0, v.likes - 1),
          };
        }
        return v;
      });

    setVideos((prev) => updateLike(prev));
    setHistory((prev) => updateLike(prev));
    if (activeVideo.id === videoId) {
      setActiveVideo((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: !prev.isLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
      }));
    }
  };

  // Remix a video prompt and settings into generator
  const handleRemix = (video: VideoItem) => {
    setRemixConfig({
      prompt: video.prompt,
      length: video.length,
      ratio: video.ratio,
      style: video.style,
      camera: video.camera,
      resolution: video.resolution,
      motionStrength: video.motionStrength,
    });
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select video to play from Explore or History
  const handleSelectVideoToPlay = (video: VideoItem) => {
    setActiveVideo(video);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete video from history
  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((v) => v.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Open upgrade modal with specific tier
  const handleOpenUpgradePlan = (planName: string, price: number) => {
    setSelectedUpgradePlan(planName);
    setSelectedUpgradePrice(price);
    setIsUpgradeOpen(true);
  };

  // Confirm upgrade
  const handleConfirmUpgrade = (planName: string, addedCredits: number) => {
    setCurrentPlan(planName);
    setCredits((prev) => prev + addedCredits);
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-slate-100 cyber-grid flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        credits={credits}
        onOpenUpgrade={() => handleOpenUpgradePlan('Pro Creator', 14)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: STUDIO (Text-to-Video Generator + Live Media Player) */}
        {activeTab === 'generator' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Kicker Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#0d0d1f] to-cyan-950/40 p-4 sm:p-5 backdrop-blur-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-cyan-400 font-mono tracking-wider">
                    NEURAL DIFFUSION 4.0
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-purple-300">60 FPS Cinematic Tensor Engine</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Next-Gen Text to Video Studio
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.05] border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors"
                >
                  <span>Explore Trending</span>
                  <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Split 2-Column Desktop Grid: Generator (Left) + Live Player (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Generator Form (5 cols on lg) */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <GeneratorSection
                  key={remixConfig?.prompt || 'default-gen'}
                  onGenerateSuccess={handleGenerateSuccess}
                  credits={credits}
                  setCredits={setCredits}
                  onOpenUpgrade={() => handleOpenUpgradePlan('Pro Creator', 14)}
                  initialConfig={remixConfig}
                />
              </div>

              {/* Right Column: Live Video Player (7 cols on lg) */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <VideoPlayer
                  video={activeVideo}
                  onRemix={handleRemix}
                />
              </div>
            </div>

            {/* Quick Reel Strip: Recent & Community Inspirations */}
            <div className="pt-4 border-t border-purple-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="h-4 w-4 text-cyan-400" />
                  <span>Quick Studio Showcase (Click to preview in Live Player)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-xs text-purple-400 hover:text-cyan-300 transition-colors"
                >
                  View all in Explore &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {videos.slice(0, 4).map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                      activeVideo.id === vid.id
                        ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'border-purple-900/30 hover:border-purple-500/50 bg-[#0c0c17]'
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-black">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5 bg-[#090916]">
                      <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-cyan-300">
                        {vid.title}
                      </h4>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{vid.style}</span>
                        <span className="text-cyan-400">{vid.camera}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPLORE COMMUNITY */}
        {activeTab === 'explore' && (
          <div className="animate-in fade-in duration-200">
            <ExploreGrid
              videos={videos}
              onSelectVideo={handleSelectVideoToPlay}
              onRemixPrompt={handleRemix}
              onToggleLike={handleToggleLike}
            />
          </div>
        )}

        {/* TAB 3: GENERATION HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-200">
            <HistorySection
              history={history}
              onPlayVideo={handleSelectVideoToPlay}
              onRemixVideo={handleRemix}
              onDeleteVideo={handleDeleteHistory}
              onClearAll={handleClearHistory}
              onGoToStudio={() => setActiveTab('generator')}
            />
          </div>
        )}

        {/* TAB 4: PRICING */}
        {activeTab === 'pricing' && (
          <div className="animate-in fade-in duration-200">
            <PricingSection
              onSelectPlan={handleOpenUpgradePlan}
              currentPlan={currentPlan}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-purple-900/30 bg-[#06060c] py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">VibeVideo AI</span>
            <span>·</span>
            <span>Next-Generation Neural Video Synthesis</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('generator')} className="hover:text-slate-300 transition-colors">
              Studio
            </button>
            <button onClick={() => setActiveTab('explore')} className="hover:text-slate-300 transition-colors">
              Explore
            </button>
            <button onClick={() => setActiveTab('pricing')} className="hover:text-slate-300 transition-colors">
              Pricing
            </button>
            <button onClick={() => setActiveTab('history')} className="hover:text-slate-300 transition-colors">
              History
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-600">
            © 2026 VibeVideo AI Studio
          </div>
        </div>
      </footer>

      {/* Checkout / Upgrade Modal */}
      <CheckoutModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        selectedPlan={selectedUpgradePlan}
        planPrice={selectedUpgradePrice}
        onConfirmUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
}
