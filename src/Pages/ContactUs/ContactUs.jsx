import React, { useState, useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import "./ContactUs.css";

function ContactUs() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [circleStyle, setCircleStyle] = useState({});
  const [showCircle, setShowCircle] = useState(false);

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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const button = e.nativeEvent.submitter; // Get the button that triggered submit
    const rect = button.getBoundingClientRect(); // Correct bounding box
    const circleX = e.clientX - rect.left;
    const circleY = e.clientY - rect.top;
    setCircleStyle({ left: circleX, top: circleY });
    setShowCircle(true);

    setIsSubmitting(true);

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: phone,
      message: form.message,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");
        setForm({ fullName: "", email: "", message: "" });
        setPhone("");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }

    setIsSubmitting(false);
    setShowCircle(false);
  };
  return (
    <>
      <section className="contact-us-page">
        <div className="bubble-follow" ref={bubbleRef}></div>
        <div className="contact-us-left">
          <button>Contact Us</button>
          <h1>Share Your Vision With Us.</h1>
          <p>or just reach out manually by innolinkk@gmail.com</p>
        </div>
        <form className="contact-us-right" onSubmit={handleSubmit}>
          <div className="input-group">
            <h3>Full name</h3>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
          </div>

          <div className="input-group">
            <h3>Email Address</h3>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
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
                required
              />
            </div>
          </div>

          <div className="input-group">
            <h3>Your Vision</h3>
            <div className="input-with-icon">
              <FaCommentDots className="input-icon" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Type your vision" rows="5" required />
            </div>
          </div>
          <div className="contact-submit-wrapper">
            <button
              type="submit"
              className="contact-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {showCircle && (
                <span
                  className={`contact-circle ${isSubmitting ? "loading" : ""}`}
                  style={circleStyle}
                />
              )}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default ContactUs;
