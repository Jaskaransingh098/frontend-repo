import React, { useEffect, useRef } from "react";
import "./AnimateBackground.css";

const AnimateBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    const createParticle = (x, y) => {
      return {
        x,
        y,
        size: Math.random() * 2 + 1,
        alpha: 1,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      };
    };

    const mouseMove = (e) => {
      for (let i = 0; i < 3; i++) {
        particles.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    window.addEventListener("mousemove", mouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.current.forEach((p, index) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.01;
        p.size *= 0.98;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.current.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = "#219ebc";
          ctx.shadowBlur = 10;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="mouse-particles-canvas" />;
};

export default AnimateBackground;
