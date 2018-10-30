import React from "react";

function Message({ user, username, text }) {
  if (user === username) {
    return (
      <div className="messageRight">
        <div className="messageRight-username">{username}</div>
        <div className="messageRight-text">{text}</div>
      </div>
    );
  } else {
    return (
      <div className="message">
        <div className="message-username">{username}</div>
        <div className="message-text">{text}</div>
      </div>
    );
  }
}
export default Message;
