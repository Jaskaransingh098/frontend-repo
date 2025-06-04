import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./MyPosts.css";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const postsRef = useRef(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://backend-repo-f2m0.onrender.com/api",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = localStorage.getItem("username"); // assuming username is stored
        const userPosts = res.data.ideas.filter(
          (post) => post.username === user
        );
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserPosts();
  }, []);

  const visiblePosts = showAll ? posts : posts.slice(0, 5);

  const handleSeeMore = () => {
    setShowAll(true);
    setTimeout(() => {
      postsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="dashboard-dashboard-container">
      <h1 className="dashboard-dashboard-title">Welcome Back 👋</h1>
      <div className="dashboard-dashboard-cards">
        <div className="dashboard-card dashboard-card-1">
          <h3>Total Posts</h3>
          <p>{posts.length}</p>

          <ul className="post-snippet-list">
            {visiblePosts.map((post, index) => (
              <li key={index} className="post-snippet">
                <strong>{post.topic}</strong>
                <p>{post.description}</p>
              </li>
            ))}
          </ul>

          {!showAll && posts.length > 5 && (
            <button onClick={handleSeeMore} className="see-more-btn">
              See More ↓
            </button>
          )}
        </div>
        <div className="dashboard-card dashboard-card-2">
          <h3>Total Likes</h3>
          <p>
            {posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}
          </p>
        </div>
        <div className="dashboard-card dashboard-card-3">
          <h3>Total Comments</h3>
          <p>
            {posts.reduce((acc, post) => acc + (post.comment?.length || 0), 0)}
          </p>
        </div>
        <div className="dashboard-card dashboard-card-4">
          <h3>Progress</h3>
          <p>72%</p>
        </div>
      </div>
    </div>
  );
}
export default MyPosts;
