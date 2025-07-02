import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import "./AboutMe.scss";

const sections = [
  {
    title: "👨‍💻 Who's This Guy?",
    content: `Hey there! I'm Jaskaran 👋 — just one guy, one keyboard ⌨️, and a whole lot of caffeine ☕ fueling my code. I'm a Full Stack Web Developer 💻 who built InnoLinkk completely solo — yep, no team, no interns, no AI overlords 🤖.

It’s just me — coding through the day 🌞 (and sometimes the night 🌙), fixing bugs that don’t even exist yet 🐞, and turning startup dreams into clickable reality 🚀.

I love building things from scratch 🛠️, pushing pixels, breaking stuff (on purpose… mostly 😅), and bringing bold ideas to life. Whether it's front-end sparkle ✨ or back-end logic 🧠, I enjoy wearing all the hats 🎩 — because, well, I have to!

If you're reading this, you’ve already made it into my digital playground 🕹️ — welcome aboard! Let’s make innovation less corporate and more fun 🎉.`,
    image: "/contactus-pics/my_pic.png",
  },
  {
    title: "💡 What’s InnoLinkk?",
    content: `InnoLinkk isn’t just a website — it’s a rebellion ⚔️. A rebellion against great startup ideas 💡 dying in silent group chats or forgotten Notes apps 📱. I built this platform to give those ideas a place to breathe 🌬️, grow 🌱, and maybe even go viral 📈.

Whether your idea is brilliant 🤯, bizarre 🤪, or both — you’ve got a home here 🏠. InnoLinkk is designed to turn your "what if..." into a "heck yes!" 🔥.

It’s a community for thinkers 🧠, dreamers 💭, and builders 🏗️ — because everyone deserves a space to be heard and seen 👀.`,
    image: "/contactus-pics/innolinkk logo.png",
  },
  {
    title: "🎯 My Mission",
    content: `Too many startup ideas never see the light of day 🌤️ because people don’t have a place to share them 🗣️. I’m on a mission to rescue those lost concepts 📂 from the 'Someday' folder and give them a fighting chance 🥊.

InnoLinkk is the startup playground 🛝 where creativity 🧪 meets collaboration 🤝 — minus the VC pressure 💼 and pitch-deck panic 😰.

My goal? To turn quiet whispers of ideas into loud, powerful movements 🌊. This isn’t just about apps or websites — it’s about sparking a mindset of action ⚡.`,
    image: "/contactus-pics/Gemini_Generated_Image_mcowucmcowucmcow.png",
  },
  {
    title: "🛠️ My Superpowers (a.k.a. Tech Stack)",
    content: `I code with the MERN Stack 💻, which is basically the superhero squad 🦸‍♂️ of web development:

• MongoDB 🟢 – for storing your big ideas 💡
• Express.js ⚙️ – keeps the backend smooth and spicy 🌶️
• React.js ⚛️ – makes the frontend dance 💃
• Node.js 🌐 – powers it all behind the scenes 🎬

Bonus skill? Debugging bugs that don’t even exist yet 🐛😄. I love clean code, reusable components, and console logs that make sense (mostly 😂).`,
    image: "/contactus-pics/Mern-removebg-preview.png",
  },
  {
    title: "🧍‍♂️ Why I Work Alone",
    content: `Because when I argue with the developer 👨‍💻, the designer 🎨, or the product manager 📋… it’s just me yelling at myself 😅.

Working solo means every part of InnoLinkk is personal 💖 — built with care, late nights 🌙, and probably too much coffee ☕. There's no bureaucracy here — only creativity unleashed ⚡.

I move fast 🚀, I break things (intentionally 😎), and I fix them better than before 🛠️. That’s the beauty of being a one-man army 🪖 — full control, full accountability, full passion 🔥.`,
    image: "/contactus-pics/laptop.png",
  },
  {
    title: "📌 TL;DR",
    content: `One guy. One dream. One platform to make startup ideas go from "hmm…" 🤔 to "heck yes!" 🙌

Welcome to InnoLinkk — where your lightbulb moments 💡 meet action 🚀. Whether you're an idea generator, a builder, or just curious — there's space for you here 🪐.

Let’s rethink how ideas are shared, who gets heard, and what *could* happen when innovation is for everyone 🌍.`,
    image: "/contactus-pics/last.png",
  },
];

const AboutMe = () => {
  const [showArrow, setShowArrow] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;

      const scrolledToEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
      setShowArrow(!scrolledToEnd);
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
      // Trigger on mount
      handleScroll();
    }

    return () => {
      if (scrollEl) scrollEl.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <>
      <div className="aboutme-background-wrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="aboutme-background-video"
        >
          <source src="/contactus-pics/video2.mp4" type="video/mp4" />
        </video>
        <div className="aboutme-overlay" />
      </div>
      <div className="about-me-gallery">
        <div className="gallery-scroll" ref={scrollRef}>
          {sections.map((section, index) => (
            <section className="gallery-card" key={index}>
              <div
                className="gallery-inner"
                style={{
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                <motion.div
                  className="gallery-content"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="section-title">{section.title}</h2>
                  <p className="section-text">{section.content}</p>
                </motion.div>

                <motion.img
                  src={section.image}
                  alt="section visual"
                  className="section-image-3d"
                  initial={{ rotateY: -20, opacity: 0 }}
                  whileInView={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </section>
          ))}
        </div>
        {showArrow && (
          <div
            className="scroll-arrow"
            onClick={() =>
              scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
            }
          >
            <FaArrowRight className="arrow-icon" />
          </div>
        )}
      </div>
    </>
  );
};

export default AboutMe;
