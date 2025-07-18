import React from "react";
import { useEffect, useState } from "react";
import {
  FaRegCopy,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
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

  const [copied, setCopied] = useState(false);
  const email = "innolinkk@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    });
  };

  return (
    <motion.footer
      className="footer"
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
    >
      <div className="footer-content">
        {/* Left: Contact Us */}
        <div className="contact-us">
          <p>CONTACT US</p>
          <h1>LET'S DISCUSS YOUR VISION. WITH US</h1>
          <button>
            <a href="/contactus">Contact us</a>
          </button>
          <br />
          <p>OR EMAIL US AT</p>
          <button className="mail-button" onClick={handleCopy}>
            {email}
            <span className="copy-feedback">
              {copied ? "Copied" : <FaRegCopy className="copy-icon" />}
            </span>
          </button>
        </div>

        {/* Center: Quick Links as row */}
        <div className="footer-center">
          <div className="quick-links-2-row">
            <p>QUICK LINKS</p>
            <ul>
              <li>
                <Link to="/aboutme">About Me</Link>
              </li>
              <li>
                <Link to="/government">Government</Link>
              </li>
              <li>
                <Link to="/join">Explore</Link>
              </li>
              <li>
                <Link to="/post">New Post</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Logo and Arrow in row */}
        <div className="footer-right">
          <img
            src="/Body-pics/innolinkk logo.png"
            alt="InnoLinkk Logo"
            className="footer-logo"
          />
          <button className="scroll-to-top">↑</button>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-icons">
          <a
            href="https://www.facebook.com/profile.php?id=61578122455342"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/company/innolinkk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.instagram.com/innolinkk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/innolinkk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
