import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ReactModal from "react-modal";
import EmojiPicker from "emoji-picker-react";
import { jwtDecode } from "jwt-decode"; // ✅ For extracting username from token
import {Helmet} from "react-helmet";
import "./Messages.css";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket", "polling"], // fallback if websocket isn't available
});

socket.on("disconnect", () => {
  console.warn("Socket disconnected. Attempting to reconnect...");
  if (socket.disconnected) socket.connect();
});

function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(""); // ✅ Will be set from token
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const selectedUserRef = useRef(null);
  const messageRef = useRef([]);
  const messagesRef = useRef([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingMessages, setPendingMessages] = useState({});
  const [conversationUsers, setConversationUsers] = useState([]); // ✅ Only users you've chatted with

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded.username);
    }
  }, [token]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/conversations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversationUsers(res.data); // ✅ e.g., ["User2", "User3"]
      } catch (err) {
        console.log("Error fetching conversation users:", err);
      }
    };

    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;

      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/messages/${currentUser}/${selectedUser}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // setMessages(res.data);
        let loadedMessages = res.data;
        if (pendingMessages[selectedUser]) {
          loadedMessages = [
            ...loadedMessages,
            ...pendingMessages[selectedUser],
          ];
          setPendingMessages((prev) => {
            const updated = { ...prev };
            delete updated[selectedUser];
            return updated;
          });
        }
        setMessages(loadedMessages);
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    messageRef.current = messages;
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const incomingHandler = useCallback((msg) => {
    const isChatOpen =
      selectedUserRef.current === msg.sender ||
      selectedUserRef.current === msg.recipient;

    if (isChatOpen) {
      // Prevent duplicate messages (important if backend also sends existing ones)
      const alreadyExists = messagesRef.current.some(
        (m) =>
          m._id === msg._id ||
          (m.message === msg.message &&
            m.sender === msg.sender &&
            m.recipient === msg.recipient)
      );

      if (!alreadyExists) {
        setMessages((prev) => [...prev, msg]);
      }
    }

    // Always add sender to conversation list if not already there
    setConversationUsers((prev) => {
      if (!prev.includes(msg.sender)) {
        return [...prev, msg.sender];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    socket.on(`message:${currentUser}`, incomingHandler);

    return () => {
      socket.off(`message:${currentUser}`, incomingHandler);
    };
  }, [currentUser, incomingHandler]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      const msgData = {
        sender: currentUser,
        recipient: selectedUser,
        message: newMessage,
        timestamp: new Date().toISOString(), // Add timestamp early for consistency
      };

      try {
        // Optimistically update the UI
        setMessages((prev) => [...prev, msgData]);
        setNewMessage("");

        // Send to backend
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/messages`,
          msgData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Emit for other user to receive in real-time
        socket.emit("newMessage", res.data);

        // Start conversation if needed
        socket.emit("startConversation", {
          sender: currentUser,
          recipient: selectedUser,
        });

        if (!conversationUsers.includes(selectedUser)) {
          setConversationUsers((prev) => [...prev, selectedUser]);
        }
      } catch (err) {
        console.log("Error sending message:", err);
      }
    }
  };
  useEffect(() => {
    socket.on("startConversation", ({ sender, recipient }) => {
      if (recipient === currentUser && !conversationUsers.includes(sender)) {
        setConversationUsers((prev) => {
          if (!prev.includes(sender)) {
            return [...prev, sender];
          }
          return prev;
        });
      }
    });

    return () => socket.off("startConversation");
  }, [currentUser, conversationUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUserAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${username}&background=random`;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchUser(value);
    const suggestions = users.filter((user) =>
      user.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(suggestions);
  };

  const startNewChat = () => {
    const user = searchUser.trim();

    // 🔒 Check if user exists
    if (!users.includes(user)) {
      alert("User does not exist");
      return;
    }

    // ✅ Prevent chatting with self
    if (user === currentUser) {
      alert("You cannot chat with yourself");
      return;
    }

    // ✅ If valid and new, add to chat list
    if (!conversationUsers.includes(user)) {
      setConversationUsers((prev) => [...prev, user]);
    }

    setSelectedUser(user);
    setShowModal(false);
    setSearchUser("");
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/all-users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data.filter((u) => u !== currentUser));
      } catch (err) {
        console.log("Error fetching all users:", err);
      }
    };

    if (currentUser) fetchAllUsers();
  }, [currentUser]);

  ReactModal.setAppElement("#root");

  return (
    <>
      <Helmet>
        <title>Messages – Chat with Innovators | InnoLinkk</title>
        <meta
          name="description"
          content="Connect and collaborate with other innovators through real-time messaging on InnoLinkk. Start conversations and share startup ideas instantly."
        />
        <meta
          name="keywords"
          content="startup chat, InnoLinkk messaging, real-time chat, entrepreneur communication, startup collaboration"
        />
        <link rel="canonical" href="https://innolinkk.netlify.app/messages" />
      </Helmet>
      <div className="chat-container">
        <div className="user-list">
          <div className="user-header">
            <h3>Chats</h3>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              +
            </button>
          </div>
          {showModal && (
            <div className="inline-modal" ref={modalRef}>
              <input
                type="text"
                placeholder="Enter username..."
                value={searchUser}
                onChange={handleSearchChange}
                className="modal-input"
              />
              {filteredSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {filteredSuggestions.map((user, i) => (
                    <li key={i} onClick={() => setSearchUser(user)}>
                      {user}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={startNewChat} className="modal-start-btn">
                Start Chat
              </button>
            </div>
          )}

          {conversationUsers.map((user) => (
            <div
              key={user}
              className={`user-item ${selectedUser === user ? "active" : ""}`}
              onClick={() => setSelectedUser(user)}
            >
              <img src={getUserAvatar(user)} alt={user} className="user-dp" />
              <div className="user-name">{user}</div>
            </div>
          ))}
        </div>

        <div className="chat-window">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <h4>{selectedUser}</h4>
              </div>
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message-row ${
                      msg.sender === currentUser ? "sent-row" : "received-row"
                    }`}
                  >
                    {msg.sender !== currentUser && (
                      <img
                        src={getUserAvatar(msg.sender)}
                        alt={msg.sender}
                        className="chat-avatar"
                      />
                    )}

                    <div
                      className={`chat-message ${
                        msg.sender === currentUser ? "sent" : "received"
                      }`}
                    >
                      <div className="msg-text">{msg.message}</div>
                      <div className="msg-time">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    {msg.sender === currentUser && (
                      <img
                        src={getUserAvatar(msg.sender)}
                        alt={msg.sender}
                        className="chat-avatar"
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input">
                <textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-white p-1 rounded hover:bg-gray-800"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        setNewMessage((prev) => prev + emojiData.emoji)
                      }
                      theme="dark" // matches your UI
                    />
                  </div>
                )}
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="chat-placeholder">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Messages;
