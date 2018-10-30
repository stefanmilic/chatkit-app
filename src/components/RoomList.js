import React from "react";

class RoomList extends React.Component {
  render() {
    const style = {
      border: "none",
      backgroundColor: "transparent"
    };
    const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id);
    const { users } = this.props;
    return (
      <div className="rooms-list">
        <ul>
          <h3>Pick room:</h3>
          {orderedRooms.map(room => {
            const active = room.id === this.props.roomId ? "active" : "";
            return (
              <li key={room.id} className={"room " + active}>
                <button
                  style={style}
                  onClick={() => this.props.subscribeToRoom(room.id)}
                >
                  # {room.name}
                </button>
              </li>
            );
          })}
        </ul>
        <div>
          <h5>You are registered as:</h5>

          <ul className="colection">
            {users.map(user => {
              return (
                <li key={user.id} className="colection-item">
                  {user.id}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default RoomList;
