import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // 磁场源点（可以移动的）
    const fieldSources = [
      { x: width * 0.3, y: height * 0.3, strength: 1, vx: 0.2, vy: 0.15 },
      { x: width * 0.7, y: height * 0.6, strength: -0.8, vx: -0.15, vy: 0.2 },
      { x: width * 0.5, y: height * 0.8, strength: 0.6, vx: 0.1, vy: -0.1 },
    ];

    // 计算某点的场强
    const getFieldStrength = (x: number, y: number): { fx: number; fy: number } => {
      let fx = 0;
      let fy = 0;
      
      fieldSources.forEach(source => {
        const dx = x - source.x;
        const dy = y - source.y;
        const distSq = dx * dx + dy * dy + 1;
        const force = source.strength / distSq;
        
        // 创建旋转场效果
        fx += (-dy * force * 0.5);
        fy += (dx * force * 0.5);
      });
      
      return { fx, fy };
    };

    // 生成流线（磁场线）
    const generateFieldLine = (startX: number, startY: number, direction: number) => {
      const points = [];
      let x = startX;
      let y = startY;
      const stepSize = 3;
      const maxSteps = 200;

      for (let i = 0; i < maxSteps; i++) {
        if (x < 0 || x > width || y < 0 || y > height) break;
        
        points.push({ x, y });
        
        const field = getFieldStrength(x, y);
        const magnitude = Math.sqrt(field.fx * field.fx + field.fy * field.fy);
        
        if (magnitude < 0.01) break;
        
        x += (field.fx / magnitude) * stepSize * direction;
        y += (field.fy / magnitude) * stepSize * direction;
      }
      
      return points;
    };

    // 生成所有流线
    const fieldLines: Array<Array<{ x: number; y: number }>> = [];
    const lineCount = width < 768 ? 30 : 50;
    
    for (let i = 0; i < lineCount; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const direction = Math.random() > 0.5 ? 1 : -1;
      fieldLines.push(generateFieldLine(startX, startY, direction));
    }

    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      time += 0.01;
      
      // 更新磁场源位置
      fieldSources.forEach(source => {
        source.x += source.vx;
        source.y += source.vy;
        
        if (source.x < 0 || source.x > width) source.vx *= -1;
        if (source.y < 0 || source.y > height) source.vy *= -1;
      });

      // 清空画布
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, width, height);

      // 重新生成流线（每几帧更新一次）
      if (Math.floor(time * 10) % 3 === 0) {
        fieldLines.length = 0;
        for (let i = 0; i < lineCount; i++) {
          const startX = Math.random() * width;
          const startY = Math.random() * height;
          const direction = Math.random() > 0.5 ? 1 : -1;
          fieldLines.push(generateFieldLine(startX, startY, direction));
        }
      }

      // 绘制流线
      fieldLines.forEach((line, lineIndex) => {
        if (line.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        
        for (let i = 1; i < line.length; i++) {
          ctx.lineTo(line[i].x, line[i].y);
        }
        
        // 根据线的位置和时间创建颜色变化
        const hue = (lineIndex * 30 + time * 20) % 360;
        const saturation = 70 + Math.sin(time + lineIndex) * 20;
        const lightness = 40 + Math.sin(time * 0.5 + lineIndex) * 10;
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
        ctx.lineWidth = 1 + Math.sin(time + lineIndex * 0.5) * 0.5;
        ctx.stroke();
      });

      // 绘制磁场源（可选）
      fieldSources.forEach(source => {
        const gradient = ctx.createRadialGradient(source.x, source.y, 0, source.x, source.y, 30);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.3)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(source.x, source.y, 30, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: '#000000' }}
    />
  );
};

export default ParticleBackground;
