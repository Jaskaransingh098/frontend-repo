import React, { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
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
      toast.error(err.response?.data?.msg || "Signup failed", {
        icon: "⚠️",
        style: {
          backgroundColor: "#331111",
          color: "#ffcccc",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
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
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
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
            </div>
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
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
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
            </div>
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
