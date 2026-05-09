import { useState, useEffect } from "react";
import { X, Heart, Bookmark, ZapOff, ArrowUp } from "lucide-react";

interface GestureTutorialProps {
  onClose: () => void;
}

export function GestureTutorial({ onClose }: GestureTutorialProps) {
  const [step, setStep] = useState(0);

  const gestures = [
    {
      icon: <ArrowUp className="w-12 h-12 text-primary" />,
      title: "上下滑动",
      description: "在沉浸式播放器中上下滑动切换视频",
      demo: "swipe-vertical",
    },
    {
      icon: <Heart className="w-12 h-12 text-primary fill-primary" />,
      title: "双击点赞",
      description: "在视频中心区域快速双击即可点赞",
      demo: "double-tap",
    },
    {
      icon: <Bookmark className="w-12 h-12 text-accent fill-accent" />,
      title: "左滑点赞 · 右滑收藏",
      description: "在视频卡片上左右滑动快速操作",
      demo: "swipe-horizontal",
    },
    {
      icon: <ZapOff className="w-12 h-12 text-amber-400" />,
      title: "长按加速",
      description: "长按视频可以加速播放（暂未实现）",
      demo: "long-press",
    },
  ];

  const currentGesture = gestures[step];

  useEffect(() => {
    if (step < gestures.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, gestures.length]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <style>{`
        @keyframes swipeVertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes doubleTap {
          0%, 100% { transform: scale(1); }
          25%, 75% { transform: scale(1.2); }
          50% { transform: scale(0.9); }
        }

        @keyframes swipeHorizontal {
          0%, 100% { transform: translateX(0); }
          33% { transform: translateX(-20px); }
          66% { transform: translateX(20px); }
        }

        @keyframes longPress {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.7; }
        }

        .demo-swipe-vertical {
          animation: swipeVertical 2s ease-in-out infinite;
        }

        .demo-double-tap {
          animation: doubleTap 1.5s ease-in-out infinite;
        }

        .demo-swipe-horizontal {
          animation: swipeHorizontal 2s ease-in-out infinite;
        }

        .demo-long-press {
          animation: longPress 2s ease-in-out infinite;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .tutorial-card {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>

      <div className="tutorial-card bg-card rounded-3xl p-8 max-w-sm w-full border border-primary/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">手势操作指南</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center active:scale-90 transition-transform"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center justify-center mb-8 h-32">
          <div className={`demo-${currentGesture.demo} flex items-center justify-center`}>
            {currentGesture.icon}
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">{currentGesture.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentGesture.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {gestures.map((_, index) => (
            <button
              key={index}
              onClick={() => setStep(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === step
                  ? 'w-8 bg-primary'
                  : index < step
                  ? 'w-1.5 bg-primary/50'
                  : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step < gestures.length - 1 ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-semibold active:scale-95 transition-transform"
              >
                跳过
              </button>
              <button
                onClick={() => setStep(prev => Math.min(gestures.length - 1, prev + 1))}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold active:scale-95 transition-transform"
              >
                下一步
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold active:scale-95 transition-transform"
            >
              开始体验
            </button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          轻触屏幕任意位置可暂停/播放
        </p>
      </div>
    </div>
  );
}
