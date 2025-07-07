import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { inView, motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";

function Navbar({ username, currentPath }) {
  const navigate = useNavigate();
  const [isPro, setIsPro] = useState(localStorage.getItem("isPro") === "true");

  useEffect(() => {
    const checkIsPro = () => {
      console.log("Checking if user is Pro:", localStorage.getItem("isPro"));
      setIsPro(localStorage.getItem("isPro") === "true");
    };
    checkIsPro();
    window.addEventListener("storage", checkIsPro);

    return () => {
      window.removeEventListener("storage", checkIsPro);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isPro");
    localStorage.removeItem("activePlan");
    localStorage.removeItem("pendingPlan");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handlePricesClick = (e) => {
    e.preventDefault();
    toast.info("🚧 Prices page is coming soon!", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  return (
    <motion.nav
      className="navbar-nav"
      initial={{ opacity: 0, y: -50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="nav">
        {currentPath !== "/" && (
          <a href="/" className="home-link">
            <p>Home</p>
          </a>
        )}
        {currentPath !== "/post" && <a href="/post">Post</a>}
        {currentPath !== "/join" && <a href="/join">Join</a>}
        <a href="#" onClick={handlePricesClick}>
          Prices
        </a>
        {currentPath !== "/government" && <a href="/government">Government</a>}
      </div>
      <div className="animation start-home"></div>
      <span></span>
      <div className="loginup">
        {username ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p style={{ fontWeight: "bold", paddingTop: "10px" }} className="username-login-text">
              Hello, {username}{" "}
              {/* {isPro && (
                <span style={{ color: "gold", fontWeight: "bold" }}>PRO</span>
              )} */}
            </p>
            <button
              className="login-button"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link className="Link" to="/login">
            <button className="login-button">Sign In / Up</button>
          </Link>
        )}

        <img
          src="/Body-pics/innolinkk logo.png" // Adjust if it's in a different folder
          alt="Logo"
          className="nav-logo"
        />
      </div>
    </motion.nav>
  );
}

export default Navbar;
