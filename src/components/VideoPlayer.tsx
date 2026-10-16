import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Share2,
  Tv,
  Film,
  Camera,
  Layers,
  Repeat,
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  onRemix: (video: VideoItem) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onRemix }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showHUD, setShowHUD] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Parse duration in seconds
  useEffect(() => {
    const dur = parseInt(video.length.replace('s', ''), 10) || 10;
    setDuration(dur);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [video]);

  // Audio synthesis for cyberpunk ambient drone when unmuted
  useEffect(() => {
    if (!isMuted && isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65.41, ctx.currentTime); // C2 low synth hum
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainNodeRef.current = gain;
      } catch (err) {
        console.warn('Web Audio not supported or blocked:', err);
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore cleanup errors
        }
        oscRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore cleanup errors
        }
        oscRef.current = null;
      }
    };
  }, [isMuted, isPlaying]);

  // Simulation timer playback engine
  useEffect(() => {
    let lastStamp = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastStamp) / 1000;
      lastStamp = time;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackRate;
          if (next >= duration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return next;
        });
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration, playbackRate, isLooping]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(video.enhancedPrompt || video.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // HD Download handler
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = video.thumbnail;
    a.download = `VibeVideo_${video.id}_${video.style.replace(/\s+/g, '_')}_${video.ratio.replace(':', 'x')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Calculate camera motion transform based on current progress
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  
  let cameraTransform = 'scale(1)';
  if (video.camera === 'Pan') {
    const xOffset = -5 + progressRatio * 10; // Pan from -5% to +5%
    cameraTransform = `scale(1.15) translateX(${xOffset}%)`;
  } else if (video.camera === 'Zoom') {
    const zoomScale = 1.0 + progressRatio * 0.25; // Smooth 1.0 to 1.25 zoom
    cameraTransform = `scale(${zoomScale})`;
  } else if (video.camera === 'Tilt') {
    const yOffset = 4 - progressRatio * 8; // Crane tilt
    cameraTransform = `scale(1.15) translateY(${yOffset}%)`;
  } else if (video.camera === 'Orbit') {
    const rot = -2 + progressRatio * 4;
    cameraTransform = `scale(1.12) rotate(${rot}deg)`;
  }

  // Format time (00:04)
  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs - s) * 10);
    const formattedSecs = s < 10 ? `0${s}` : `${s}`;
    return `00:${formattedSecs}.${ms}`;
  };

  // Determine aspect ratio class
  const getAspectRatioClasses = () => {
    if (video.ratio === '9:16') {
      return 'aspect-[9/16] max-w-[340px] mx-auto';
    }
    if (video.ratio === '1:1') {
      return 'aspect-square max-w-[480px] mx-auto';
    }
    return 'aspect-video w-full';
  };

  return (
    <div className="rounded-xl border border-purple-500/20 bg-[#0c0c17]/95 p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative">
      {/* Header bar of the player */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Film className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{video.title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-900/40 border border-purple-500/30 text-purple-300">
                {video.resolution}
              </span>
            </h2>
            <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
              {video.prompt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRemix(video)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-xs font-medium text-purple-200 hover:bg-purple-600/30 transition-colors"
            title="Load this prompt and settings into generator"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Remix</span>
          </button>

          <button
            onClick={copyPromptToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            {copiedPrompt ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-semibold text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloadSuccess ? 'Downloaded HD' : 'Download HD'}</span>
          </button>
        </div>
      </div>

      {/* Screen Container */}
      <div className="relative mt-5 rounded-lg overflow-hidden bg-black border border-cyan-500/20 shadow-inner group" ref={containerRef}>
        <div className={`relative overflow-hidden ${getAspectRatioClasses()} transition-all duration-300 flex items-center justify-center`}>
          
          {/* Visual Canvas / Frame with smooth dynamic Camera Movement */}
          <div 
            className="w-full h-full relative overflow-hidden select-none"
            style={{
              transition: isPlaying ? 'transform 0.1s linear' : 'transform 0.3s ease-out',
              transform: cameraTransform,
            }}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-105 brightness-105"
            />
            {/* Cyberpunk subtle scanlines */}
            <div className="absolute inset-0 cyber-scanlines opacity-40 mix-blend-overlay pointer-events-none" />
          </div>

          {/* Holographic HUD Overlays */}
          {showHUD && (
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Top HUD */}
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded border border-cyan-500/20 max-w-fit">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE RENDER
                  </span>
                  <span>CAM: {video.camera.toUpperCase()}</span>
                  <span>{video.fps} FPS</span>
                  <span>{video.ratio}</span>
                </div>
              </div>

              {/* Center Crosshair or Camera Framing Lines */}
              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                <div className="w-16 h-16 border border-dashed border-cyan-400/50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400/70 rounded-full" />
                </div>
              </div>

              {/* Bottom HUD */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                  SEED #{video.seed}
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded border border-slate-800 text-purple-300">
                  LATENT_MOTION: {video.motionStrength}/10
                </span>
              </div>
            </div>
          )}

          {/* Central Big Play/Pause Overlay Click Target */}
          <div 
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
          >
            {!isPlaying && (
              <div className="h-16 w-16 rounded-full bg-purple-600/80 border border-purple-400/60 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_25px_rgba(168,85,247,0.7)] transform scale-100 hover:scale-110 transition-transform">
                <Play className="h-7 w-7 translate-x-0.5 fill-white" />
              </div>
            )}
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="border-t border-purple-900/40 bg-[#090916]/95 px-4 py-3">
          
          {/* Progress Timeline Scrubber */}
          <div className="relative mb-3 flex items-center group/scrubber cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration}
              step={0.05}
              value={currentTime}
              onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #00f5ff 0%, #a855f7 ${(currentTime / duration) * 100}%, #1e1e38 ${(currentTime / duration) * 100}%, #1e1e38 100%)`,
              }}
            />
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            
            {/* Left Controls: Play, Reset, Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-cyan-300" />}
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Restart from beginning"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Time display with tabular figures */}
              <div className="font-mono text-xs tabular-nums text-slate-300 flex items-center gap-1.5">
                <span className="text-cyan-400 font-semibold">{formatTime(currentTime)}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">00:{duration < 10 ? `0${duration}` : duration}.0</span>
              </div>
            </div>

            {/* Right Controls: Speed, Loop, HUD, Sound, Fullscreen */}
            <div className="flex items-center gap-2">
              
              {/* Playback speed */}
              <div className="flex items-center rounded-md bg-[#121124] border border-purple-900/40 p-0.5 text-xs font-mono">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      playbackRate === rate
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Loop toggle */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1.5 rounded-md border transition-colors ${
                  isLooping
                    ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
                title={isLooping ? 'Looping enabled' : 'Loop disabled'}
              >
                <Repeat className="h-4 w-4" />
              </button>

              {/* HUD Toggle */}
              <button
                onClick={() => setShowHUD(!showHUD)}
                className={`p-1.5 rounded-md border transition-colors ${
                  showHUD
                    ? 'border-purple-500/40 bg-purple-950/40 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
                title="Toggle HUD Telemetry"
              >
                <Tv className="h-4 w-4" />
              </button>

              {/* Ambient Sound / Audio */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-md border transition-colors ${
                  !isMuted
                    ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
                title={isMuted ? 'Unmute cyber drone' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Metadata Strip */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg border border-purple-900/30 bg-[#090916] p-2.5">
          <span className="text-slate-500 block text-[11px]">Visual Style</span>
          <span className="font-medium text-slate-200">{video.style}</span>
        </div>
        <div className="rounded-lg border border-purple-900/30 bg-[#090916] p-2.5">
          <span className="text-slate-500 block text-[11px]">Camera Dynamic</span>
          <span className="font-medium text-cyan-300">{video.camera} Motion</span>
        </div>
        <div className="rounded-lg border border-purple-900/30 bg-[#090916] p-2.5">
          <span className="text-slate-500 block text-[11px]">Aspect & Duration</span>
          <span className="font-mono text-slate-200">{video.ratio} · {video.length}</span>
        </div>
        <div className="rounded-lg border border-purple-900/30 bg-[#090916] p-2.5">
          <span className="text-slate-500 block text-[11px]">Hardware Pipeline</span>
          <span className="font-mono text-purple-300">Tensor 60 FPS</span>
        </div>
      </div>
    </div>
  );
};
