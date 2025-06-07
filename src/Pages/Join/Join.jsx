import React, { useState } from "react";
import "./Join.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Explore from "./Sections/Explore/Explore";
import Messages from "./Sections/Messages/Messages";
import MyPosts from "./Sections/MyPosts/MyPosts";

function Join() {
  const [activeSection, setActiveSection] = useState("explore");
  const [ref1, intView1] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [pendingMessages, setPendingMessages] = useState({});

  // 🧮 Compute total unread count
  const unreadCount = Object.values(pendingMessages).reduce(
    (acc, msgs) => acc + msgs.length,
    0
  );

  const renderSection = () => {
    switch (activeSection) {
      case "explore":
        return <Explore />;
      // case "message":
      //   return <Messages />;
      case "message":
        return (
          <Messages
            pendingMessages={pendingMessages}
            setPendingMessages={setPendingMessages}
          />
        );
      case "myposts":
        return <MyPosts />;
      default:
        return <Explore />;
    }
  };
  return (
    <motion.div
      className="join-page"
      ref={ref1}
      initial={{ opacity: 0, y: 50 }}
      animate={intView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="join-body">
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
              style={{ position: "relative" }}
            >
              Messages
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
          </div>
        </nav>
      </div>
    </motion.div>
  );
}

export default Join;
