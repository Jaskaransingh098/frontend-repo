import React, { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const sendOtp = async () => {
    if (!signupEmail) {
      toast.error("Please enter your email first.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        {
          email: signupEmail,
        }
      );
      toast.success("OTP sent to your email 📩");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          email: signupEmail,
          otp,
        }
      );

      if (res.data.verified) {
        toast.success("✅ Email verified!");
        setIsOtpVerified(true);
      } else {
        toast.error("❌ Invalid OTP");
      }
    } catch (err) {
      toast.error("OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          username: loginUsername,
          password: loginPassword,
        }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", loginUsername);
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("isPro", payload.isPro ? "true" : "false");
      navigate("/", { state: { justLoggedIn: true, username: loginUsername } });
      toast.success("Login successful! 🎉", {
        style: {
          backgroundColor: "#112b11",
          color: "#ccffcc",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed", {
        icon: "🔐",
        style: {
          backgroundColor: "#331111",
          color: "#ffcccc",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify OTP before signing up.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{5,12}$/;

    // Validate username format first
    if (!usernameRegex.test(signupUsername)) {
      toast.error(
        "Username must be between 5 - 12 characters without any special characters",
        {
          icon: "❌",
          style: {
            backgroundColor: "#331111",
            color: "#ffcccc",
            fontWeight: "500",
            borderRadius: "10px",
          },
        }
      );
      return;
    }

    setLoading(true);

    try {
      // 🔍 Pre-check username availability
      const checkRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/check-username/${signupUsername}`
      );

      if (checkRes.data.exists) {
        toast.error("🚫 That username is already taken. Try another!", {
          style: {
            backgroundColor: "#331111",
            color: "#ffcccc",
            fontWeight: "500",
            borderRadius: "10px",
          },
        });
        setLoading(false);
        return;
      }

      // Proceed to signup if username is available
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          isPro: false,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", signupUsername);
      navigate("/", {
        state: { justLoggedIn: true, username: signupUsername },
      });

      toast.success("Signup successful! 🎊 Welcome!", {
        icon: "👤",
        style: {
          backgroundColor: "#112233",
          color: "#ffffff",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
    } catch (err) {
      toast.error("Signup failed. Please try again.", {
        icon: "⚠️",
        style: {
          backgroundColor: "#331111",
          color: "#ffcccc",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn solid" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Login"}
            </button>
            {/* <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div> */}
          </form>

          {/* Sign Up Form */}
          <form onSubmit={handleSignup} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  setOtpSent(false);
                  setIsOtpVerified(false);
                }}
              />
            </div>

            {!isOtpVerified && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "10px",
                  marginTop: "5px",
                }}
              >
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    height: "45px",
                    borderRadius: "5px",
                    padding: "0 10px",
                    fontSize: "1rem",
                    flex: "1",
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                />
                {isOtpVerified && (
                  <p
                    style={{
                      color: "#22cc88",
                      fontSize: "0.8rem",
                      marginTop: "-6px",
                    }}
                  >
                    ✅ Email verified
                  </p>
                )}
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#8884ff", fontSize: "0.75rem" }}
                  onClick={sendOtp}
                  disabled={!signupEmail || loading || sendingOtp}
                >
                  {sendingOtp ? <div className="spinner"></div> : "Send OTP"}
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#22aa88", fontSize: "0.75rem" }}
                  onClick={verifyOtp}
                  disabled={!otp || loading || verifyingOtp}
                >
                  {verifyingOtp ? <div className="spinner"></div> : "Verify"}
                </button>
              </div>
            )}

            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Sign up"}
            </button>
            {/* <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div> */}
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content1">
            <h3>New here ?</h3>
            <p>
              Welcome to our platform! If you're looking for a place to grow,
              connect, and achieve your goals, you've come to the right spot.
              Signing up gives you access to a personalized experience, powerful
              tools, and a community that's here to support you every step of
              the way. Don’t miss out on the opportunity to be part of something
              amazing.
            </p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
            className="image"
            alt=""
          />
        </div>
        <div className="panel right-panel">
          <div className="content1">
            <h3>One of us ?</h3>
            <p>
              Great to see you again! Log in to your account to continue
              exploring, collaborating, and creating. Whether you're here to
              manage your profile, discover new features, or connect with
              others, everything you need is just a click away. Let’s pick up
              right where you left off.
            </p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
            className="image"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
