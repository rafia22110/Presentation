import React, { useEffect, useRef } from 'react';

interface PixelCanvasProps {
  dayIndex: number;
  magicBurst: number;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({ dayIndex, magicBurst }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animTick = 0;

    const pRect = (x: number, y: number, w: number, h: number, col: string) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    };

    const pCircle = (cx: number, cy: number, r: number, col: string) => {
      ctx.fillStyle = col;
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          if (x * x + y * y <= r * r) {
            ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
          }
        }
      }
    };

    const drawPixelSparkle = (x: number, y: number, phase: number, color = '#FFF59D') => {
      const s = Math.sin(phase) > 0 ? 1 : 0;
      pRect(x, y, 1, 1, '#FFFFFF');
      if (s) {
        pRect(x - 2, y, 5, 1, color);
        pRect(x, y - 2, 1, 5, color);
      } else {
        pRect(x - 1, y, 3, 1, color);
        pRect(x, y - 1, 1, 3, color);
      }
    };

    const drawPixelCloud = (x: number, y: number, color = '#FFFFFF', shade = '#DCE8F5') => {
      pRect(x + 4, y + 6, 22, 6, shade);
      pRect(x + 2, y + 4, 24, 6, color);
      pCircle(x + 8, y + 4, 5, color);
      pCircle(x + 15, y + 2, 6, color);
      pCircle(x + 22, y + 5, 4, color);
    };

    const drawPixelTree = (x: number, y: number, fruitColor = '#FF3B30') => {
      pRect(x + 8, y + 16, 6, 16, '#6E4720');
      pRect(x + 9, y + 16, 2, 16, '#8B5A2B');
      pCircle(x + 11, y + 11, 10, '#1E7E34');
      pCircle(x + 6, y + 13, 7, '#28A745');
      pCircle(x + 16, y + 13, 7, '#218838');
      pCircle(x + 11, y + 7, 7, '#48C774');
      if (fruitColor) {
        pRect(x + 6, y + 9, 2, 2, fruitColor);
        pRect(x + 14, y + 7, 2, 2, fruitColor);
        pRect(x + 11, y + 14, 2, 2, fruitColor);
        pRect(x + 16, y + 13, 2, 2, fruitColor);
      }
    };

    const render = () => {
      animTick++;
      const t = animTick * 0.05;
      ctx.clearRect(0, 0, 160, 120);

      if (dayIndex === 0) {
        for (let y = 0; y < 120; y += 2) {
          const c = Math.floor(20 + (y / 120) * 40);
          pRect(0, y, 160, 2, `rgb(${c}, ${Math.floor(c * 0.6)}, ${c + 45})`);
        }
        for (let i = 0; i < 18; i++) {
          const sx = (i * 37) % 155 + 2;
          const sy = (i * 23) % 110 + 4;
          drawPixelSparkle(sx, sy, t + i);
        }
        const gy = 55 + Math.sin(t) * 3;
        pCircle(80, gy, 32, 'rgba(255, 215, 0, 0.2)');
        pCircle(80, gy, 26, '#1E90FF');
        pCircle(74, gy - 6, 9, '#2ECC71');
        pCircle(86, gy + 4, 8, '#27AE60');
        pCircle(70, gy + 8, 6, '#2ECC71');
        pRect(62 + Math.sin(t * 0.8) * 6, gy - 12, 14, 3, '#FFFFFF');
        pRect(80 - Math.sin(t * 0.8) * 6, gy + 6, 16, 3, '#FFFFFF');

      } else if (dayIndex === 1) {
        pRect(0, 0, 160, 120, '#0D0B26');
        pRect(0, 0, 80, 120, '#FFF3B0');
        pRect(0, 0, 70, 120, '#FFE066');
        pCircle(35, 55, 22 + Math.sin(t * 2) * 3, '#FFF9DB');
        pCircle(35, 55, 14, '#FFFFFF');
        pRect(80, 0, 2, 120, '#FFD700');
        drawPixelSparkle(80, 30, t * 2);
        drawPixelSparkle(80, 60, t * 2 + 1);
        drawPixelSparkle(80, 90, t * 2 + 2);

      } else if (dayIndex === 2) {
        pRect(0, 0, 160, 82, '#74B9FF');
        pRect(0, 25, 160, 57, '#A29BFE');
        pRect(0, 40, 160, 42, '#81ECEC');
        const cx1 = (animTick * 0.4) % 180 - 20;
        const cx2 = (animTick * 0.25 + 70) % 180 - 20;
        drawPixelCloud(cx1, 10, '#FFFFFF', '#DFE6E9');
        drawPixelCloud(cx2, 18, '#FFFFFF', '#DFE6E9');
        for (let i = 0; i < 16; i++) {
          const rx = (i * 14 + 8) % 150;
          const ry = (animTick * 2 + i * 17) % 55 + 24;
          pRect(rx, ry, 1, 4, '#0984E3');
        }
        pRect(0, 80, 160, 40, '#0984E3');
        pRect(0, 92, 160, 28, '#0652DD');

      } else if (dayIndex === 3) {
        pRect(0, 0, 160, 75, '#81ECEC');
        drawPixelCloud(20, 10);
        pRect(0, 75, 55, 45, '#0984E3');
        pCircle(110, 95, 55, '#27AE60');
        pRect(50, 75, 110, 45, '#2ECC71');
        drawPixelTree(122, 46, '#FF3B30');
        drawPixelTree(82, 50, '#FFA502');

      } else if (dayIndex === 4) {
        pRect(0, 0, 80, 100, '#48CAE4');
        pRect(80, 0, 80, 100, '#1D1135');
        pRect(74, 0, 12, 100, '#7209B7');
        const sunY = 36 + Math.sin(t) * 2;
        pCircle(40, sunY, 18, '#FFD166');
        pCircle(40, sunY, 14, '#FFBE0B');
        const moonY = 36 - Math.sin(t) * 2;
        pCircle(122, moonY, 13, '#FEF9EF');
        pCircle(127, moonY - 3, 10, '#1D1135');
        for (let i = 0; i < 12; i++) {
          drawPixelSparkle(88 + (i * 17) % 68, 10 + (i * 19) % 70, t + i);
        }
        pRect(0, 95, 160, 25, '#2D6A4F');

      } else if (dayIndex === 5) {
        pRect(0, 0, 160, 62, '#90E0EF');
        drawPixelCloud(15, 8);
        for (let b = 0; b < 4; b++) {
          const bx = (animTick * 0.8 + b * 38) % 160;
          const by = 22 + Math.sin(t * 2 + b) * 6 + b * 5;
          pRect(bx, by, 5, 3, '#FF6B6B');
        }
        pRect(0, 62, 160, 58, '#0077B6');
        const dPhase = (animTick % 100) / 100;
        const dx = 30 + dPhase * 90;
        const dy = 68 - Math.sin(dPhase * Math.PI) * 28;
        pRect(dx, dy, 12, 6, '#ADE8F4');

      } else if (dayIndex === 6) {
        pRect(0, 0, 160, 68, '#A8DADC');
        pCircle(138, 20, 11, '#FFD166');
        pRect(0, 68, 160, 52, '#52B788');
        drawPixelTree(12, 38, '#E63946');
        const bob = Math.sin(t * 2) > 0 ? 1 : 0;
        pRect(68, 52 + bob, 8, 8, '#F4A261');
        pRect(67, 60 + bob, 10, 14, '#2A9D8F');
        pRect(84, 53 + bob, 8, 8, '#F4A261');
        pRect(83, 61 + bob, 10, 13, '#E76F51');

      } else if (dayIndex === 7) {
        pRect(0, 0, 160, 120, '#1B1438');
        for (let i = 0; i < 16; i++) {
          drawPixelSparkle((i * 29) % 150 + 5, (i * 17) % 65 + 5, t + i);
        }
        pRect(20, 78, 120, 42, '#FFFFFF');
        pRect(20, 78, 120, 4, '#FFD700');
        [56, 72].forEach((cx, idx) => {
          pRect(cx, 66, 4, 12, '#FFD700');
          pRect(cx + 1, 54, 2, 12, '#FFFDF5');
          const flameOffset = Math.sin(t * 4 + idx) * 1;
          pRect(cx + 1 + flameOffset, 48, 2, 5, '#FF9F1C');
        });
      }

      if (magicBurst > 0) {
        for (let m = 0; m < 8; m++) {
          const mx = (m * 37 + magicBurst * 5) % 145 + 8;
          const my = (m * 23 + magicBurst * 3) % 100 + 10;
          drawPixelSparkle(mx, my, magicBurst * 0.5, '#FFD700');
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dayIndex, magicBurst]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={120}
      className="pixel-canvas w-full h-full object-cover"
    />
  );
};
