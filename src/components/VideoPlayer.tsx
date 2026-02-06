import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, CheckCircle2, Lock } from 'lucide-react';
import { Progress } from './ui/progress';

interface Video {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  isLocked: boolean;
  isCompleted: boolean;
}

interface VideoPlayerProps {
  moduleId: number;
  moduleTitle: string;
}

const getVideosForModule = (moduleId: number): Video[] => {
  return [
    {
      id: 1,
      title: `Introduction to ${moduleId === 1 ? 'Next.js Setup' : 'Module Concepts'}`,
      duration: "8:24",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
      videoUrl: "https://www.youtube.com/embed/SccSCuHhOw0", // Next.js 13 Crash Course (Traversy Media - placeholder)
      isLocked: false,
      isCompleted: true
    },
    {
      id: 2,
      title: "Deep Dive: Core Concepts",
      duration: "15:42",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
      videoUrl: "https://www.youtube.com/embed/843nec-IvW0", // Next.js Full Course (placeholder)
      isLocked: false,
      isCompleted: true
    },
    {
      id: 3,
      title: "Hands-On: Building Components",
      duration: "22:15",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
      videoUrl: "https://www.youtube.com/embed/ZVnjOPwW4ZA", // React Tutorial (placeholder)
      isLocked: false,
      isCompleted: false
    },
    {
      id: 4,
      title: "Advanced Patterns & Best Practices",
      duration: "18:30",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
      videoUrl: "https://www.youtube.com/embed/_w0Ikk4JY7U", // Advanced React (placeholder)
      isLocked: true,
      isCompleted: false
    },
    {
      id: 5,
      title: "Real-World Project Walkthrough",
      duration: "35:00",
      thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=225&fit=crop",
      videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk", // E-commerce build (placeholder)
      isLocked: true,
      isCompleted: false
    },
  ];
};

const VideoPlayer = ({ moduleId, moduleTitle }: VideoPlayerProps) => {
  const videos = getVideosForModule(moduleId);
  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const completedCount = videos.filter(v => v.isCompleted).length;
  const totalDuration = videos.reduce((acc, v) => {
    const [mins, secs] = v.duration.split(':').map(Number);
    return acc + mins + (secs / 60);
  }, 0);

  const handleVideoSelect = (video: Video) => {
    if (!video.isLocked) {
      setSelectedVideo(video);
      setIsPlaying(false); // Reset playing state when switching videos
      setProgress(0);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Video Lessons
          </CardTitle>
          <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
            {completedCount}/{videos.length} Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
          {isPlaying ? (
            <iframe
              width="100%"
              height="100%"
              src={`${selectedVideo.videoUrl}?autoplay=1`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          ) : (
            <>
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-20 h-20 rounded-full bg-primary/90 border-0 hover:bg-primary hover:scale-110 transition-all pl-2"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-10 w-10 text-primary-foreground fill-current" />
                </Button>
              </div>

              {/* Video info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h4 className="text-white font-semibold mb-1 text-lg">{selectedVideo.title}</h4>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Clock className="h-4 w-4" />
                  {selectedVideo.duration}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{videos.length}</div>
            <div className="text-xs text-muted-foreground">Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{Math.round(totalDuration)}m</div>
            <div className="text-xs text-muted-foreground">Total Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{Math.round((completedCount / videos.length) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Progress</div>
          </div>
        </div>

        {/* Video List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">All Lessons</h4>
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              disabled={video.isLocked}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selectedVideo.id === video.id
                  ? 'border-primary bg-primary/10'
                  : video.isLocked
                    ? 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                    : 'border-border hover:border-primary/50 hover:bg-card/50'
                }`}
            >
              <div className="relative w-20 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                {video.isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                )}
                {selectedVideo.id === video.id && isPlaying && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{index + 1}.</span>
                  <span className={`font-medium truncate text-sm ${selectedVideo.id === video.id ? 'text-primary' : ''}`}>
                    {video.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{video.duration}</span>
                </div>
              </div>
              {video.isCompleted && (
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
