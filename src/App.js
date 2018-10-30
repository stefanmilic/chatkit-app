import React, { Component } from "react";
import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import RoomList from "./components/RoomList";
import NewRoomForm from "./components/NewRoomForm";
import { ChatManager, TokenProvider } from "@pusher/chatkit";
import { instanceLocator, tokenUrl } from "./config";

const tokenProvider = new TokenProvider({
  url: tokenUrl
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
      roomId: null,
      user: props.user,
      onlineUsers: [],
      typingroomId: null,
      typingUserName: null
    };
  }

  componentDidMount() {
    const { user, onlineUsers } = this.state;

    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: user,
      tokenProvider: tokenProvider
    });
    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        console.log("user is connected", currentUser.id);
        this.setState({ onlineUsers: [...onlineUsers, currentUser] });
        this.getRoom();
        // this.subscribeToRoom(); //da bi prikazao poruke u odredjenoj grupi
      })
      .catch(error => {
        console.error("error:", error);
      });
  }

  sendMessage = text => {
    this.currentUser.sendMessage({
      text: text,
      roomId: this.state.roomId
    });
  };

  getRoom = () => {
    // this.onlineUsers();
    this.currentUser.getJoinableRooms().then(joinableRooms => {
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      });
    });
  };

  leaveRoom = roomId => {
    this.currentUser.rooms.forEach(item => {
      if (item.id !== roomId) {
        this.currentUser
          .leaveRoom({ roomId: item.id })
          .then(room => {
            console.log(`Left room with ID: ${room.id}`);
          })
          .catch(err => {
            console.log(`Error leaving room ${item.id}: ${err}`);
          });
      }
    });
  };

  Typing = roomId => {
    this.currentUser
      .isTypingIn({ roomId: this.state.typingroomId })
      .catch(err => {
        console.log(`Error sending typing indicator: ${err}`);
      });
  };

  subscribeToRoom = roomId => {
    this.leaveRoom(roomId);
    this.setState({ typingroomId: roomId });

    // izbrisem trenutni i prikazem zatim na koju klikenmo sobu
    // let onlineUsers = this.state.onlineUsers.concat(this.currentUser.users);
    this.setState({
      messages: []
    });

    this.currentUser
      .subscribeToRoom({
        roomId: roomId,
        messageLimit: 20,
        hooks: {
          onNewMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            });
          },
          onUserStartedTyping: user => {
            this.setState({ typingUserName: user.id });
            console.log(`User ${user.id} started typing`);
          },
          onUserStoppedTyping: user => {
            this.setState({ typingUserName: null });
            console.log(`User ${user.id} stopped typing`);
          }
        }
      })
      .then(room => {
        this.setState({ roomId: room.id });
        this.getRoom();
      })
      .catch(err => console.log(err));
  };

  createRoom = name => {
    this.currentUser
      .createRoom({
        name
      })
      .then(room => {
        this.subscribeToRoom(room.id);
      })
      .catch(err => console.log(err));
  };

  render() {
    const { messages, user } = this.state;

    return (
      <div className="app">
        <RoomList
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          subscribeToRoom={this.subscribeToRoom}
          roomId={this.state.roomId}
          users={this.state.onlineUsers}
        />
        <MessageList
          user={user}
          messages={messages}
          roomId={this.state.roomId}
          typingUserName={this.state.typingUserName}
        />
        <SendMessageForm
          sendMessage={this.sendMessage}
          disabled={!this.state.roomId}
          typing={this.Typing}
        />
        <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}

export default App;
