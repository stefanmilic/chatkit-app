import React, { Component } from "react";
import Chatkit from "@pusher/chatkit-server";
import { instanceLocator } from "../config";
import App from "../App";
const chatkit = new Chatkit({
  instanceLocator: instanceLocator,
  key:
    "7ba71c66-6fca-43ff-8bd5-e0c739c6d079:v7PuqVoq40uuqNLzfc32Vns9Y0m2Jdvujw0RAADbeo8="
});
export default class NewUser extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      username: "",
      users: [],
      singIn: false
    };
  }

  componentDidMount() {
    chatkit
      .getUsers()
      .then(res => {
        if (res.length > 5) {
          chatkit
            .deleteUser({
              userId: res[0].id
            })
            .then(() => {
              console.log("User deleted successfully");
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    chatkit
      .createUser({
        id: this.state.username,
        name: this.state.name
      })
      .then(res => {
        console.log("User created successfully", res);
      })
      .catch(() => console.log("User is already registred"));
    this.setState({
      singIn: !this.state.singIn
    });
  };

  render() {
    const { singIn, username } = this.state;

    if (singIn) {
      return <App user={username} />;
    } else {
      return (
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              type="text"
              placeholder="username"
              value={this.state.username}
              name="username"
              required
            />
            <input
              onChange={this.handleChange}
              type="text"
              placeholder="name"
              value={this.state.name}
              name="name"
            />
            <input
              className=" class=&quot;waves-effect waves-light btn"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      );
    }
  }
}
