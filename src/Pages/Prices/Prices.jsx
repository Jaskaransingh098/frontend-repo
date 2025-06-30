import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {Helmet} from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./Prices.css";

function Prices() {
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState("");
  const [isPro, setIsPro] = useState("false");

  useEffect(() => {
    const plan = localStorage.getItem("activePlan");
    const proStatus = localStorage.getItem("isPro") === "true";
    setActivePlan(plan);
    setIsPro(proStatus);
  }, []);

  const handleGetStarted = async (price, planName) => {
    const token = localStorage.getItem("token");
    const isPro = localStorage.getItem("isPro") === "true";

    if (isPro) {
      toast.info("You are already a Pro user!");
      return;
    }

    if (!token) {
      toast.warning("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-payment-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price }),
        }
      );

      const data = await response.json();

      if (data.url) {
        localStorage.setItem("pendingPlan", planName);
        console.log("Stripe session URL:", data.url);
        window.location.href = data.url;
      } else {
        toast.error("Error inititating payment.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 }, // Start with opacity 0 and slightly below
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }, // Fade in and slide up
  };

  const buttonVariants = {
    hidden: { opacity: 0 }, // Buttons start with opacity 0
    visible: {
      opacity: 1,
      transition: { duration: 1, delay: 0.5, ease: "easeOut" },
    }, // Fade in after a delay
  };

  return (
    <>
      <Helmet>
        <title>Upgrade to Pro – InnoLinkk Pricing Plans</title>
        <meta
          name="description"
          content="Choose from Essential, Professional, or Enterprise Pro plans to boost your startup journey on InnoLinkk. Unlock expert support and exclusive tools."
        />
        <link rel="canonical" href="https://innolinkk.netlify.app/prices" />
        <meta property="og:title" content="InnoLinkk – Pricing Plans" />
        <meta
          property="og:description"
          content="Explore our Essential, Professional, and Enterprise plans to accelerate your startup growth."
        />
        <meta
          property="og:url"
          content="https://innolinkk.netlify.app/prices"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://innolinkk.netlify.app/assets/pricing-thumbnail.jpg"
        />
      </Helmet>
      <div className="pricing-container">
        <motion.h1
          className="pricing-title"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          InnoLink Pro Plans
        </motion.h1>
        <motion.p
          className="pricing-subtitle"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          Premium solution to help your startup grow and succeed
        </motion.p>
        <motion.div className="pricing-cards">
          <motion.div
            className="pricing-card essential-card"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <h2>
              Essential{" "}
              {isPro && activePlan === "Essential" && (
                <span style={{ color: "green" }}>(Active)</span>
              )}
            </h2>
            <h3 className="price">
              &#8377;150<span>/ mo</span>
            </h3>
            <ul className="card-features">
              <li>
                <CheckCircle className="icon" /> Priority Idea Validation
              </li>
              <li>
                <CheckCircle className="icon" /> Access to templates & tools
              </li>
              <li>
                <CheckCircle className="icon" /> Basic expert consultations
              </li>
            </ul>
            <motion.button
              className="cta-button essential"
              onClick={() => handleGetStarted(150, "Essential")}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="button-text">
                Get Started <ArrowRightCircle size={18} />
              </span>
            </motion.button>
          </motion.div>

          <motion.div
            className="pricing-card growth-card"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <h2>
              Professional{" "}
              {isPro && activePlan === "Professional" && (
                <span style={{ color: "green" }}>(Active)</span>
              )}
            </h2>
            <h3 className="price">
              &#8377; 300 <span>/ mo</span>
            </h3>
            <ul className="card-features">
              <li>
                <CheckCircle className="icon" />
                Personalized 1-on-1 Consultations
              </li>
              <li>
                <CheckCircle className="icon" />
                Full Resource Library Access
              </li>
              <li>
                <CheckCircle className="icon" />
                Growth Strategy Development
              </li>
              <li>
                <CheckCircle className="icon" />
                Funding Opportunity Introductions
              </li>
            </ul>
            <motion.button
              className="cta-button"
              onClick={() => handleGetStarted(300, "Professional")}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="button-text">
                Get Started <ArrowRightCircle size={18} />
              </span>
            </motion.button>
          </motion.div>

          <motion.div
            className="pricing-card enterprise-card"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <h2>
              Enterprise{" "}
              {isPro && activePlan === "Enterprise" && (
                <span style={{ color: "green" }}>(Active)</span>
              )}
            </h2>
            <h3 className="price">
              &#8377; 500 <span>/ mo</span>
            </h3>
            <ul className="card-features">
              <li>
                <CheckCircle className="icon" />
                Dedicated Advisor Team
              </li>
              <li>
                <CheckCircle className="icon" />
                Custom Resource Packages
              </li>
              <li>
                <CheckCircle className="icon" />
                Investor Pitch Preparation
              </li>
              <li>
                <CheckCircle className="icon" />
                Priority Funding Network Access
              </li>
            </ul>
            <motion.button
              className="cta-button enterprise"
              onClick={() => handleGetStarted(500, "Enterprise")}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="button-text">
                Get Started <ArrowRightCircle size={18} />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Prices;
