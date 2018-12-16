import React from "react"

const UserContext = React.createContext();

class UserProvider extends React.Component {

  state = {
    user: {
      avatar:
      "https://s.gravatar.com/avatar/3edd11d6747465b235c79bafdb85abe8?s=80",
      name: "Daniel",
      followers: 1234,
      following: 123
    }
  };

render() {
    return (
        <UserContext.Provider value={this.state.user}>
          {this.props.children}
        </UserContext.Provider>
    );
  } 
}

export const UserConsumer = UserContext.Consumer

export default UserProvider