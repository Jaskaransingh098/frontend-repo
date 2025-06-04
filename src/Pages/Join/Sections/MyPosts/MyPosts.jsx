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
  //current user idea fetching
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Please log in to see your posts.");
  //     return;
  //   }
  //   try {
  //     const decoded = jwtDecode(token);
  //     const currentUsername = decoded.username;
  //     console.log("Decoded username:", currentUsername); // ← For debugging
  //     const fetchIdeas = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${import.meta.env.VITE_API_URL}/post`
  //         );
  //         const ideas = response.data.ideas;
  //         const filteredIdeas = ideas.filter(
  //           (idea) => idea.username === currentUsername
  //         );
  //         setMyIdeas(filteredIdeas);
  //       } catch (error) {
  //         console.error("Failed to fetch ideas", error);
  //       }
  //     };
  //     fetchIdeas();
  //   } catch (err) {
  //     console.error("Error decoding token", err);
  //   }
  // }, []);
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
  }, []);
  const toggleReadMore = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  // const toggleLike = (index) => {
  //   setLikedPosts((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };
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
  // const postComment = (index) => {
  //   const commentText = newComment[index];
  //   if (!commentText) return;
  //   const token = localStorage.getItem("token");
  //   const decoded = jwtDecode(token);
  //   const username = decoded.username;
  //   const newEntry = { username, text: commentText };
  //   setComments((prev) => ({
  //     ...prev,
  //     [index]: [...(prev[index] || []), newEntry],
  //   }));
  //   setNewComments((prev) => ({
  //     ...prev,
  //     [index]: "",
  //   }));
  //   setShowAddCommentBox((prev) => ({
  //     ...prev,
  //     [index]: false,
  //   }));
  //   console.log(`Comment added for post ${index}`);
  //   setCommentFeedback((prev) => ({
  //     ...prev,
  //     [index]: "Comment added!",
  //   }));
  //   setTimeout(() => {
  //     setCommentFeedback((prev) => ({
  //       ...prev,
  //       [index]: "",
  //     }));
  //   }, 2000);
  // };
  const postComment = async (index) => {
    const commentText = newComment[index];
    if (!commentText) return;

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const username = decoded.username;
    const postId = myIdeas[index]._id;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), response.data],
      }));

      setNewComments((prev) => ({
        ...prev,
        [index]: "",
      }));

      setCommentFeedback((prev) => ({
        ...prev,
        [index]: "Comment added!",
      }));

      setTimeout(() => {
        setCommentFeedback((prev) => ({
          ...prev,
          [index]: "",
        }));
      }, 2000);
    } catch (err) {
      console.error("Comment failed", err);
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
      <div className="myposts-page">
        {myIdeas.map((idea, index) => (
          <div className="post-card" key={index}>
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
                  {(comments[index] || []).map((comment, cIndex) => (
                    <div key={cIndex} className="single-comment">
                      <strong>{comment.username}:</strong> {comment.text}
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
                    <button
                      className="send-btn"
                      onClick={() => postComment(index)}
                    >
                      <FiSend />
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
            {/* <div className="post-footer">
              <div className="likes-comments">
                <button className="icon-btn" onClick={() => toggleLike(index)}>
                  {likedPosts[index] ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>
                <span>{likedPosts[index] ? 1 : 0} Likes</span>
                <button className="icon-btn">
                  <BsChatDots />
                </button>
              </div>
              <div className="comment-box">
                <textarea
                  placeholder="Write a comment..."
                  value={newComment[index] || ""}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                />
                <button className="send-btn" onClick={() => postComment(index)}>
                  <FiSend />
                </button>
              </div>
              {commentFeedback[index] && (
                <div className="comment-feedback">{commentFeedback[index]}</div>
              )}
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
}
