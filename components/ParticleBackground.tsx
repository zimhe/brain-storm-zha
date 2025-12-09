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

    // 生成流线（磁场线）- 稳定版本
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

    // 生成固定的流线起点网格
    const fieldLines: Array<{ points: Array<{ x: number; y: number }>; color: string }> = [];
    const gridSize = width < 768 ? 60 : 40;
    
    const initializeFieldLines = () => {
      fieldLines.length = 0;
      for (let gx = 0; gx < width; gx += gridSize) {
        for (let gy = 0; gy < height; gy += gridSize) {
          // 添加一些随机偏移
          const startX = gx + (Math.random() - 0.5) * gridSize * 0.5;
          const startY = gy + (Math.random() - 0.5) * gridSize * 0.5;
          const points = generateFieldLine(startX, startY);
          
          if (points.length > 10) {
            // 根据起点位置确定颜色
            const hue = (gx / width * 180 + gy / height * 180) % 360;
            fieldLines.push({ 
              points, 
              color: `hsla(${hue}, 70%, 50%, 0.4)`
            });
          }
        }
      }
    };

    initializeFieldLines();

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

      // 每隔一段时间重新生成流线
      if (Math.floor(time * 20) % 100 === 0) {
        initializeFieldLines();
      }

      // 半透明清空，产生拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // 绘制流线
      fieldLines.forEach((line) => {
        if (line.points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        
        for (let i = 1; i < line.points.length; i++) {
          ctx.lineTo(line.points[i].x, line.points[i].y);
        }
        
        ctx.strokeStyle = line.color;
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
      initializeFieldLines();
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
