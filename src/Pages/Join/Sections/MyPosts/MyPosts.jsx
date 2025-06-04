import React from "react";
import "./MyPosts.css";

function MyPosts(){
  return (
    <div className="dashboard-dashboard-container">
      <h1 className="dashboard-dashboard-title">Welcome Back 👋</h1>

      <div className="dashboard-dashboard-cards">
        <div className="dashboard-card dashboard-card-1">
          <h3>Total Posts</h3>
          <p>25</p>
        </div>
        <div className="dashboard-card dashboard-card-2">
          <h3>Total Likes</h3>
          <p>80</p>
        </div>
        <div className="dashboard-card dashboard-card-3">
          <h3>Total Comments</h3>
          <p>40</p>
        </div>
        <div className="dashboard-card dashboard-card-4">
          <h3>Progress</h3>
          <p>72%</p>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
