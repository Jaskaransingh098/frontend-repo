import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ReactModal from "react-modal";
import "./Messages.css";

const socket = io("https://backend-repo-f2m0.onrender.com"); // adjust if using a different port

function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState("User1"); // Set logged-in user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data.filter((user) => user !== currentUser));
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const res = await axios.get(
            `/api/messages/${currentUser}/${selectedUser}`
          );
          setMessages(res.data);
        } catch (err) {
          console.log("Error fetching messages:", err);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (selectedUser) {
      const channel = `message:${currentUser}:${selectedUser}`;

      socket.on(channel, (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => socket.off(channel);
    }
  }, [selectedUser, currentUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      const msgData = {
        sender: currentUser,
        recipient: selectedUser,
        message: newMessage,
      };

      try {
        const res = await axios.post("/api/messages", msgData);
        // setMessages((prev) => [...prev, res.data]);
        socket.emit("newMessage", res.data); // Emit real-time
        setNewMessage("");
      } catch (err) {
        console.log("Error sending message:", err);
      }
    }
  };

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
