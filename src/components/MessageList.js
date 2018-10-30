import React, { Component } from "react";
import Message from "./Message";
import ReactDOM from "react-dom";

export default class MessageList extends Component {
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom =
      node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }
  render() {
    const { typingUserName } = this.props;
    if (!this.props.roomId) {
      return (
        <div className="message-list">
          <div className="join-room">&larr; Join a room!</div>
        </div>
      );
    }
    return (
      <div className="message-list">
        {this.props.messages.map((message, i) => {
          return (
            <Message
              className="message"
              key={i}
              user={this.props.user}
              username={message.senderId}
              text={message.text}
            />
          );
        })}
        <em className="typing">
          {typingUserName ? `${typingUserName} is typing...` : null}
        </em>
      </div>
    );
  }
}
