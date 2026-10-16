export type VideoStyle = '3D Cyberpunk' | 'Cinematic' | 'Anime' | 'Realistic';
export type VideoLength = '5s' | '10s' | '30s';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type CameraMovement = 'Pan' | 'Zoom' | 'Tilt' | 'Orbit';
export type VideoResolution = '1080p FHD' | '4K UHD';

export interface VideoItem {
  id: string;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  style: VideoStyle;
  length: VideoLength;
  ratio: AspectRatio;
  camera: CameraMovement;
  resolution: VideoResolution;
  fps: number;
  seed: number;
  motionStrength: number;
  createdAt: string;
  likes: number;
  views: number;
  isLiked?: boolean;
  thumbnail: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  tags: string[];
}

export interface GenerationConfig {
  prompt: string;
  length: VideoLength;
  ratio: AspectRatio;
  style: VideoStyle;
  camera: CameraMovement;
  resolution: VideoResolution;
  motionStrength: number;
  seed: number;
}
