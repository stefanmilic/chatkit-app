import React from "react";

class SendMessageForm extends React.Component {
  constructor() {
    super();
    this.state = {
      message: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: ""
    });
  }
  handleKeyDown = () => {
    this.props.typing();
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input
          disabled={this.props.disabled}
          onChange={this.handleChange}
          value={this.state.message}
          placeholder="Write..."
          type="text"
          onKeyDown={this.handleKeyDown}
          required
        />
        {/* <input className="btn" type="submit" value="Send" /> */}
        <button type="submit" className="btn" disabled={this.props.disabled}>
          <i className="fa fa-paper-plane" />
          &nbsp;Send
        </button>
      </form>
    );
  }
}

export default SendMessageForm;
