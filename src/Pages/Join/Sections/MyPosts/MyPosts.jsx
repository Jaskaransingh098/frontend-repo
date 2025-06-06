import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import {
  FaHeart,
  FaRegHeart,
  FaUserCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiSend } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import "./MyPosts.css";
export default function MyPosts() {
  const [ref1, intView1] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [myIdeas, setMyIdeas] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [showExistingComments, setShowExistingComments] = useState({});
  const [showAddCommentBox, setShowAddCommentBox] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComments] = useState({});
  const [commentFeedback, setCommentFeedback] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editedContent, setEditedContent] = useState({});
  const [currentUsername, setCurrentUsername] = useState("");
  const [mostEngagedPost, setMostEngagedPost] = useState(null);
  const [loadingComment, setLoadingComment] = useState({});
  const [currentTier, setCurrentTier] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to see your posts.");
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const decoded = jwtDecode(token);
        const currentUsername = decoded.username;
        setCurrentUsername(currentUsername);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/post`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ideas = response.data.ideas;
        const filteredIdeas = ideas.filter(
          (idea) => idea.username === currentUsername
        );
        setMyIdeas(filteredIdeas);

        const mostEngaged = filteredIdeas.reduce((top, idea) => {
          const engagement =
            (idea.likes?.length || 0) +
            (idea.comments?.length || 0) +
            (idea.views || 0);
          const topEngagement =
            (top.likes?.length || 0) +
            (top.comments?.length || 0) +
            (top.views || 0);
          return engagement > topEngagement ? idea : top;
        }, filteredIdeas[0]);

        setMostEngagedPost(mostEngaged);

        // comment: store backend likes/comments in local state
        const likesMap = {};
        const commentsMap = {};
        filteredIdeas.forEach((idea, idx) => {
          likesMap[idx] = idea.likes?.length || 0;
          commentsMap[idx] = idea.comments || [];
        });
        setLikedPosts(likesMap);
        setComments(commentsMap);
      } catch (error) {
        console.error("Failed to fetch ideas", error);
      }
    };

    fetchPostDetails();

    const interval = setInterval(fetchPostDetails, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalComments = Object.values(comments).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const totalLikes = Object.values(likedPosts).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalPosts = myIdeas.length;

  const tiers = [
    [
      { label: "Post 1 idea", goal: 1, type: "posts" },
      { label: "Receive 3 likes", goal: 3, type: "likes" },
      { label: "Get 5 comments", goal: 5, type: "comments" },
    ],
    [
      { label: "Post 5 ideas", goal: 5, type: "posts" },
      { label: "Receive 15 likes", goal: 15, type: "likes" },
      { label: "Get 20 comments", goal: 20, type: "comments" },
    ],
    [
      { label: "Post 10 ideas", goal: 10, type: "posts" },
      { label: "Receive 40 likes", goal: 40, type: "likes" },
      { label: "Get 50 comments", goal: 50, type: "comments" },
    ],
    [
      { label: "Post 20 ideas", goal: 20, type: "posts" },
      { label: "Receive 100 likes", goal: 100, type: "likes" },
      { label: "Get 100 comments", goal: 100, type: "comments" },
    ],
  ];

  const tierTitles = ["Beginner", "Contributor", "Chatterbox", "Legend"];

  const tierMilestones = tiers[currentTier].map((m) => {
    let count = 0;
    if (m.type === "comments") count = totalComments;
    else if (m.type === "likes") count = totalLikes;
    else if (m.type === "posts") count = totalPosts;
    return { ...m, completed: count >= m.goal };
  });

  const completedMilestones = tierMilestones.filter((m) => m.completed).length;
  const allMilestonesCompleted = completedMilestones === tierMilestones.length;

  const handleNextTier = () => {
    if (currentTier < tiers.length - 1) {
      setCurrentTier((prev) => prev + 1);
    }
  };

  const handlePrevTier = () => {
    if (currentTier > 0) {
      setCurrentTier((prev) => prev - 1);
    }
  };

  const handleView = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/view`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to track view", err);
    }
  };
  const toggleReadMore = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleLike = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const postId = myIdeas[index]._id;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLikedPosts((prev) => ({
        ...prev,
        [index]: response.data.likes.length,
      }));
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  const toggleExistingComments = (index) => {
    setShowExistingComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const toggleAddCommentBox = (index) => {
    setShowAddCommentBox((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleCommentChange = (index, value) => {
    setNewComments((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const postComment = async (index) => {
    const commentText = newComment[index];
    if (!commentText) return;

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const username = decoded.username;
    const postId = myIdeas[index]._id;

    try {
      setLoadingComment((prev) => ({ ...prev, [index]: true }));
      await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), { username, text: commentText }],
      }));
      setNewComments((prev) => ({
        ...prev,
        [index]: "",
      }));

      setCommentFeedback((prev) => ({
        ...prev,
        [index]: "Comment added!",
      }));

      setLoadingComment((prev) => ({ ...prev, [index]: false }));
      setTimeout(() => {
        setCommentFeedback((prev) => ({
          ...prev,
          [index]: "",
        }));
      }, 2000);
    } catch (err) {
      console.error("Comment failed", err);
      setLoadingComment((prev) => ({ ...prev, [index]: false }));
    }
  };
  const deleteComment = async (postIndex, commentIndex) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const postId = myIdeas[postIndex]._id;
    const commentToDelete = comments[postIndex][commentIndex];

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { text: commentToDelete.text }, // send text to identify comment
        }
      );

      setComments((prev) => {
        const updated = [...prev[postIndex]];
        updated.splice(commentIndex, 1);
        return { ...prev, [postIndex]: updated };
      });

      toast.success("Comment deleted.");
    } catch (err) {
      console.error("Failed to delete comment", err);
      toast.error("Failed to delete comment.");
    }
  };
  //enable edit and store current
  const enableEdit = (index) => {
    setEditMode((prev) => ({
      ...prev,
      [index]: true,
    }));
    setEditedContent((prev) => ({
      ...prev,
      [index]: {
        description: myIdeas[index].description,
      },
    }));
  };
  const deletePost = async (index) => {
    const id = myIdeas[index]._id;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedIdeas = [...myIdeas];
      updatedIdeas.splice(index, 1);
      setMyIdeas(updatedIdeas);
    } catch (error) {
      console.log("Delete failed", error);
      console.log("Deleting post with id:", id);
    }
  };
  const handleEditChange = (index, field, value) => {
    setEditedContent((prev) => ({
      ...prev,
      [index]: { ...prev[index], description: value },
    }));
  };
  const saveEdit = async (index) => {
    const id = myIdeas[index]._id;
    const updatedDescription = editedContent[index]?.description || "";
    const updated = {
      description: updatedDescription,
    };
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/post/${id}`, updated, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedIdeas = [...myIdeas];
      updatedIdeas[index] = {
        ...updatedIdeas[index],
        description: updatedDescription,
      };
      setMyIdeas(updatedIdeas);
      setEditMode((prev) => ({
        ...prev,
        [index]: false,
      }));
    } catch (error) {
      console.log("Failed to save edit", error);
      console.log("Editing post with id:", id);
    }
  };
  return (
    <>
      <div className="dashboard-dashboard-container">
        <h1 className="dashboard-dashboard-title">
          Welcome Back {currentUsername && <span>{currentUsername}</span>} 👋
        </h1>
        <div className="dashboard-dashboard-cards">
          <div className="dashboard-card dashboard-card-1">
            <h3>
              <span className="card-icon">📝</span> Latest Posts
            </h3>
            <div className="post-list">
              {myIdeas.slice(0, 3).map((idea, i) => (
                <div key={i} className="dashboard-post-preview">
                  <p className="post-title">{idea.topic}</p>
                  <p className="post-date">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            {myIdeas.length > 3 && (
              <button
                className="show-all-btn"
                onClick={() =>
                  document
                    .querySelector(".myposts-page")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Show All →
              </button>
            )}
          </div>
          <div className="dashboard-card dashboard-card-2">
            <h3> 📊 Top Post Engagement</h3>
            {mostEngagedPost ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    {
                      name: mostEngagedPost.topic || "Top Post",
                      Likes: mostEngagedPost.likes?.length || 0,
                      Comments: mostEngagedPost.comments?.length || 0,
                      Views: mostEngagedPost.views || 0,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barCategoryGap="90%"
                  barGap={25}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#ffffff"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#ffffff"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      border: "none",
                      borderRadius: 10,
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#ccc" }}
                  />
                  <Legend wrapperStyle={{ color: "#fff", fontSize: 12 }} />
                  <Bar dataKey="Likes" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="Comments"
                    fill="#1e90ff"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar dataKey="Views" fill="#6bcf63" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data yet</p>
            )}
          </div>
          <div className="dashboard-card dashboard-card-3">
            <h3>🏆 Achievements</h3>

            <div className="tier-slider">
              <button className="nav-arrow" onClick={handlePrevTier}>
                ‹
              </button>
              <div className="tier-content">
                <h4 className="tier-title">
                  Tier {currentTier} - {tierTitles[currentTier]}
                </h4>

                <div className="progress-container">
                  <div className="progress-label">
                    {completedMilestones}/{tierMilestones.length} Completed
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (completedMilestones / tierMilestones.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <ul className="milestone-list">
                  {tierMilestones.map((milestone, i) => (
                    <li
                      key={i}
                      className={milestone.completed ? "completed" : "locked"}
                    >
                      <span className="badge-icon">
                        {milestone.completed ? "✅" : "🔒"}
                      </span>
                      {milestone.label}
                    </li>
                  ))}
                </ul>

                {allMilestonesCompleted && currentTier < 3 && (
                  <div className="tier-upgrade-message">
                    🎉 All milestones complete! You’ve unlocked Tier{" "}
                    {currentTier + 1}!
                  </div>
                )}
              </div>
              <button className="nav-arrow" onClick={handleNextTier}>
                ›
              </button>
            </div>
          </div>

          <div className="dashboard-card dashboard-card-4">
            <h3>🔗 Recent Interactions</h3>

            <div className="network-content">
              {/* Interactions Feed */}
              <div
                className="interaction-feed"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
              >
                <ul className="interaction-list">
                  {[...myIdeas]
                    .flatMap((idea) => {
                      const likes = (idea.likes || []).map((user) => ({
                        type: "like",
                        user,
                        topic: idea.topic,
                        createdAt: idea.createdAt,
                      }));

                      const comments = (idea.comments || []).map((comment) => ({
                        type: "comment",
                        user: comment.username,
                        text: comment.text,
                        topic: idea.topic,
                        createdAt: comment.createdAt || idea.createdAt,
                      }));

                      return [...likes, ...comments];
                    })
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .slice(0 , 30) // ✅ Limit to latest 30 notifications
                    .map((interaction, i) => (
                      <li key={i} className="interaction-item">
                        {interaction.type === "like" ? (
                          <p className="interaction-event">
                            ❤️ <strong>{interaction.user}</strong> liked your
                            post "<em>{interaction.topic}</em>"
                          </p>
                        ) : (
                          <p className="interaction-event">
                            💬 <strong>{interaction.user}</strong> commented on
                            "<em>{interaction.topic}</em>": "{interaction.text}"
                          </p>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="myposts-page">
        {myIdeas.map((idea, index) => (
          <div
            className="post-card"
            key={index}
            onClick={() => handleView(idea._id)}
          >
            <div className="post-header">
              <div className="user-profile">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="profile pic"
                  className="profile-pic"
                />
                <div>
                  <h3 className="username">{idea.fullName}</h3>
                  <p className="role">{idea.role}</p>
                  <p className="timestamp">
                    {new Date(idea.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="post-actions">
                <button
                  className="icon-btn"
                  aria-label="Edit"
                  onClick={() => enableEdit(index)}
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn"
                  aria-label="Delete"
                  onClick={() => deletePost(index)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="post-content">
              <div className="post-meta-grid">
                <div>
                  <strong>Topic:</strong> {idea.topic}
                </div>
                <div>
                  <strong>Startup name:</strong> {idea.startupName}
                </div>
                <div>
                  <strong>Industry:</strong> {idea.industry}
                </div>
                <div>
                  <strong>Website:</strong> {idea.website}
                </div>
              </div>
              <div className="post-meta-grid">
                <div>
                  <strong>Stage:</strong> {idea.stage}
                </div>
                <div>
                  <strong>Goals:</strong> {idea.goals}
                </div>
                <div>
                  <strong>Market:</strong> {idea.market}
                </div>
                <div>
                  <strong>Email:</strong> {idea.email}
                </div>
              </div>
              <div className="description-box">
                <div className="description-header">
                  <span className="desc-icon">
                    <i className="fa fa-align-left"></i>
                  </span>
                  <span className="desc-label">Description:</span>
                </div>
                {editMode[index] ? (
                  <>
                    <textarea
                      className="edit-fields"
                      value={editedContent[index]?.description || ""}
                      onChange={(e) =>
                        handleEditChange(index, "description", e.target.value)
                      }
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(index)}>Save</button>
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          setEditMode((prev) => ({ ...prev, [index]: false }))
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="description-text">
                      {idea.description.length > 150 && !expandedIndexes[index]
                        ? idea.description.slice(0, 150) + "..."
                        : idea.description}
                    </p>
                    {idea.description.length > 150 && (
                      <button
                        className="readmore-btn"
                        onClick={() => toggleReadMore(index)}
                      >
                        {expandedIndexes[index] ? "Read less" : "Read more"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="post-footer">
              <div className="likes-comments">
                <button className="icon-btn" onClick={() => toggleLike(index)}>
                  {likedPosts[index] > 0 ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
                <span>{likedPosts[index] || 0} Likes</span>
                <button
                  className="icon-btn"
                  onClick={() => toggleExistingComments(index)}
                >
                  <BsChatDots />
                </button>
                <span>{comments[index]?.length || 0} Comments</span>
              </div>

              {showExistingComments[index] && (
                <div className="comment-section">
                  {/* {(comments[index] || []).map((comment, cIndex) => (
                    <div key={cIndex} className="single-comment">
                      <strong>{comment.username}:</strong> {comment.text}
                    </div>
                  ))} */}
                  {(comments[index] || []).map((comment, cIndex) => (
                    <div key={cIndex} className="comment-item">
                      <div className="comment-left">
                        <FaUserCircle className="comment-avatar" />
                        <div className="comment-content">
                          <span className="comment-username">
                            {comment.username}
                          </span>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      </div>
                      {comment.username === currentUsername && (
                        <button
                          className="delete-comment-btn"
                          onClick={() => deleteComment(index, cIndex)}
                          title="Delete Comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="comment-box">
                    <textarea
                      placeholder="Write a comment..."
                      value={newComment[index] || ""}
                      onChange={(e) =>
                        handleCommentChange(index, e.target.value)
                      }
                    />
                    {/* <button
                      className="send-btn"
                      onClick={() => postComment(index)}
                    >
                      <FiSend />
                    </button> */}
                    <button
                      className="send-btn"
                      onClick={() => postComment(index)}
                      disabled={loadingComment[index]}
                    >
                      {loadingComment[index] ? (
                        <div className="comment-spinner"></div>
                      ) : (
                        <FiSend />
                      )}
                    </button>
                  </div>
                  {commentFeedback[index] && (
                    <div className="comment-feedback">
                      {commentFeedback[index]}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
