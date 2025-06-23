import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaHeart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import "./AllPosts.css"; // Don't forget to create and import this

const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [allPostLikes, setAllPostLikes] = useState({});
  const [allPostComments, setAllPostComments] = useState({});
  const [allNewComments, setAllNewComments] = useState({});
  const [showCommentsIndex, setShowCommentsIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found.");
      return;
    }

    const fetchAllPosts = async () => {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/allposts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ideas = response.data.ideas;
        setAllPosts(ideas);

        const likeMap = {};
        const commentMap = {};
        ideas.forEach((idea, idx) => {
          likeMap[idx] = idea.likes?.length || 0;
          commentMap[idx] = idea.comments || [];
        });

        setAllPostLikes(likeMap);
        setAllPostComments(commentMap);
      } catch (err) {
        console.error("Failed to fetch all posts", err);
      }
    };

    fetchAllPosts();
  }, []);

  const toggleAllPostComments = (index) => {
    setShowCommentsIndex((prev) => (prev === index ? null : index));
  };

  const handleAllPostLike = async (index, postId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAllPostLikes((prev) => ({
        ...prev,
        [index]: res.data.likes.length,
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const submitAllPostComment = async (index, postId) => {
    const text = allNewComments[index];
    if (!text?.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = res.data;
      if (!newComment || typeof newComment !== "object") return;

      setAllPostComments((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), newComment],
      }));

      setAllNewComments((prev) => ({ ...prev, [index]: "" }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="all-posts-wrapper">
      {allPosts.map((post, index) => (
        <div className="all-post-card" key={post._id}>
          <div className="all-post-header">
            <div className="all-user-profile">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                className="all-profile-pic"
              />
              <div>
                <h3 className="all-username">{post.fullName}</h3>
                <p className="all-role">{post.role}</p>
                <p className="all-timestamp">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="all-post-meta-grid">
            <div>
              <strong>Topic:</strong> {post.topic}
            </div>
            <div>
              <strong>Startup:</strong> {post.startupName}
            </div>
            <div>
              <strong>Industry:</strong> {post.industry}
            </div>
            <div>
              <strong>Stage:</strong> {post.stage}
            </div>
            <div>
              <strong>Goals:</strong> {post.goals}
            </div>
            <div>
              <strong>Market:</strong> {post.market}
            </div>
            <div>
              <strong>Website:</strong> {post.website}
            </div>
            <div>
              <strong>Email:</strong> {post.email}
            </div>
          </div>

          <div className="all-description-box">
            <div className="all-description-header">
              <span className="desc-label">Description:</span>
            </div>
            <p className="all-description-text">
              {post.description.length > 150
                ? post.description.slice(0, 150) + "..."
                : post.description}
            </p>
          </div>

          <div className="all-post-footer">
            <div className="all-likes-comments">
              <button
                className="all-icon-btn"
                onClick={() => handleAllPostLike(index, post._id)}
              >
                {allPostLikes[index] > 0 ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <span>{allPostLikes[index] || 0} Likes</span>

              <button
                className="all-icon-btn"
                onClick={() => toggleAllPostComments(index)}
              >
                <BsChatDots />
              </button>
              <span>{(allPostComments[index] || []).length} Comments</span>
            </div>

            {showCommentsIndex === index && (
              <div className="all-comment-section">
                {(allPostComments[index] || []).map((comment, cIdx) => (
                  <div key={cIdx} className="all-comment-item">
                    <div className="all-comment-left">
                      <FaUserCircle className="all-comment-avatar" />
                      <div className="all-comment-content">
                        <span className="all-comment-username">
                          {comment.username}
                        </span>
                        <p className="all-comment-text">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="all-comment-box">
                  <textarea
                    placeholder="Write a comment..."
                    value={allNewComments[index] || ""}
                    onChange={(e) =>
                      setAllNewComments((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="all-send-btn"
                    onClick={() => submitAllPostComment(index, post._id)}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllPosts;
