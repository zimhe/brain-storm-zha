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

    // 磁场源点，包含不同类型：spin(旋转)、attract(吸引)、repel(排斥)
    const fieldSources = [
      { x: width * 0.25, y: height * 0.3, strength: 150, vx: 0.3, vy: 0.2, type: 'spin' as const },
      { x: width * 0.75, y: height * 0.4, strength: 120, vx: -0.25, vy: 0.25, type: 'attract' as const },
      { x: width * 0.5, y: height * 0.7, strength: -100, vx: 0.2, vy: -0.3, type: 'repel' as const },
      { x: width * 0.6, y: height * 0.2, strength: 80, vx: -0.15, vy: 0.15, type: 'spin' as const },
    ];

    // 计算某点的场强（根据不同类型）
    const getFieldStrength = (x: number, y: number): { fx: number; fy: number } => {
      let fx = 0;
      let fy = 0;
      
      fieldSources.forEach(source => {
        const dx = x - source.x;
        const dy = y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const force = source.strength / dist;
        
        if (source.type === 'spin') {
          // 旋转场：垂直于半径方向
          fx += -dy * force * 0.01;
          fy += dx * force * 0.01;
        } else if (source.type === 'attract') {
          // 吸引场：指向中心
          fx += -dx * force * 0.01;
          fy += -dy * force * 0.01;
        } else if (source.type === 'repel') {
          // 排斥场：远离中心
          fx += dx * force * 0.01;
          fy += dy * force * 0.01;
        }
      });
      
      return { fx, fy };
    };

    // 生成流线（磁场线）- 实时计算
    const generateFieldLine = (startX: number, startY: number) => {
      const points = [];
      let x = startX;
      let y = startY;
      const stepSize = 2;
      const maxSteps = 300;

      for (let i = 0; i < maxSteps; i++) {
        if (x < -50 || x > width + 50 || y < -50 || y > height + 50) break;
        
        points.push({ x, y });
        
        const field = getFieldStrength(x, y);
        const magnitude = Math.sqrt(field.fx * field.fx + field.fy * field.fy);
        
        if (magnitude < 0.001) break;
        
        x += field.fx * stepSize;
        y += field.fy * stepSize;
      }
      
      return points;
    };

    // 随机生成稀疏的流线起点
    const lineStarts: Array<{ x: number; y: number; hue: number }> = [];
    const lineCount = width < 768 ? 50 : 80; // 减少线条数量
    
    const initializeLineStarts = () => {
      lineStarts.length = 0;
      for (let i = 0; i < lineCount; i++) {
        lineStarts.push({
          x: Math.random() * width,
          y: Math.random() * height,
          hue: Math.random() * 360
        });
      }
    };

    initializeLineStarts();

    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      time += 0.005;
      
      // 缓慢更新磁场源位置
      fieldSources.forEach(source => {
        source.x += source.vx;
        source.y += source.vy;
        
        if (source.x < 100 || source.x > width - 100) source.vx *= -1;
        if (source.y < 100 || source.y > height - 100) source.vy *= -1;
      });

      // 清空画布（降低透明度以产生轻微拖尾）
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // 实时生成并绘制流线
      lineStarts.forEach((start) => {
        const points = generateFieldLine(start.x, start.y);
        
        if (points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.strokeStyle = `hsla(${start.hue}, 70%, 50%, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 绘制磁场源标记
      fieldSources.forEach(source => {
        // 根据类型选择颜色和样式
        let color = '';
        let symbol = '';
        
        if (source.type === 'spin') {
          color = 'rgba(100, 200, 255, 0.8)'; // 青色 - 旋转
          symbol = '⟳';
        } else if (source.type === 'attract') {
          color = 'rgba(255, 100, 100, 0.8)'; // 红色 - 吸引
          symbol = '⊕';
        } else if (source.type === 'repel') {
          color = 'rgba(100, 255, 100, 0.8)'; // 绿色 - 排斥
          symbol = '⊖';
        }
        
        // 光晕
        const gradient = ctx.createRadialGradient(source.x, source.y, 0, source.x, source.y, 40);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(source.x, source.y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // 中心点
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(source.x, source.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 符号
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, source.x, source.y);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initializeLineStarts();
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
