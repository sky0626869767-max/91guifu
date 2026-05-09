import { useEffect, useRef } from "react";

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const colors = [
      { r: 232, g: 23, b: 93 },   // primary
      { r: 139, g: 47, b: 201 },  // accent
      { r: 194, g: 24, b: 91 },   // darker primary
      { r: 106, g: 27, b: 154 },  // darker accent
    ];

    const draw = () => {
      time += 0.003;

      // 创建渐变
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width, canvas.height
      );

      // 动态计算颜色
      const t = time;
      const c1 = {
        r: colors[0].r + Math.sin(t) * 30,
        g: colors[0].g + Math.cos(t * 1.3) * 20,
        b: colors[0].b + Math.sin(t * 0.7) * 40,
      };
      const c2 = {
        r: colors[1].r + Math.cos(t * 1.1) * 25,
        g: colors[1].g + Math.sin(t * 0.9) * 30,
        b: colors[1].b + Math.cos(t * 1.5) * 35,
      };
      const c3 = {
        r: colors[2].r + Math.sin(t * 0.8) * 20,
        g: colors[2].g + Math.cos(t * 1.2) * 25,
        b: colors[2].b + Math.sin(t * 1.4) * 30,
      };

      gradient.addColorStop(0, `rgba(${Math.floor(c1.r)}, ${Math.floor(c1.g)}, ${Math.floor(c1.b)}, 0.03)`);
      gradient.addColorStop(0.5, `rgba(${Math.floor(c2.r)}, ${Math.floor(c2.g)}, ${Math.floor(c2.b)}, 0.02)`);
      gradient.addColorStop(1, `rgba(${Math.floor(c3.r)}, ${Math.floor(c3.g)}, ${Math.floor(c3.b)}, 0.03)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加流体球体
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.3 + Math.sin(time * (0.5 + i * 0.2)) * 0.3);
        const y = canvas.height * (0.3 + Math.cos(time * (0.4 + i * 0.3)) * 0.3);
        const radius = 150 + Math.sin(time * (0.6 + i * 0.1)) * 50;

        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = colors[i % colors.length];
        radialGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.04)`);
        radialGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.02)`);
        radialGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
