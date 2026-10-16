import React, { useState } from 'react';
import {
  Clock,
  Play,
  Sparkles,
  Download,
  Trash2,
  Film,
  RotateCcw,
  Check,
  Copy,
} from 'lucide-react';
import { VideoItem } from '../types';

interface HistorySectionProps {
  history: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  onRemixVideo: (video: VideoItem) => void;
  onDeleteVideo: (id: string) => void;
  onClearAll: () => void;
  onGoToStudio: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onPlayVideo,
  onRemixVideo,
  onDeleteVideo,
  onClearAll,
  onGoToStudio,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (vid: VideoItem) => {
    navigator.clipboard.writeText(vid.enhancedPrompt || vid.prompt);
    setCopiedId(vid.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (vid: VideoItem) => {
    const a = document.createElement('a');
    a.href = vid.thumbnail;
    a.download = `VibeVideo_Render_${vid.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <span>Generation History</span>
          </h2>
          <p className="text-xs text-slate-400">
            All synthesized video clips in your studio session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs font-medium text-red-300 hover:bg-red-900/40 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((video) => (
            <div
              key={video.id}
              className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-purple-900/30 bg-[#0c0c17]/90 p-4 transition-all hover:border-cyan-500/40 hover:bg-[#0f0f20]"
            >
              {/* Thumbnail */}
              <div 
                onClick={() => onPlayVideo(video)}
                className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-black shrink-0 cursor-pointer group"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-8 w-8 text-cyan-400 fill-cyan-400" />
                </div>
                <span className="absolute bottom-1 right-1 text-[10px] font-mono px-1 rounded bg-black/70 text-slate-300">
                  {video.length}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{video.title}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{video.createdAt}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{video.prompt}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-900/50 text-purple-300">
                    {video.style}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                    {video.camera} Motion
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                    {video.ratio}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-900/50">
                    {video.resolution}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-900/30">
                <button
                  onClick={() => onPlayVideo(video)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-cyan-300" />
                  <span>Play</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRemixVideo(video)}
                    className="p-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 transition-colors"
                    title="Remix prompt into Studio"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopyPrompt(video)}
                    className="p-1.5 rounded-lg bg-white/[0.04] border border-slate-700/60 text-slate-300 hover:text-white"
                    title="Copy prompt"
                  >
                    {copiedId === video.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDownload(video)}
                    className="p-1.5 rounded-lg bg-white/[0.04] border border-slate-700/60 text-slate-300 hover:text-white"
                    title="Download HD frame"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteVideo(video.id)}
                    className="p-1.5 rounded-lg bg-white/[0.04] border border-slate-700/60 text-slate-400 hover:text-red-400"
                    title="Delete clip"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 rounded-2xl border border-purple-900/30 bg-[#0c0c17]/60 p-8 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Film className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Videos Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your synthesized video clips and camera renders will be stored here for immediate playback, remixing, and HD export.
          </p>
          <button
            onClick={onGoToStudio}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Studio Generator</span>
          </button>
        </div>
      )}
    </div>
  );
};
