import { useState, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Play, Volume2, VolumeX, Eye, MoreVertical, ArrowLeft } from "lucide-react";

interface VideoItem {
  id: string;
  thumb: string;
  author: string;
  avatar: string;
  caption: string;
  likes: string;
  comments: string;
  shares: string;
  views: string;
  music: string;
}

interface ImmersiveVideoPlayerProps {
  videos: VideoItem[];
  initialIndex?: number;
  onClose?: () => void;
}

export function ImmersiveVideoPlayer({ videos, initialIndex = 0, onClose }: ImmersiveVideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const lastTapTime = useRef(0);

  const currentVideo = videos[currentIndex];

  const vibrate = useCallback((pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleDoubleTap = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      setLiked(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }));
      vibrate(10);
      showLikeAnimation(e);
    }
    lastTapTime.current = now;
  }, [currentVideo?.id, vibrate]);

  const showLikeAnimation = (e: React.TouchEvent | React.MouseEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${touch.clientX}px`;
    heart.style.top = `${touch.clientY}px`;
    heart.style.fontSize = '60px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'likeFloat 1s ease-out forwards';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${diff}px)`;
      containerRef.current.style.transition = 'none';
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;

    const diff = currentY.current - startY.current;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        vibrate(5);
      } else if (diff < 0 && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1);
        vibrate(5);
      }
    }

    if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(0)';
      containerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    isDragging.current = false;
  }, [currentIndex, videos.length, vibrate]);

  if (!currentVideo) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <style>{`
        @keyframes likeFloat {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -150px) scale(1.5); opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .action-btn {
          animation: slideIn 0.3s ease-out backwards;
        }
        .action-btn:nth-child(1) { animation-delay: 0.1s; }
        .action-btn:nth-child(2) { animation-delay: 0.15s; }
        .action-btn:nth-child(3) { animation-delay: 0.2s; }
        .action-btn:nth-child(4) { animation-delay: 0.25s; }
        .action-btn:nth-child(5) { animation-delay: 0.3s; }
        .action-btn:nth-child(6) { animation-delay: 0.35s; }
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      )}

      <div
        ref={containerRef}
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        <div className="absolute inset-0">
          <img
            src={`https://images.unsplash.com/photo-${currentVideo.thumb}?w=400&h=800&fit=crop&auto=format`}
            alt={currentVideo.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        <div className="absolute top-0 left-0 right-0 pt-12 pb-6 px-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2 text-white/90">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{currentVideo.views}次播放</span>
            <span className="mx-2 text-white/40">·</span>
            <span className="text-sm">{currentIndex + 1}/{videos.length}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-20 px-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={`https://images.unsplash.com/photo-${currentVideo.avatar}?w=40&h=40&fit=crop&auto=format`}
                  alt={currentVideo.author}
                  className="w-10 h-10 rounded-full border-2 border-white/50"
                />
                <span className="text-white font-semibold text-sm">{currentVideo.author}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFollowed(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }));
                    vibrate(10);
                  }}
                  className={`px-4 py-1 rounded-full text-xs font-bold transition-all active:scale-90 ${
                    followed[currentVideo.id]
                      ? 'bg-white/20 text-white border border-white/40'
                      : 'bg-gradient-to-r from-[#e8175d] to-[#8b2fc9] text-white'
                  }`}
                >
                  {followed[currentVideo.id] ? '已关注' : '关注'}
                </button>
              </div>

              <p className="text-white text-sm mb-2 line-clamp-2 leading-relaxed">
                {currentVideo.caption}
              </p>

              <div className="flex items-center gap-2 text-white/80 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e8175d] to-[#8b2fc9] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
                <span className="truncate">♪ {currentVideo.music}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center pb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }));
                  vibrate(10);
                }}
                className="action-btn flex flex-col items-center gap-1 active:scale-90 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${
                  liked[currentVideo.id] ? 'bg-[#e8175d]/30' : 'bg-black/30'
                }`}>
                  <Heart className={`w-6 h-6 ${liked[currentVideo.id] ? 'fill-[#e8175d] text-[#e8175d]' : 'text-white'}`} />
                </div>
                <span className="text-white text-xs font-medium">{currentVideo.likes}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  vibrate(5);
                }}
                className="action-btn flex flex-col items-center gap-1 active:scale-90 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-medium">{currentVideo.comments}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSaved(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }));
                  vibrate(10);
                }}
                className="action-btn flex flex-col items-center gap-1 active:scale-90 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${
                  saved[currentVideo.id] ? 'bg-[#8b2fc9]/30' : 'bg-black/30'
                }`}>
                  <Bookmark className={`w-6 h-6 ${saved[currentVideo.id] ? 'fill-[#8b2fc9] text-[#8b2fc9]' : 'text-white'}`} />
                </div>
                <span className="text-white text-xs font-medium">收藏</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  vibrate([5, 50, 5]);
                }}
                className="action-btn flex flex-col items-center gap-1 active:scale-90 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-medium">{currentVideo.shares}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted(prev => !prev);
                  vibrate(5);
                }}
                className="action-btn w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
              >
                {muted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  vibrate(5);
                }}
                className="action-btn w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {currentIndex === 0 && (
          <div className="absolute left-1/2 bottom-32 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 floating-icon pointer-events-none">
            <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-3 rounded-full bg-white/70 animate-bounce" />
            </div>
            <span className="text-white/70 text-xs">上滑查看更多</span>
          </div>
        )}
      </div>
    </div>
  );
}
