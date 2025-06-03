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
    // <motion.div
    //   className="join-page"
    //   ref={ref1}
    //   initial={{ opacity: 0, y: 50 }}
    //   animate={intView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    //   transition={{ duration: 0.8 }}
    // >

    //   <nav className="join-navbar">
    //     <div className="navbar">
    //       <button onClick={() => setActiveSection("myposts")}>My Posts</button>
    //       <button onClick={() => setActiveSection("explore")}>Explore</button>
    //       <button onClick={() => setActiveSection("message")}>Messages</button>
    //     </div>
    //   </nav>

    //   <div className="join-body">

    //     <div className="join-container">
    //       {renderSection()}</div>
    //   </div>

    // </motion.div>
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
              My Posts
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
