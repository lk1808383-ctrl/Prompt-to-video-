import React, { useState } from 'react';
import {
  Heart,
  Eye,
  Sparkles,
  Search,
  Filter,
  Play,
  Share2,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';
import { VideoItem, VideoStyle } from '../types';

interface ExploreGridProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onRemixPrompt: (video: VideoItem) => void;
  onToggleLike: (videoId: string) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({
  videos,
  onSelectVideo,
  onRemixPrompt,
  onToggleLike,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'likes'>('trending');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const styleFilters = ['All', '3D Cyberpunk', 'Cinematic', 'Realistic', 'Anime'];

  // Filter and sort videos
  const filteredVideos = videos
    .filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStyle = selectedStyle === 'All' || v.style === selectedStyle;
      return matchesSearch && matchesStyle;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return b.likes - a.likes;
      if (sortBy === 'recent') return b.seed - a.seed;
      return b.views + b.likes * 2 - (a.views + a.likes * 2);
    });

  const handleCopyPrompt = (e: React.MouseEvent, vid: VideoItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(vid.enhancedPrompt || vid.prompt);
    setCopiedId(vid.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-purple-500/20 bg-[#0c0c17]/80 p-4 backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search prompts, tags, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-[#07070e] border border-purple-900/40 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>

        {/* Style Segmented Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {styleFilters.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStyle(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedStyle === st
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.07]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs text-slate-400">
          <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'trending' | 'recent' | 'likes')}
            className="bg-[#07070e] border border-purple-900/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="trending">Trending Now</option>
            <option value="likes">Most Liked</option>
            <option value="recent">Latest Generations</option>
          </select>
        </div>
      </div>

      {/* Grid count & status */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredVideos.length} community generated video reels</span>
        <span className="font-mono text-[11px] text-cyan-400">Neural Latent Database</span>
      </div>

      {/* Responsive Masonry / Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className="group relative flex flex-col rounded-xl overflow-hidden border border-purple-900/30 bg-[#0c0c17] transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:-translate-y-1 cursor-pointer"
          >
            {/* Visual Thumbnail Area */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={video.thumbnail}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c17] via-transparent to-transparent opacity-80" />

              {/* Top metadata tags */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300">
                  {video.style}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-300">
                    {video.ratio}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200">
                    {video.length}
                  </span>
                </div>
              </div>

              {/* Play Hover Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <div className="h-12 w-12 rounded-full bg-cyan-500/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.7)] transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="h-5 w-5 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Views count */}
              <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded">
                <Eye className="h-3 w-3 text-cyan-400" />
                <span>{video.views.toLocaleString()}</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {video.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {video.prompt}
                </p>
              </div>

              {/* Footer row: Creator, Like, and Remix */}
              <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs">
                {/* Creator */}
                <div className="flex items-center gap-2">
                  <img
                    src={video.author.avatar}
                    alt={video.author.name}
                    className="h-5 w-5 rounded-full object-cover border border-purple-500/40"
                  />
                  <span className="text-[11px] font-medium text-slate-300 truncate max-w-[90px]">
                    {video.author.name}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopyPrompt(e, video)}
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                    title="Copy prompt"
                  >
                    {copiedId === video.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemixPrompt(video);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors text-[11px]"
                    title="Remix this prompt"
                  >
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    <span>Remix</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(video.id);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-[11px] font-mono ${
                      video.isLiked
                        ? 'bg-pink-950/60 text-pink-400 border border-pink-500/30'
                        : 'text-slate-400 hover:text-pink-400 hover:bg-pink-950/20'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${video.isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
                    <span>{video.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16 rounded-xl border border-purple-900/30 bg-[#0c0c17]/60">
          <p className="text-slate-400 text-sm">No videos match your query "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStyle('All');
            }}
            className="mt-3 px-4 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
