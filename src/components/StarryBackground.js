import React, { useEffect, useRef } from 'react';
import '../styles/starry-background.css';

const StarryBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isDarkMode = true; // Always use dark mode

  useEffect(() => {
    console.log('StarryBackground component mounted');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    console.log('StarryBackground canvas initialized', canvas.width, canvas.height);
    let stars = [];
    let shootingStars = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Create stars - optimized for performance
    const createStars = (count) => {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.1 + 0.5, // Smaller stars for better performance
          opacity: Math.random() * 0.3 + 0.2, // Lower opacity
          twinkleSpeed: Math.random() * 0.001 + 0.0002, // Slower blinking
          twinklePhase: Math.random() * Math.PI * 2,
          color: 'white'
        });
      }
    };

    // Create shooting star - optimized for performance
    const createShootingStar = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        length: Math.random() * 60 + 20, // Shorter trails
        speed: Math.random() * 8 + 4, // Slower movement
        angle: Math.random() * Math.PI / 3 + Math.PI / 6,
        opacity: 1,
        life: 1,
        color: 'white' // Single color for better performance
      };
    };

    // Draw simple small star dots
    const drawStar = (star) => {
      const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase);
      const currentOpacity = star.opacity + twinkle * 0.2; // Subtle twinkle for small dots

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, currentOpacity);

      // Simple white stars for dark mode
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = star.size * 1.5; // Minimal glow for small dots

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Draw shooting star - optimized for performance
    const drawShootingStar = (shootingStar) => {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
      ctx.lineWidth = 2; // Thinner trails
      ctx.shadowBlur = 4; // Reduced shadow blur

      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
        shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
      );
      ctx.stroke();
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(drawStar);

      // Update and draw shooting stars
      shootingStars = shootingStars.filter(shootingStar => {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.life -= 0.01;
        shootingStar.opacity = shootingStar.life;

        if (shootingStar.life > 0 && 
            shootingStar.x < canvas.width + 100 && 
            shootingStar.y < canvas.height + 100) {
          drawShootingStar(shootingStar);
          return true;
        }
        return false;
      });

      // Randomly create shooting stars (less frequent)
      if (Math.random() < 0.002) {
        shootingStars.push(createShootingStar());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize with fewer stars for better performance
    resizeCanvas();
    createStars(40);
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      createStars(75);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDarkMode]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -100,
      overflow: 'hidden',
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, #050508 0%, #0a0a15 30%, #0f1420 60%, #0a1a2e 100%)'
    }}>
      {/* Main starry canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }} />

      {/* Enhanced nebula layers */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(75, 0, 130, 0.06) 0%, transparent 50%)',
        animation: 'nebulaFloat 8s ease-in-out infinite alternate'
      }}></div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 40% 70%, rgba(25, 25, 112, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(72, 61, 139, 0.03) 0%, transparent 50%)',
        animation: 'nebulaFloat 12s ease-in-out infinite alternate',
        animationDelay: '2s'
      }}></div>




    </div>
  );
};

export default StarryBackground;
