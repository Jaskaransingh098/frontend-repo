import React from "react";
import { Link } from "react-router-dom";
import "./Body.css";
import Footer from "../Footer/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Body() {
  const [ref1, intView1] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref2, intView2] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref3, intView3] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref4, intView4] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref5, intView5] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [imageRef, imageInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [imageRef2, imageInView2] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [ref6, inView6] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref7, inView7] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref8, inView8] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref9, inView9] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref10, inView10] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref11, inView11] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref12, inView12] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [ref13, inView13] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [videoRef, videoInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <>
      <motion.div
        className="image-container"
        ref={imageRef}
        initial={{ opacity: 0, y: 50 }}
        animate={imageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      ></motion.div>
      <section>
        <motion.div
          className="services-container"
          ref={ref1}
          initial={{ opacity: 0, y: 50 }}
          animate={intView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="services-text">
            <h1 className="Service-text">Why innolinkk? </h1>
          </div>
          <div className="services-boxes">
            <div className="boxes">
              <i className="bi bi-bullseye icon-style"></i>
              <h3>Precision-Driven Connections</h3>
              <p>we connect entrepreneurs with the right investors using smart filtering and real-time analytics.</p>
            </div>
            <div className="boxes">
              <i className="bi bi-bar-chart icon-style"></i>
              <h3>Diverse Funding Access</h3>
              <p>Public grants, private investors - apply once, we'll guide you through all possible opportunities.</p>
            </div>
            <div className="boxes">
              <i className="bi bi-lightbulb icon-style"></i>
              <h3>Expert Mentorship</h3>
              <p>From pitch to funding - pur mentors help refine your idea and walk you through the entire process.</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="general-container"
          ref={ref2}
          initial={{ opacity: 0, y: 50 }}
          animate={intView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Browse Ideas</h1>
          <input
            className="radio"
            type="radio"
            name="card"
            id="cardUno"
            defaultChecked=""
          />
          <motion.label
            ref={ref6}
            className="content card-uno"
            htmlFor="cardUno"
            initial={{ opacity: 0, y: 50 }}
            animate={inView6 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">E-commerce</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardDos" />
          <motion.label
            className="content card-dos"
            htmlFor="cardDos"
            ref={ref7}
            initial={{ opacity: 0, y: 50 }}
            animate={inView7 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Education</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardCuatro" />
          <motion.label
            className="content card-cuatro"
            htmlFor="cardCuatro"
            ref={ref8}
            initial={{ opacity: 0, y: 50 }}
            animate={inView8 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Food</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardTres" />
          <motion.label
            className="content card-tres"
            htmlFor="cardTres"
            ref={ref9}
            initial={{ opacity: 0, y: 50 }}
            animate={inView9 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Finance</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardCuatroo" />
          <motion.label
            className="content card-cuatroo"
            htmlFor="cardCuatroo"
            ref={ref10}
            initial={{ opacity: 0, y: 50 }}
            animate={inView10 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Healthcare</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardCuatrooo" />
          <motion.label
            className="content card-cuatrooo"
            htmlFor="cardCuatrooo"
            ref={ref11}
            initial={{ opacity: 0, y: 50 }}
            animate={inView11 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Manufacturing</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardDoss" />
          <motion.label
            className="content card-doss"
            htmlFor="cardDoss"
            ref={ref12}
            initial={{ opacity: 0, y: 50 }}
            animate={inView12 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Fashion</a>
            </h3>
          </motion.label>
          <input className="radio" type="radio" name="card" id="cardDosss" />
          <motion.label
            className="content card-dosss"
            htmlFor="cardDosss"
            ref={ref13}
            initial={{ opacity: 0, y: 50 }}
            animate={inView13 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title-card">
              <span className="marg-bott" />
              <span className="subtitle" />
            </h1>
            <h3 className="card-title subsubtitle">
              <a href="/">Technology</a>
            </h3>
          </motion.label>
        </motion.div>
{/* 
        <motion.div
          className="banner-container"
          ref={ref3}
          initial={{ opacity: 0, y: 50 }}
          animate={intView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="banner-content">
            <h1 className="logo">InnoLinkk pro</h1>
            <h2>The premium startup solutions and help for businesses</h2>
            <div className="features">
              <div className="feature-item">
                <span className="checkmark">✔</span>
                <p>
                  <strong>Priority Idea Validation</strong>
                  <br />
                  Get expert feedback on your business concept within 48 hours.
                  Our team of industry veterans will analyze market potential,
                  identify opportunities, and highlight potential challenges
                  before you invest significant resources.
                </p>
              </div>
              <div className="feature-item">
                <span className="checkmark">✔</span>
                <p>
                  <strong>Personalized Consultation</strong>
                  <br />
                  Connect with specialized advisors matched to your industry and
                  growth stage. Monthly 1-on-1 sessions help solve immediate
                  challenges while developing long-term strategies tailored to
                  your unique business needs.
                </p>
              </div>
              <div className="feature-item">
                <span className="checkmark">✔</span>
                <p>
                  <strong> Resource Access</strong>
                  <br />
                  Gain exclusive access to our curated library of tools,
                  templates, and frameworks. From pitch decks to financial
                  models, skip the guesswork with resources proven effective by
                  successful startups.
                </p>
              </div>
              <div className="feature-item">
                <span className="checkmark">✔</span>
                <p>
                  <strong> Funding Opportunities</strong>
                  <br />
                  Qualified premium members receive introductions to our network
                  of investors and funding partners. We help prepare your
                  materials and increase visibility among relevant venture
                  capital firms and angel investors.
                </p>
              </div>
            </div>
            <Link className="try-now-btn" to="/prices" >
              Try Now
            </Link>
          </div>
          <motion.div
            className="banner-image"
            ref={imageRef2}
            initial={{ opacity: 0, y: 50 }}
            animate={
              imageInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.8 }}
          >
          </motion.div>
        </motion.div> */}
        <motion.div
          ref={videoRef}
          initial={{ opacity: 0, y: 50 }}
          animate={videoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
        >
          <video nocontrols autoPlay loop muted className="body-video">
            <source src="/Body-pics/Video2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
        <motion.div
          className="infographic-container"
          ref={ref4}
          initial={{ opacity: 0, y: 50 }}
          animate={intView4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="infographic-header">
            <h1>Post &amp; Join -</h1>
          </div>
          <div className="infographic-cards">
            <div className="info-box">
              <motion.div
                className="info-box-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <i className="bi bi-search"></i>
              </motion.div>
              <h3>Share Your Ideas</h3>
              <p>
                Post your startup concepts, business challenges, or innovation
                needs. Our community thrives on fresh thinking and collaborative
                problem-solving. Each post becomes an opportunity for connection
                and growth.
              </p>
              {/* <button className="next-btn">→</button> */}
            </div>
            <div className="info-box">
              <motion.div
                className="info-box-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <i className="bi bi-lightbulb"></i>
              </motion.div>
              <h3>Discover Opportunities</h3>
              <p>
                Browse through a curated feed of ideas and projects that match
                your interests and expertise. Find the perfect opportunity to
                contribute your skills or gain new perspectives on industry
                challenges.
              </p>
              {/* <button className="next-btn">→</button> */}
            </div>
            <div className="info-box">
              <motion.div
                className="info-box-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <i className="bi bi-bar-chart"></i>
              </motion.div>
              <h3>Engage & Collaborate</h3>
              <p>
                Like posts to show support, comment to provide insights, and
                join projects that excite you. Our platform makes it easy to
                find and connect with like-minded entrepreneurs and innovators.
              </p>
              {/* <button className="next-btn">→</button> */}
            </div>
            <div className="info-box">
              <motion.div
                className="info-box-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <i className="bi bi-bullseye"></i>
              </motion.div>
              <h3>Direct Communication</h3>
              <p>
                Message users directly to discuss collaboration possibilities,
                ask questions, or offer solutions. Build your professional
                network while working together towards shared business goals.
              </p>
              {/* <button className="next-btn">→</button> */}
            </div>
          </div>
        </motion.div>
        <motion.div
          className="government-section"
          ref={ref5}
          initial={{ opacity: 0, y: 50 }}
          animate={intView5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="government-container">
            {/* Title and Subtitle */}
            <h1>Your Path to Collaboration</h1>
            <p className="subtitle">
              Our simple process helps you connect, collaborate, and communicate
              with fellow entrepreneurs and innovators.
            </p>
            {/* Three Steps Section */}
            <div className="government-steps">
              <div className="government-step">
                <div className="government-icon">📋</div>
                <p className="step-text">Create Your Post</p>
                <p className="step-description">
                  Share your startup idea, business challenge, or project
                  proposal through our intuitive Post page. Describe your
                  vision, set goals, and specify what kind of collaborators
                  you're seeking to bring your concept to life.
                </p>
              </div>
              <div className="arrow">➡️</div>
              <div className="government-step">
                <div className="government-icon">⚙️</div>
                <p className="step-text">Join Exciting Projects</p>
                <p className="step-description">
                  Browse through projects that match your interests and
                  expertise on our Join page. Like posts to show support, follow
                  updates, and submit your application to collaborate on ideas
                  that inspire you.
                </p>
              </div>
              <div className="arrow">➡️</div>
              <div className="government-step">
                <div className="government-icon">📧</div>
                <p className="step-text">Connect & Communicate</p>
                <p className="step-description">
                  Access messaging directly from the Join page to communicate
                  with team members and project creators. Discuss details, share
                  resources, and build relationships that help turn innovative
                  ideas into reality.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <Footer/>
      </section>
    </>
  );
}

export default Body;
