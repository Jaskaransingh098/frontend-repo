import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import "./AllPosts.css";

const AllPosts = ({
  posts,
  likes,
  comments,
  newComments,
  onLike,
  onCommentSubmit,
  username,
}) => {
  const [showCommentsIndex, setShowCommentsIndex] = useState(null);

  const toggleComments = (index) => {
    setShowCommentsIndex((prev) => (prev === index ? null : index));
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
      {!localStorage.getItem("token") ? (
        <p className="all-posts-message">
          🔒 Please <a href="/login">log in</a> or <a href="/signup">sign up</a>{" "}
          to view community ideas.
        </p>
      ) : posts.length === 0 ? (
        <p className="all-posts-message">
          📝 Be the first one to share your idea!
        </p>
      ) : (
        posts.map((post, index) => (
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
                  <p className="all-timestamp">
                    {formatTimeAgo(post.createdAt)}
                  </p>
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
                  onClick={() => onLike(index, post._id)}
                >
                  {likes[index] > 0 ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>
                <span>{likes[index] || 0} Likes</span>

                <button
                  className="all-icon-btn"
                  onClick={() => toggleComments(index)}
                >
                  <BsChatDots />
                </button>
                <span>{comments[index]?.length || 0} Comments</span>
              </div>

              {showCommentsIndex === index && (
                <div className="all-comment-section">
                  {(comments[index] || []).map((comment, cIdx) => (
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
                      value={newComments[index] || ""}
                      onChange={(e) =>
                        onCommentSubmit(index, post._id, e.target.value, false)
                      }
                    />
                    <button
                      className="all-send-btn"
                      onClick={() =>
                        onCommentSubmit(
                          index,
                          post._id,
                          newComments[index],
                          true
                        )
                      }
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllPosts;
