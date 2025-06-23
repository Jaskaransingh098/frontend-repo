import React, { useState } from "react";
import "./Join.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Explore from "./Sections/Explore/Explore";
import Messages from "./Sections/Messages/Messages";
import MyPosts from "./Sections/MyPosts/MyPosts";

function Join() {
  const [activeSection, setActiveSection] = useState("explore");

  const renderSection = () => {
    switch (activeSection) {
      case "explore":
        return <Explore />;
      case "message":
        return <Messages />;
      case "myposts":
        return <MyPosts />;
      default:
        return <Explore />;
    }
  };
  return (
    <motion.div
      className="join-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className={`join-body ${
          activeSection === "explore" ? "float-navbar" : "align-top"
        }`}
      >
        <div className="join-container">{renderSection()}</div>

        {/* RIGHT-SIDE VERTICAL NAVBAR */}
        <nav className="join-navbar">
          <div className="navbar-vertical">
            <button
              className={activeSection === "myposts" ? "active" : ""}
              onClick={() => setActiveSection("myposts")}
            >
              Dashboard
            </button>
            <button
              className={activeSection === "explore" ? "active" : ""}
              onClick={() => setActiveSection("explore")}
            >
              Explore
            </button>
            <button
              className={activeSection === "message" ? "active" : ""}
              onClick={() => setActiveSection("message")}
            >
              Messages
            </button>
          </div>
        </nav>
      </div>
    </motion.div>
  );
}

export default Join;
