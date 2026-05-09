import { useEffect, useRef, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

export function MouseLightEffect() {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-300"
      style={{
        left: mousePos.x - 200,
        top: mousePos.y - 200,
        width: 400,
        height: 400,
        opacity: isVisible ? 0.15 : 0,
        background: "radial-gradient(circle, rgba(232, 23, 93, 0.2) 0%, rgba(139, 47, 201, 0.1) 30%, transparent 70%)",
        filter: "blur(40px)",
        mixBlendMode: "screen",
      }}
    />
  );
}

// 聚光灯效果
export function SpotlightEffect({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setSpotlightPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100"
        style={{
          background: `radial-gradient(circle 300px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(232, 23, 93, 0.15), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}

// 鼠标轨迹粒子
export function MouseTrailParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const hue = 340 + Math.random() * 40; // 红紫色调

      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          maxLife: 60,
          size: 2 + Math.random() * 3,
          hue,
        });
      }

      // 限制粒子数量
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        if (particle.life <= 0) return false;

        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
