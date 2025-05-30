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
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to see your posts.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentUsername = decoded.username;
      console.log("Decoded username:", currentUsername); // ← For debugging

      const fetchIdeas = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/post`
          );
          const ideas = response.data.ideas;

          const filteredIdeas = ideas.filter(
            (idea) => idea.username === currentUsername
          );

          setMyIdeas(filteredIdeas);
        } catch (error) {
          console.error("Failed to fetch ideas", error);
        }
      };

      fetchIdeas();
    } catch (err) {
      console.error("Error decoding token", err);
    }
  }, []);
  const toggleReadMore = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const toggleLike = (index) => {
    setLikedPosts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
  const postComment = (index) => {
    const commentText = newComment[index];
    if (!commentText) return;

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const username = decoded.username;

    const newEntry = { username, text: commentText };

    setComments((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), newEntry],
    }));
    setNewComments((prev) => ({
      ...prev,
      [index]: "",
    }));
    setShowAddCommentBox((prev) => ({
      ...prev,
      [index]: false,
    }));

    console.log(`Comment added for post ${index}`);

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
    // <motion.div
    //   className="Myposts-page"
    //   ref={ref1}
    //   initial={{ opacity: 0, y: 50 }}
    //   animate={intView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    //   transition={{ duration: 0.8 }}
    // >

    //   {myIdeas.length === 0 ? (
    //     <div className="no-posts">
    //       <p>You haven’t posted any ideas yet. Get started!</p>
    //       <img src="/assets/empty-state.svg" alt="No posts" />
    //     </div>
    //   ) : (
    //     myIdeas.map((idea, index) => {
    //       const isExpanded = expandedIndexes[index];
    //       const isEditing = editMode[index];

    //       return (
    //         <motion.div
    //           key={index}
    //           className="explore-container"
    //           initial={{ opacity: 0, y: 30 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           exit={{ opacity: 0, y: -20 }}
    //           transition={{ duration: 0.5 }}
    //         >
    //           <div className="Myposts-nav">
    //             <div className="nav-header">
    //               <div className="user-info">
    //                 <img
    //                   src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
    //                   alt="Profile"
    //                   className="profile-pic"
    //                 />
    //                 <span className="username-text">{idea.username}</span>
    //               </div>
    //               <h1>{new Date(idea.createdAt).toLocaleString()}</h1>
    //             </div>
    //           </div>

    //           <div className="Myposts-body">
    //             {isEditing ? (
    //               <motion.div
    //                 className="edit-fields"
    //                 initial={{ opacity: 0 }}
    //                 animate={{ opacity: 1 }}
    //               >
    //                 <textarea
    //                   value={editedContent[index]?.description || ""}
    //                   onChange={(e) =>
    //                     handleEditChange(index, "description", e.target.value)
    //                   }
    //                 />
    //                 <div className="edit-actions">
    //                   <button onClick={() => saveEdit(index)}>Save</button>
    //                   <button
    //                     className="cancel-btn"
    //                     onClick={() =>
    //                       setEditMode((prev) => ({ ...prev, [index]: false }))
    //                     }
    //                   >
    //                     Cancel
    //                   </button>
    //                 </div>
    //               </motion.div>
    //             ) : (
    //               <div className="body-text">
    //                 {isExpanded ? (
    //                   <ul className="post-details">
    //                     <li>
    //                       <strong>Full Name:</strong> {idea.fullName}
    //                     </li>
    //                     <li>
    //                       <strong>Email:</strong> {idea.email}
    //                     </li>
    //                     <li>
    //                       <strong>Startup Name:</strong> {idea.startupName}
    //                     </li>
    //                     <li>
    //                       <strong>Topic:</strong> {idea.topic}
    //                     </li>
    //                     <li>
    //                       <strong>Description:</strong> {idea.description}
    //                     </li>
    //                     <li>
    //                       <strong>Industry:</strong> {idea.industry}
    //                     </li>
    //                     <li>
    //                       <strong>Role:</strong> {idea.role}
    //                     </li>
    //                     <li>
    //                       <strong>Stage:</strong> {idea.stage}
    //                     </li>
    //                     <li>
    //                       <strong>Goals:</strong> {idea.goals}
    //                     </li>
    //                     <li>
    //                       <strong>Market:</strong> {idea.market}
    //                     </li>
    //                     <li>
    //                       <strong>Website:</strong> {idea.website}
    //                     </li>
    //                     <li>
    //                       <button
    //                         onClick={() => toggleReadMore(index)}
    //                         className="readmore-btn"
    //                       >
    //                         Read less
    //                       </button>
    //                     </li>
    //                   </ul>
    //                 ) : (
    //                   <div>
    //                     <p>
    //                       <strong>Topic:</strong> {idea.topic}
    //                     </p>
    //                     <p>
    //                       <strong>Startup:</strong> {idea.startupName}
    //                     </p>
    //                     <p>
    //                       <strong>Description:</strong>{" "}
    //                       {idea.description.length > 150
    //                         ? idea.description.slice(0, 150) + "..."
    //                         : idea.description}
    //                     </p>
    //                     <button
    //                       onClick={() => toggleReadMore(index)}
    //                       className="readmore-btn"
    //                     >
    //                       Read more
    //                     </button>
    //                   </div>
    //                 )}
    //               </div>
    //             )}
    //           </div>

    //           <div className="like-comment">
    //             <div className="like-section">
    //               <motion.button
    //                 onClick={() => toggleLike(index)}
    //                 whileTap={{ scale: 1.2 }}
    //               >
    //                 {likedPosts[index] ? (
    //                   <FaHeart color="red" size={24} />
    //                 ) : (
    //                   <FaRegHeart size={24} />
    //                 )}
    //               </motion.button>
    //               <span>{likedPosts[index] ? 1 : 0} Likes</span>

    //               <button onClick={() => toggleExistingComments(index)}>
    //                 <BsChatDots size={24} />
    //               </button>
    //             </div>

    //             <div className="action-buttons">
    //               <button onClick={() => enableEdit(index)}>
    //                 <FaEdit size={20} />
    //               </button>
    //               <button onClick={() => deletePost(index)}>
    //                 <FaTrash size={20} />
    //               </button>
    //             </div>

    //             <AnimatePresence>
    //               {showExistingComments[index] && comments[index] && (
    //                 <motion.div
    //                   className="existing-comments"
    //                   initial={{ opacity: 0 }}
    //                   animate={{ opacity: 1 }}
    //                   exit={{ opacity: 0 }}
    //                 >
    //                   {comments[index].map((cmt, i) => (
    //                     <div key={i} className="comment-entry">
    //                       <FaUserCircle size={24} className="comment-icon" />
    //                       <div className="comment-content">
    //                         <span className="comment-username">
    //                           {cmt.username + " -"}
    //                         </span>
    //                         <p className="comment-text">{cmt.text}</p>
    //                       </div>
    //                     </div>
    //                   ))}
    //                 </motion.div>
    //               )}
    //             </AnimatePresence>

    //             <div className="comment-section">
    //               <button onClick={() => toggleAddCommentBox(index)}>
    //                 <BsChatDots size={24} />
    //               </button>

    //               <AnimatePresence>
    //                 {showAddCommentBox[index] && (
    //                   <motion.div
    //                     className="comment-input"
    //                     initial={{ opacity: 0, y: 10 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     exit={{ opacity: 0, y: -10 }}
    //                     transition={{ duration: 0.3 }}
    //                   >
    //                     <textarea
    //                       placeholder="Write a comment..."
    //                       value={newComment[index] || ""}
    //                       onChange={(e) =>
    //                         handleCommentChange(index, e.target.value)
    //                       }
    //                     />
    //                     <button
    //                       onClick={() => postComment(index)}
    //                       disabled={!newComment[index]}
    //                     >
    //                       <FiSend size={20} />
    //                     </button>
    //                   </motion.div>
    //                 )}
    //               </AnimatePresence>

    //               {commentFeedback[index] && (
    //                 <motion.div
    //                   className="comment-feedback"
    //                   initial={{ opacity: 0 }}
    //                   animate={{ opacity: 1 }}
    //                   exit={{ opacity: 0 }}
    //                 >
    //                   {commentFeedback[index]}
    //                 </motion.div>
    //               )}
    //             </div>
    //           </div>
    //         </motion.div>
    //       );
    //     })
    //   )}
    // </motion.div>
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
              <button className="icon-btn" aria-label="Edit">
                <FaEdit />
              </button>
              <button className="icon-btn" aria-label="Delete">
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
              <p className="description-text">
                {expandedIndexes[index]
                  ? idea.description
                  : idea.description.length > 200
                  ? idea.description.slice(0, 200) + "..."
                  : idea.description}
              </p>
              {idea.description.length > 200 && (
                <button
                  className="readmore-btn"
                  onClick={() => toggleReadMore(index)}
                >
                  {expandedIndexes[index] ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>

          <div className="post-footer">
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
          </div>
        </div>
      ))}
    </div>
  );
}
