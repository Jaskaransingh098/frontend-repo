import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import gsap from "gsap";
import AllPosts from "../../../../Components/AllPosts/AllPosts";
import "./Explore.css";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const detailRef = useRef();
  const wrapperRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("health");
  const [allPosts, setAllPosts] = useState([]);
  const [allPostLikes, setAllPostLikes] = useState({});
  const [allPostComments, setAllPostComments] = useState({});
  const [allNewComments, setAllNewComments] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const industryImages = {
    tech: "/explore-video/tech.jpg",
    health: "/explore-video/healthcare.jpg",
    ecommerce: "/explore-video/e-commerce.jpg",
    education: "/explore-video/education.jpg",
    food: "/explore-video/food.jpg",
  };
  const [randomPosts, setRandomPosts] = useState([]);
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/trending`
        );
        setTrendingPosts(response.data.posts);
      } catch (error) {
        console.error("Failed to fetch trending posts:", error);
      }
    };

    const fetchPostDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token || !selectedPost) return;

      try {
        const [likedRes, commentsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/post/${selectedPost._id}/liked`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/post/${selectedPost._id}/comments`
          ),
        ]);

        setLiked(likedRes.data.liked);
        setComments(commentsRes.data.comments);
      } catch (error) {
        console.error("Error loading post details:", error);
      }
    };

    fetchTrending();
    fetchPostDetails();
  }, []);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/random`
        );
        setRandomPosts(res.data.posts);
      } catch (err) {
        console.error("Error loading random posts:", err);
      }
    };
    fetchRandomPosts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/allposts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ideas = response.data.ideas;
        setAllPosts(ideas);
        setFilteredPosts(ideas);

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

  useEffect(() => {
    if (!query.trim()) {
      setFilteredPosts(allPosts); // Show all posts if nothing is searched
    } else {
      const filtered = allPosts.filter((post) =>
        post.industry.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [query, allPosts]);

  const fetchPostsByIndustry = async (industry) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/random?industry=${industry}`
      );
      setRandomPosts(res.data.posts);
      setCurrentIndex(0); // Reset carousel position
      setSelectedTopic(industry);
    } catch (err) {
      console.error("Error fetching posts by industry:", err);
    }
  };

  function formatTimeAgo(dateString) {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now - created) / 1000); // in seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedPost) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${selectedPost._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(res.data.likes.includes(/* your current user */));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedPost || !commentInput.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${selectedPost._id}/comments`,
        { text: commentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setCommentInput("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const topics = ["ecommerce", "health", "education", "tech", "food"];
  const isAnimating = query.length > 0 && isFocused;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        detailRef.current &&
        !detailRef.current.contains(event.target)
      ) {
        gsap.to(detailRef.current, {
          x: 50,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setSelectedPost(null);
          },
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPost]);
  useEffect(() => {
    if (selectedPost && detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        {
          x: 50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [selectedPost]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % randomPosts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? randomPosts.length - 1 : prev - 1));
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

  const handleCommentUpdate = (index, postId, text, submit) => {
    if (submit) {
      if (!text?.trim()) return;

      const token = localStorage.getItem("token");
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const newComment = res.data;
          setAllPostComments((prev) => ({
            ...prev,
            [index]: [...(prev[index] || []), newComment],
          }));
          setAllNewComments((prev) => ({ ...prev, [index]: "" }));
        })
        .catch((err) => {
          console.error("Error posting comment:", err);
        });
    } else {
      setAllNewComments((prev) => ({ ...prev, [index]: text }));
    }
  };


  return (
    <>
      <div className="explore-page-insider">
        <div className="explore-insider-header">
          <video className="explore-bg-video" autoPlay loop muted playsInline>
            <source src="/explore-video/search section .mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="explore-insider-headers">
            <input
              className={`explore-search ${isAnimating ? "active-border" : ""}`}
              type="text"
              id="search-tags"
              name="searchTags"
              placeholder="Search tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const trimmed = query.trim().toLowerCase();
                  const filtered = allPosts.filter((post) =>
                    post.industry?.toLowerCase().includes(trimmed)
                  );
                  setFilteredPosts(filtered);
                }
              }}
            />

            <button
              className="clear-filter-btn"
              onClick={() => {
                setQuery("");
                setActiveTag("");
              }}
            >
              Clear Filter
            </button>
            <div className="suggestion-tags">
              <ul>
                {["ecommerce", "health", "education", "tech", "food"].map(
                  (tag) => (
                    <li
                      key={tag}
                      className={activeTag === tag ? "active-tag" : ""}
                      onClick={() => {
                        setQuery(tag);
                        setActiveTag(tag);
                        const filtered = allPosts.filter(
                          (post) =>
                            post.industry?.toLowerCase() === tag.toLowerCase()
                        );
                        setFilteredPosts(filtered);
                      }}
                    >
                      {tag}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
        <h2 className="trending-title-header">🔥 Trending now</h2>
        <div ref={wrapperRef}>
          <div
            className={`trending-container-expanded ${
              selectedPost ? "expanded" : ""
            }`}
          >
            <div className="trending-cards-panel">
              {trendingPosts.map((post) => {
                const industryKey =
                  post.industry?.toLowerCase().replace(/\s-/g, "") || "default";
                const backgroundImage =
                  industryImages[industryKey] || "/explore-video/default.jpg";

                return (
                  <div
                    key={post._id}
                    className={`trending-card ${
                      selectedPost?._id === post._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedPost(post)}
                    style={{
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="trending-title">{post.industry}</div>
                    <div className="trending-bottom-bar">
                      <div className="stat">
                        ❤️ {post.likesCount ?? post.likes?.length ?? 0}
                      </div>
                      <div className="stat">👁️ {post.views ?? 0}</div>
                      <div className="user">by @{post.username}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedPost && (
              <div className="trending-detail-panel" ref={detailRef}>
                <h2 className="detail-header">{selectedPost.topic}</h2>
                <p>
                  <strong>Description:</strong> {selectedPost.description}
                </p>
                <p>
                  <strong>Stage:</strong> {selectedPost.stage}
                </p>
                <p>
                  <strong>Market:</strong> {selectedPost.market}
                </p>
                <p>
                  <strong>Goals:</strong> {selectedPost.goals}
                </p>
                <p>
                  <strong>Startup:</strong> {selectedPost.startupName} (
                  {selectedPost.industry})
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={selectedPost.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedPost.website}
                  </a>
                </p>
                <p>
                  <strong>Founder:</strong> {selectedPost.fullName} -{" "}
                  {selectedPost.role}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPost.email}
                </p>

                <div className="detail-stats">
                  <p>❤️ {selectedPost.likes?.length ?? 0} Likes</p>
                  <p>👁️ {selectedPost.views ?? 0} Views</p>
                  <p>💬 {selectedPost.comments?.length ?? 0} Comments</p>
                </div>

                {selectedPost.comments?.length > 0 && (
                  <div className="trending-comments-section">
                    <h3>Comments</h3>
                    {selectedPost.comments.map((comment, idx) => (
                      <div className="trending-comment" key={idx}>
                        <strong>@{comment.username}</strong>: {comment.text}
                      </div>
                    ))}
                  </div>
                )}
                <div className="interaction-bar">
                  <button onClick={handleLikeToggle}>
                    {liked ? "💖 Liked" : "🤍 Like"}
                  </button>
                </div>

                <div className="trending-comment-section">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <button onClick={handleCommentSubmit}>Post</button>
                </div>

                {comments.map((cmt, idx) => (
                  <div key={idx} className="trending-comment">
                    <strong>@{cmt.username}</strong>: {cmt.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="topics-container">
          <h2 className="topics-title">🧠 Explore by Topics</h2>

          <div className="topics-scroll">
            {topics.map((topic, index) => (
              <div
                className={`topic-card ${
                  selectedTopic === topic ? "active" : ""
                }`}
                key={index}
                onClick={() => fetchPostsByIndustry(topic)}
              >
                <span>{topic.charAt(0).toUpperCase() + topic.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="discoveries-container">
          <div className="carousel-wrapper">
            <button className="carousel-btn left" onClick={handlePrev}>
              ‹
            </button>

            <div className="carousel-track">
              <div
                className="carousel-inner"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {randomPosts.length > 0 ? (
                  randomPosts.map((item) => (
                    <div className="discovery-card-carousel" key={item._id}>
                      <video
                        className="discovery-bg-video left"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source
                          src="/explore-video/search section 2.mp4"
                          type="video/mp4"
                        />
                      </video>

                      <video
                        className="discovery-bg-video right"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source
                          src="/explore-video/search section 2.mp4"
                          type="video/mp4"
                        />
                      </video>
                      <div className="discovery-overlay">
                        <div className="discovery-content">
                          <div className="discovery-header">
                            <div className="discovery-avatar-circle">
                              {item.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="discovery-user-info">
                              <div className="discovery-user-top">
                                <span className="discovery-username">
                                  @{item.username}
                                </span>
                                <span className="dot">•</span>
                                <span className="timestamp">
                                  {formatTimeAgo(item.createdAt)}
                                </span>
                              </div>
                              <div className="discovery-topic-industry">
                                <span className="badge industry">
                                  {item.industry}
                                </span>
                                <span className="badge topic">
                                  {item.topic}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="discovery-description-text">
                            {item.description?.slice(0, 180)}...
                          </div>

                          <div className="extra-fields">
                            <p>
                              <strong>Stage:</strong> {item.stage || "N/A"}
                            </p>
                            <p>
                              <strong>Market:</strong> {item.market || "N/A"}
                            </p>
                            <p>
                              <strong>Goals:</strong> {item.goals || "N/A"}
                            </p>
                          </div>

                          {item.website && (
                            <p className="discovery-link">
                              🔗{" "}
                              <a
                                href={item.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.website}
                              </a>
                            </p>
                          )}

                          <div className="discovery-footer">
                            <span className="stat big">
                              ❤️ {item.likes?.length ?? 0}
                            </span>
                            <span className="stat big">
                              💬 {item.comments?.length ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="discovery-card-carousel">
                    <div className="discovery-content">
                      <h3>No posts found for this topic.</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="carousel-btn right" onClick={handleNext}>
              ›
            </button>
          </div>
        </div>
        <h2 className="section-heading">All Posts</h2>
        <AllPosts
          posts={filteredPosts}
          likes={allPostLikes}
          comments={allPostComments}
          newComments={allNewComments}
          onLike={handleAllPostLike}
          onCommentSubmit={handleCommentUpdate}
        />
      </div>
    </>
  );
}
