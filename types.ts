export interface ProcessImage {
  id: string;
  url: string;
  thumbnail: string;
  timestamp: string;
  description: string;
  width: number;
  height: number;
}

export interface ProcessData {
  guid: string;
  createdAt: string;
  images: ProcessImage[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}
