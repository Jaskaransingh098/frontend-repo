import React, { useState } from "react";
import "./Join.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        {activeSection === "explore" && (
          <>
            <title>Explore – Discover Startup Ideas | InnoLinkk</title>
            <meta
              name="description"
              content="Browse trending, random, and filtered startup ideas. Connect with innovation happening now on InnoLinkk."
            />
            <link
              rel="canonical"
              href="https://innolinkk.netlify.app/join#explore"
            />
          </>
        )}
        {activeSection === "message" && (
          <>
            <title>Messages – Chat with Innovators | InnoLinkk</title>
            <meta
              name="description"
              content="Start conversations with other founders and collaborators. Share ideas and grow your network through messaging on InnoLinkk."
            />
            <link
              rel="canonical"
              href="https://innolinkk.netlify.app/join#messages"
            />
          </>
        )}
        {activeSection === "myposts" && (
          <>
            <title>My Posts – Your Dashboard | InnoLinkk</title>
            <meta
              name="description"
              content="Track your posted ideas, manage likes and comments, and monitor your engagement tier on the InnoLinkk dashboard."
            />
            <link
              rel="canonical"
              href="https://innolinkk.netlify.app/join#myposts"
            />
          </>
        )}
      </Helmet>
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
