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
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; // semi-transparent black overlay
      ctx.fillRect(0, 0, width, height);

      particles.current.forEach((p, index) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.007;
        p.size *= 0.985;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.current.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size
          );
          gradient.addColorStop(0, `rgba(0, 0, 255, ${p.alpha})`); // bright blue center
          gradient.addColorStop(1, `rgba(0, 0, 0, 0)`); // fade to black/transparent

          ctx.fillStyle = gradient;
          ctx.shadowColor = "rgba(0, 0, 255, 0.6)";
          ctx.shadowBlur = 8;
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
