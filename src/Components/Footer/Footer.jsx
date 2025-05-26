import React from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Footer.css";

function Footer() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    // Select the scroll-to-top button
    const scrollToTopButton = document.querySelector(".scroll-to-top");

    // Define the scroll-to-top function
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Add click event listener to the button
    scrollToTopButton.addEventListener("click", handleScrollToTop);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      scrollToTopButton.removeEventListener("click", handleScrollToTop);
    };
  }, []);

  return (
    <motion.footer
      ref={ref}
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      <div className="footer-content">
        {/* Left: Links */}
        <div className="footer-links">
          <ul>
            <li>
              <a href="#">Terms Of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Distributors</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
          </ul>
          <p className="copyright">© 2025 Jassss</p>
        </div>
        {/* Center: Newsletter */}
        <div className="footer-newsletter">
          <h3>Reach Out To Us</h3>
          <form className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="ENTER YOUR EMAIL TO SIGNUP"
              required=""
            />
            <button type="submit" className="newsletter-button">
              SUBMIT
            </button>
          </form>
        </div>
        {/* Right: Social Media and Scroll to Top */}
        <div className="footer-right">
          <button className="scroll-to-top">↑</button>
          <div className="social-icons">
            <a href="#">
              <span className="icon">📘</span>
            </a>
            <a href="#">
              <span className="icon">🐦</span>
            </a>
            <a href="#">
              <span className="icon">📷</span>
            </a>
            <a href="#">
              <span className="icon">🌐</span>
            </a>
            <a href="#">
              <span className="icon">⋯</span>
            </a>
            <a href="#">
              <span className="icon">📺</span>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
