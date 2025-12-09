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

    // 动态磁场源点：增加到6个，类型包括 spin/attract/repel
    // 每个 source 有 baseStrength, freq, phase，用于随时间震荡强度
    const fieldSources: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: 'spin' | 'attract' | 'repel';
      baseStrength: number;
      freq: number;
      phase: number;
    }> = [];

    const types: Array<'spin' | 'attract' | 'repel'> = ['spin', 'attract', 'repel'];
    const sourceCount = 6;
    for (let i = 0; i < sourceCount; i++) {
      const t = types[i % types.length];
      const base = t === 'attract' ? 220 : t === 'repel' ? -220 : 180; // 放大吸引/排斥强度
      fieldSources.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        type: t,
        baseStrength: base * (0.8 + Math.random() * 0.6),
        freq: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 计算某点的场强（根据不同类型）
    const getFieldStrength = (x: number, y: number, ttime: number): { fx: number; fy: number } => {
      let fx = 0;
      let fy = 0;

      fieldSources.forEach(source => {
        // 动态强度随时间变化
        const currentStrength = source.baseStrength * (1 + 0.5 * Math.sin(ttime * source.freq + source.phase));

        const dx = x - source.x;
        const dy = y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 10; // 加入偏移防止过强
        const force = currentStrength / (dist * dist * 0.001 + 1);

        if (source.type === 'spin') {
          // 旋转场：垂直于半径方向
          fx += -dy * force * 0.02;
          fy += dx * force * 0.02;
        } else if (source.type === 'attract') {
          // 吸引场：指向中心
          fx += -dx * force * 0.02;
          fy += -dy * force * 0.02;
        } else if (source.type === 'repel') {
          // 排斥场：远离中心
          fx += dx * force * 0.02;
          fy += dy * force * 0.02;
        }
      });

      return { fx, fy };
    };

    // 生成流线（磁场线）- 实时计算
    const generateFieldLine = (startX: number, startY: number, ttime: number) => {
      const points = [];
      let x = startX;
      let y = startY;
      const stepSize = 2;
      const maxSteps = 300;

      for (let i = 0; i < maxSteps; i++) {
        if (x < -50 || x > width + 50 || y < -50 || y > height + 50) break;
        
        points.push({ x, y });
        
        const field = getFieldStrength(x, y, ttime);
        const magnitude = Math.sqrt(field.fx * field.fx + field.fy * field.fy);
        
        if (magnitude < 0.001) break;
        
        x += field.fx * stepSize;
        y += field.fy * stepSize;
      }
      
      return points;
    };

    // 随机生成稀疏的流线起点
    const lineStarts: Array<{ x: number; y: number; hue: number }> = [];
    const lineCount = width < 768 ? 50 : 80; // 稀疏线条数量
    
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

      // 完全清空画布，不使用拖尾
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 实时生成并绘制流线（传入当前时间用于动态强度）
      lineStarts.forEach((start) => {
        const points = generateFieldLine(start.x, start.y, time);
        
        if (points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        // 简单的等宽2D线条
        ctx.strokeStyle = `hsla(${start.hue}, 70%, 60%, 0.8)`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
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
        
          // 简单的点源表示：空心圆（无光晕、无符号）
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(source.x, source.y, 4, 0, Math.PI * 2);
          ctx.stroke();
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
