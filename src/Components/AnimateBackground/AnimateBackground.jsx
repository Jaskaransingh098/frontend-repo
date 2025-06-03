import React, { useEffect, useRef } from "react";
import "./AnimateBackground.css";

const AnimatedBackground = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * 15;
      const offsetY = (e.clientY / innerHeight - 0.5) * 15;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="ab-wrapper">
      <div className="ab-parallax" ref={parallaxRef}>
        <div className="ab-sphere ab-sphere1" />
        <div className="ab-sphere ab-sphere2" />
      </div>
      <div className="ab-grid-overlay" />
      <div className="ab-noise-overlay" />
    </div>
  );
};

export default AnimatedBackground;
