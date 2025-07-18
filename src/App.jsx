import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./Components/Navbar/Navbar";
import Body from "./Components/Body/Body";
import Login from "./Components/Login/Login";
import Post from "./Pages/Post/Post";
import Join from "./Pages/Join/Join";
import Prices from "./Pages/Prices/Prices";
import Success from "./Pages/Success/Success";
import Government from "./Pages/Government/Government";
import AboutMe from "./Pages/AboutMe/AboutMe";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AnimatedBackground from "./Components/AnimateBackground/AnimateBackground";
import Messages from "./Pages/Join/Sections/Messages/Messages";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (location?.state?.justLoggedIn && location?.state?.username) {
      setUsername(location.state.username);
      localStorage.setItem("username", location.state.username);

      // remove state to prevent infinite loop
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && (
        <Navbar username={username} currentPath={location.pathname} />
      )}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Body />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<Post />} />
          <Route path="/join" element={<Join />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/success" element={<Success />} />
          <Route path="/government" element={<Government />} />
          <Route path="/aboutme" element={<AboutMe/>}/>
          <Route path="/contactus" element={<ContactUs/>}/>
          <Route path="/messages/:username?" element={<Messages />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AnimatedBackground />
      <AppContent />
    </Router>
  );
}

export default App;
