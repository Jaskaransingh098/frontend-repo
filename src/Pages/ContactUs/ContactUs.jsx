import React, { useState, useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import "./ContactUs.css";

function ContactUs() {
  const [phone, setPhone] = useState("");

  const bubbleRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const bubble = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveBubble = () => {
      // Smooth follow effect
      bubble.current.x += (mouse.current.x - bubble.current.x) * 0.1;
      bubble.current.y += (mouse.current.y - bubble.current.y) * 0.1;

      if (bubbleRef.current) {
        bubbleRef.current.style.transform = `translate3d(${bubble.current.x}px, ${bubble.current.y}px, 0)`;
      }

      requestAnimationFrame(moveBubble);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX - 100; // center offset
      mouse.current.y = e.clientY - 100;
    };

    document.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(moveBubble);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <>
      <section className="contact-us-page">
        <div className="bubble-follow" ref={bubbleRef}></div>
        <div className="contact-us-left">
          <button>Contact Us</button>
          <h1>Share Your Vision With Us.</h1>
          <p>or just reach out manually by innolinkk@gmail.com</p>
        </div>
        <div className="contact-us-right">
          <div className="input-group">
            <h3>Full name</h3>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Enter your full name" />
            </div>
          </div>

          <div className="input-group">
            <h3>Email Address</h3>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input type="text" placeholder="Enter your email address" />
            </div>
          </div>
          <div className="input-group">
            <h3>Phone Number</h3>
            <div className="phone-input-wrapper">
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={setPhone}
                inputClass="phone-input-custom"
                buttonClass="phone-button-custom"
                containerClass="phone-container-custom"
                dropdownClass="phone-dropdown-custom"
              />
            </div>
          </div>

          <div className="input-group">
            <h3>Your Vision</h3>
            <div className="input-with-icon">
              <FaCommentDots className="input-icon" />
              <textarea placeholder="Type your vision" rows="5" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactUs;
