import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ReactModal from "react-modal";
import jwtDeocode from "jwt-decode";
import "./Messages.css";

const socket = io(import.meta.env.VITE_API_URL); // adjust if using a different port

function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState("null"); // Set logged-in user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.username);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // ✅ Fetch user list (excluding currentUser) with token
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter((user) => user !== currentUser));
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };

    if (currentUser) fetchUsers();
  }, [currentUser]);

  // ✅ Fetch messages securely between users
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (selectedUser && currentUser) {
        try {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/messages/${currentUser}/${selectedUser}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMessages(res.data);
        } catch (err) {
          console.log("Error fetching messages:", err);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  // ✅ Socket listener for real-time messages
  useEffect(() => {
    if (selectedUser && currentUser) {
      const channel = `message:${currentUser}:${selectedUser}`;
      socket.on(channel, (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => socket.off(channel);
    }
  }, [selectedUser, currentUser]);

  // ✅ Send message with JWT in headers
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser && currentUser) {
      const token = localStorage.getItem("token");
      const msgData = {
        sender: currentUser,
        recipient: selectedUser,
        message: newMessage,
      };

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/messages`,
          msgData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        socket.emit("newMessage", res.data); // Emit real-time message
        setNewMessage("");
      } catch (err) {
        console.log("Error sending message:", err);
      }
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate avatar
  const getUserAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${username}&background=random`;
  };

  // Handle search box input
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
    if (user && user !== currentUser && !users.includes(user)) {
      setUsers((prev) => [...prev, user]);
    }
    setSelectedUser(user);
    setShowModal(false);
    setSearchUser("");
  };

  ReactModal.setAppElement("#root");
  
  return (
    <div className="chat-container">
      <div className="user-list">
        <div className="user-header">
          <h3>Chats</h3>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            +
          </button>
        </div>

        <ReactModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="chat-modal"
          overlayClassName="modal-overlay"
        >
          <h3>Start New Chat</h3>
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
        </ReactModal>

        {users.map((user) => (
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
                  className={`chat-message ${
                    msg.sender === currentUser ? "sent" : "received"
                  }`}
                >
                  <div className="msg-text">{msg.message}</div>
                  <div className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
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
  );
}

export default Messages;
