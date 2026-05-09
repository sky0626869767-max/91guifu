import { ReactNode } from "react";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
}

export function GlassmorphicCard({
  children,
  className = "",
  blur = "md",
  opacity = 0.1
}: GlassmorphicCardProps) {
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  return (
    <div
      className={`${blurMap[blur]} ${className}`}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      {children}
    </div>
  );
}

// 深色毛玻璃卡片
export function DarkGlassCard({
  children,
  className = "",
  blur = "md",
  opacity = 0.15
}: GlassmorphicCardProps) {
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  return (
    <div
      className={`${blurMap[blur]} ${className}`}
      style={{
        background: `rgba(22, 13, 30, ${opacity})`,
        border: "1px solid rgba(232, 23, 93, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
      }}
    >
      {children}
    </div>
  );
}

// 渐变玻璃卡片
export function GradientGlassCard({
  children,
  className = ""
}: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`backdrop-blur-md ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(22, 13, 30, 0.85) 0%, rgba(22, 13, 30, 0.90) 100%)",
        border: "1px solid rgba(232, 23, 93, 0.25)",
        boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(232, 23, 93, 0.05)",
      }}
    >
      {children}
    </div>
  );
}
