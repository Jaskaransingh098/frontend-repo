import React from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {Helmet} from "react-helmet";
import { toast } from "react-toastify";
import "./Post.css";

function Post() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    stage: "",
    market: "",
    goals: "",
    fullName: "",
    email: "",
    role: "",
    startupName: "",
    industry: "",
    website: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    // setFormData({ ...formData, [name]: value });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNext = () => {
    if (step < 4) setStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    // console.log("Submitting with token:", token);

    if (!token) {
      toast.error("Please login or sign up to submit your idea.");
      // window.location.reload();
      return;
    }

    try {
      const decoded = jwtDecode(token); // decode the JWT token
      const username = decoded.username;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post`,
        {
          topic: formData.topic,
          description: formData.description,
          stage: formData.stage,
          market: formData.market,
          goals: formData.goals,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          startupName: formData.startupName,
          industry: formData.industry,
          website: formData.website,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg || "Idea submitted successfully!");
      setFormData({
        topic: "",
        description: "",
        stage: "",
        market: "",
        goals: "",
        fullName: "",
        email: "",
        role: "",
        startupName: "",
        industry: "",
        website: "",
      });
      setStep(1);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to submit idea.");
    }
  };
  const renderProgress = () => (
    <div className="progress-bar">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className={`step-circle ${step >= num ? "active" : ""}`}>
          {num}
        </div>
      ))}
      <div className="bar">
        <div
          className="fill"
          style={{ width: `${((step - 1) * 100) / 3}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Submit Your Startup Idea – InnoLinkk</title>
        <meta
          name="description"
          content="Share your innovative startup idea on InnoLinkk. Fill in founder details, startup information, and goals to get featured and get feedback."
        />
        <link rel="canonical" href="https://innolinkk.netlify.app/post" />
      </Helmet>
      <div className="post-wrapper">
        <video
          autoPlay
          muted
          loop
          className="background-video"
          src="/Form-video/Black and White Simple Corporate Business Company Video.mp4"
          type="video/mp4"
        >
          Your browser dows not support HTMl5 video
        </video>
        <div className="video-overlay"></div>
        <div className="form-container">
          {renderProgress()}
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h2>Step 1: Founder Details</h2>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  name="role"
                  placeholder="Your Role (e.g. Founder)"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            {step === 2 && (
              <>
                <h2>Step 2: Startup Info</h2>
                <input
                  name="startupName"
                  placeholder="Startup Name"
                  value={formData.startupName}
                  onChange={handleChange}
                  required
                />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Industry
                  </option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="tech">Technology</option>
                  <option value="food">Food</option>
                  <option value="finance">Finance</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="fashion">Fashion</option>
                </select>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Stage
                  </option>
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="launched">Launched</option>
                </select>
                <input
                  name="website"
                  placeholder="Website (optional)"
                  value={formData.website}
                  onChange={handleChange}
                />
              </>
            )}
            {step === 3 && (
              <>
                <h2>Step 3: Idea Details</h2>
                <textarea
                  name="description"
                  placeholder="Problem Statement"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <input
                  name="topic"
                  placeholder="Propose Solution"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="market"
                  placeholder="Technology Stack"
                  value={formData.market}
                  onChange={handleChange}
                  required
                />
                <select
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Goal
                  </option>
                  <option value="short">Short-term</option>
                  <option value="long">Long-term</option>
                  <option value="social">Social/Environmental</option>
                </select>
              </>
            )}
            {step == 4 && (
              <>
                <h2>Step: 4 Review & submit</h2>
                <ul>
                  {Object.entries(formData).map(([key, val]) => (
                    <li key={key}>
                      <strong>{key}:</strong>
                      {val || "N/A"}
                    </li>
                  ))}
                </ul>
                <button type="submit" className="submit-button">
                  Submit Idea{" "}
                </button>
              </>
            )}

            <div className="btn-group">
              {step > 1 && (
                <button type="button" onClick={handlePrev}>
                  Previous
                </button>
              )}
              {step < 4 && (
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Post;
