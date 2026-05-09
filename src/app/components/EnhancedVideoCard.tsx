import { useState, useRef, useCallback } from "react";
import { Eye, Play, Heart, Bookmark } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  thumb: string;
  views: string;
  duration: string;
  vip: boolean;
  coins?: number;
}

interface EnhancedVideoCardProps {
  video: VideoData;
  onClick: () => void;
  index: number;
}

function VipBadge() {
  return (
    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-yellow-500 to-amber-400 text-black leading-none">
      VIP
    </span>
  );
}

function CoinBadge({ amount }: { amount: number }) {
  return (
    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-orange-500 to-yellow-500 text-white leading-none">
      {amount}金币
    </span>
  );
}

export function EnhancedVideoCard({ video, onClick, index }: EnhancedVideoCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!cardRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();

      if (diffX > 0) {
        setSwipeDirection('right');
      } else {
        setSwipeDirection('left');
      }

      const rotation = diffX / 20;
      const scale = 1 - Math.abs(diffX) / 500;
      cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg) scale(${scale})`;
      cardRef.current.style.transition = 'none';
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!cardRef.current) return;

    const currentX = e.changedTouches[0].clientX;
    const diffX = currentX - startX.current;

    if (Math.abs(diffX) > 80) {
      if (diffX > 0) {
        setIsSaved(true);
        vibrate([10, 20, 10]);
      } else {
        setIsLiked(true);
        vibrate(10);
      }
    }

    cardRef.current.style.transform = '';
    cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    setSwipeDirection(null);
  }, [vibrate]);

  return (
    <div className="relative">
      <style>{`
        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes heartPop {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.05); }
        }

        @keyframes bookmarkSlide {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .enhanced-card {
          animation: cardSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
        }

        .liked-icon {
          animation: heartPop 0.4s ease-out;
        }

        .saved-icon {
          animation: bookmarkSlide 0.4s ease-out;
        }
      `}</style>

      {swipeDirection === 'left' && (
        <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      )}
      {swipeDirection === 'right' && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center backdrop-blur-sm">
            <Bookmark className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className="enhanced-card w-full text-left active:scale-[0.97] transition-transform cursor-pointer"
        style={{ animationDelay: `${index * 0.05}s` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (!swipeDirection) {
            onClick();
            vibrate(5);
          }
        }}
      >
        <div className="relative rounded-xl overflow-hidden bg-muted mb-1.5 group" style={{ aspectRatio: "3/4" }}>
          <img
            src={`https://images.unsplash.com/photo-${video.thumb}?w=200&h=267&fit=crop&auto=format`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute top-1.5 left-1.5">
            {video.vip ? <VipBadge /> : video.coins ? <CoinBadge amount={video.coins} /> : null}
          </div>

          <div className="absolute bottom-1.5 right-1.5 bg-black/50 px-1.5 py-0.5 rounded text-[9px] text-white/90">
            {video.duration}
          </div>

          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 text-[9px] text-white/70">
            <Eye className="w-2.5 h-2.5" />
            {video.views}
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>

          {isLiked && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Heart className="w-16 h-16 text-primary fill-primary liked-icon" />
            </div>
          )}

          {isSaved && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Bookmark className="w-16 h-16 text-accent fill-accent saved-icon" />
            </div>
          )}
        </div>

        <p className="text-xs text-foreground line-clamp-2 leading-tight">{video.title}</p>
      </div>
    </div>
  );
}
