import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import "./Government.css";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaSeedling,
  FaPiggyBank,
  FaHandHoldingUsd,
  FaFileSignature,
  FaLightbulb,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";

function Government() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  const schemes = [
    {
      title: "Startup India Seed Fund Scheme (SISFS)",
      description: "Up to ₹50 lakh for product development",
      icon: <FaSeedling />,
      size: "medium",
    },
    {
      title: "Fund of Funds for Startups (FFS)",
      description: "Managed by SIDBI to support VC firms investing in startups",
      icon: <FaPiggyBank />,
      size: "large",
    },
    {
      title: "SIDBI Loans",
      description: "Easy, collateral-free loans for early-stage ventures",
      icon: <FaHandHoldingUsd />,
      size: "small",
    },
    {
      title: "SIP-EIT",
      description: "80% reimbursement of patent filing costs",
      icon: <FaFileSignature />,
      size: "medium",
    },
    {
      title: "Atal Innovation Mission (AIM)",
      description: "Incubation and challenge grants for disruptive ideas",
      icon: <FaLightbulb />,
      size: "large",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Government Startup Schemes – InnoLinkk</title>
        <meta
          name="description"
          content="Explore major Indian government schemes for startups including Seed Fund, SIDBI Loans, AIM, SIP-EIT, and more. Learn eligibility and steps to apply."
        />
        <meta
          name="keywords"
          content="startup india, government schemes, startup funding, DPIIT, SIDBI, innovation, AIM, startup eligibility"
        />
        <link rel="canonical" href="https://innolinkk.netlify.app/government" />
      </Helmet>
      <section className="gov-section">
        <div
          className="definition-section"
          data-aos="fade-in"
          data-aos-delay="200"
          data-aos-duration="1200"
          data-aos-once="false"
        >
          <div className="definition-image" data-aos="fade-up"></div>
          <div className="definition-texts">
            <h1>What is Startup India?</h1>
            <p>
              Startup India is a flagship initiative launched by the Government
              of India in 2016 to build a strong ecosystem that fosters
              innovation and supports budding entrepreneurs. It aims to
              transform India into a nation of job creators instead of job
              seekers. The initiative offers:
            </p>
            <ol>
              <li>
                Policy support with simplified regulations, tax benefits, and
                patent support
              </li>
              <li>Funding access via government schemes and venture capital</li>
              <li>
                Mentorship through incubators, accelerators, and expert panels
              </li>
              <li>
                Exposure & networking with access to global events and investor
                forums
              </li>
            </ol>
            <p className="bottom-text">
              Over 100,000 startups have been recognized under the scheme,
              making India the 3rd largest startup ecosystem globally.
            </p>
          </div>
        </div>

        <div className="initiative-summary" data-aos="fade-up">
          <h2>The initiative offers:</h2>
          <ul>
            <li>
              <FaCheckCircle className="check-icon" />
              Policy support with simplified regulations, tax benefits, and
              patent support
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Funding access via government schemes and venture capital
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Mentorship through incubators, accelerators, and expert panels
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Exposure & networking with access to global events and investor
              forums
            </li>
          </ul>
          <p className="highlighted-stat">
            Over <strong>100,000</strong> startups have been recognized under
            the scheme, making India the <strong>3rd largest</strong> startup
            ecosystem globally.
          </p>
        </div>

        <div className="triangle-steps-vertical" data-aos="fade-up">
          <h2>Step-by-Step Guide</h2>
          <p className="subtitle">How to Apply for Government Support:</p>
          <div className="steps-vertical">
            <div className="triangle-step">
              <div className="step-badge">1</div>
              <div className="step-content">
                <h3>Register</h3>
                <p>
                  Sign up on the{" "}
                  <a
                    href="https://startupindia.gov.in"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Startup India Portal
                  </a>
                  .
                </p>
              </div>
              <div className="triangle-down"></div>
            </div>

            <div className="triangle-step">
              <div className="step-badge">2</div>
              <div className="step-content">
                <h3>Get DPIIT Recognition</h3>
                <p>
                  Submit incorporation documents, innovation description, and
                  founder info.
                </p>
              </div>
              <div className="triangle-down"></div>
            </div>

            <div className="triangle-step">
              <div className="step-badge">3</div>
              <div className="step-content">
                <h3>Approval & Verification</h3>
                <p>
                  Wait for DPIIT to validate your application and approve it
                  officially.
                </p>
              </div>
              <div className="triangle-down"></div>
            </div>

            <div className="triangle-step">
              <div className="step-badge">4</div>
              <div className="step-content">
                <h3>Access Support</h3>
                <p>
                  Once approved, access funding, tax relief, mentorship, and
                  legal support.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="eligibility-section" data-aos="fade-right">
          <div className="eligibility-content">
            {/* Text section */}
            <div className="eligibility-text">
              <h2>Eligibility Criteria</h2>
              <p className="eligibility-intro">
                You are eligible if your startup:
              </p>
              <ul className="eligibility-timeline">
                <li>
                  <span className="dot"></span>
                  <p>
                    <strong>Is registered</strong> as a Pvt Ltd, LLP, or
                    Partnership
                  </p>
                </li>
                <li>
                  <span className="dot"></span>
                  <p>
                    <strong>Is less than 10 years old</strong>
                  </p>
                </li>
                <li>
                  <span className="dot"></span>
                  <p>
                    <strong>Has an annual turnover</strong> below ₹100 crore
                  </p>
                </li>
                <li>
                  <span className="dot"></span>
                  <p>
                    <strong>Offers innovation</strong> or a unique
                    product/service
                  </p>
                </li>
                <li>
                  <span className="dot"></span>
                  <p>
                    <strong>Is not formed</strong> by restructuring an existing
                    company
                  </p>
                </li>
              </ul>
            </div>

            {/* Image section */}
            <div className="eligibility-image">
              <img
                src="/government-pics/4320546_2286309.jpg"
                alt="Eligibility Visual"
              />
            </div>
          </div>
        </div>

        <div className="schemes-section" data-aos="fade-up">
          <h2>Major Government Schemes</h2>
          <p className="subtitle">
            These schemes offer funding, protection, and market access:
          </p>
          <div className="schemes-grid">
            {schemes.map((scheme, index) => (
              <div
                key={index}
                className={`scheme-card ${scheme.size} ${
                  index === schemes.length - 1 ? "last-card" : ""
                }`}
              >
                <div className="scheme-icon">{scheme.icon}</div>
                <h3>{scheme.title}</h3>
                <p>{scheme.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="gov-button-container" data-aos="zoom-in-up">
      <a
        href="https://www.startupindia.gov.in/"
        target="blank"
        rel="noreferrer"
        className="gov-button"
      >
        <FaExternalLinkAlt /> Apply via Startup India Portal
      </a>
    </div> */}
        <div className="gov-button-container" data-aos="zoom-in-up">
          <h2>Take the Next Step</h2>
          <p className="gov-button-subtitle">
            Join India’s thriving startup ecosystem with government-backed
            support. Apply now or learn more about the opportunities awaiting
            your venture.
          </p>
          <div className="gov-button-group">
            <a
              href="https://www.startupindia.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="gov-button primary"
            >
              <FaExternalLinkAlt /> Apply via Startup India Portal
            </a>
            <a
              href="https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html"
              target="_blank"
              rel="noreferrer"
              className="gov-button secondary"
            >
              <FaInfoCircle /> Learn More
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Government;
