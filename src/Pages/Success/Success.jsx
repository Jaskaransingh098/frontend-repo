import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Success.css";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const markProUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found.Cannot mark user as Pro.");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/payment-success`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newToken = response.data.token; // Get the new token
        localStorage.setItem("token", newToken); // Update localStorage with the new token

        // Save 'isPro' to localStorage
        localStorage.setItem("isPro", "true");

        const pendingPlan = localStorage.getItem("pendingPlan");
        if (pendingPlan) {
          localStorage.setItem("activePlan", pendingPlan);
          localStorage.removeItem("pendingPlan");
        }
      } catch (err) {
        console.log(
          "Failed to upgrade user:",
          err.response?.data?.msg || err.message
        );
      }
    };
    markProUser();
  }, []);

  return (
    <div
      className="success-page"
      style={{ textAlign: "center", marginTop: "100px" }}
    >
      <h1>Payment Successful!</h1>
      <p>
        Thank you for becoming a Pro member 🎉, Your subscirption is active.
      </p>
      <button
        className="success-button"
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      >
        Home
      </button>
    </div>
  );
}

export default Success;
