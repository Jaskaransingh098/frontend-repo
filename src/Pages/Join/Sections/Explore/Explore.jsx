import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import gsap from "gsap";
import "./Explore.css";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const detailRef = useRef();
  const wrapperRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const industryImages = {
    tech: "/explore-video/tech.jpg",
    health: "/explore-video/healthcare.jpg",
    ecommerce: "/explore-video/e-commerce.jpg",
    education: "/explore-video/education.jpg",
    food: "/explore-video/food.jpg",
  };

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

    fetchTrending();
  }, []);

  const topics = [
    "Artificial Intelligence",
    "Web3",
    "Design",
    "HealthTech",
    "E-commerce",
    "SaaS",
    "Education",
    "Green Tech",
    "Gaming",
    "Productivity",
  ];
  const discoveries = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `💡 Idea #${i + 1}`,
    content: "Explore something fresh and innovative.",
    user: `user${i + 10}`,
    image: `https://source.unsplash.com/random/300x30${i}?innovation`,
  }));
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const isAnimating = query.length > 0 && isFocused;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        selectedPost &&
        detailRef.current
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
    setCurrentIndex((prev) => (prev + 1) % discoveries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? discoveries.length - 1 : prev - 1));
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
              placeholder="Search tags..."
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <div className="suggestion-tags">
              <ul>
                <li>E-commerce</li>
                <li>AI</li>
                <li>Design</li>
                <li>Marketing</li>
                <li>Portfolio</li>
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
              <div className="trending-detail-panel">
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
              </div>
            )}
          </div>
        </div>
        <div className="topics-container">
          <h2 className="topics-title">🧠 Explore by Topics</h2>
          <div className="topics-scroll">
            {topics.map((topic, index) => (
              <div className="topic-card" key={index}>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="discoveries-container">
          <h2 className="discoveries-title">🎯 Random Discoveries</h2>

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
                {discoveries.map((item) => (
                  <div className="discovery-card-carousel" key={item.id}>
                    <div>
                      <img
                        src={item.image}
                        alt="discovery"
                        className="discovery-img"
                      />
                      <div className="discovery-content">
                        <h3>{item.title}</h3>
                        <p>by @{item.user}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-btn right" onClick={handleNext}>
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
