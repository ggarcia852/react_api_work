import React from "react";
import axios from "axios";
import "./styles.css";

const User = (props) => (
  <div>
    <div>{props.name}</div>
    <div className="winner">
      {props.users > 1 && props.winner.name === props.name ? "Winner!" : ""}
    </div>
    <img src={props.img} alt="avatar "></img>
    <div>Public Repos: {props.repos}</div>
    <div>Public Gists: {props.gists}</div>
    <div>Followers: {props.followers}</div>
    <div>Score: {props.score}</div>
  </div>
);

class App extends React.Component {
  state = {
    searchTerm: "",
    users: [],
    isLoading: false,
    hasError: false,
    userMessage: ""
  };

  getUser = async (user) => {
    const hasUser = this.state.users.find((element) => element.login === user);
    if (hasUser) {
      this.setState({
        isLoading: false,
        hasError: false,
        userMessage: "User Already Added."
      });
    } else {
      try {
        this.setState({ isLoading: true });
        const response = await axios(`https://api.github.com/users/${user}`);
        const data = response.data;
        const points = data.public_repos + data.public_gists + data.followers;
        data.score = points;

        const newUsers = [...this.state.users, data];
        this.setState({
          users: newUsers,
          isLoading: false,
          hasError: false,
          userMessage: ""
        });
      } catch (err) {
        this.setState({ hasError: true, isLoading: false, userMessage: "" });
      }
    }
  };

  getWinner = () => {
    const winner = this.state.users.reduce((previousVal, currentVal) => {
      if (!previousVal || currentVal.score > previousVal.score) {
        return currentVal;
      }
      return previousVal;
    }, null);
    return winner;
  };

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.getUser(this.state.searchTerm);
    this.setState({ searchTerm: "" });
  };

  render() {
    const hasUser = !this.state.isLoading && this.state.users;
    const winner = this.getWinner();
    return (
      <div className="App">
        <h1>Github Profile Battle</h1>
        <form onSubmit={this.handleSubmit}>
          <div>Enter Users:</div>
          <input
            className="input"
            onChange={this.handleChange}
            value={this.state.searchTerm}
          />
        </form>
        {this.state.hasError && <div className="error">User Not Found</div>}
        {this.state.isLoading && <div>loading...</div>}
        {this.state.userMessage && (
          <div className="error">{this.state.userMessage}</div>
        )}
        {hasUser && (
          <div className="user">
            {this.state.users.map((user) => (
              <User
                img={user.avatar_url}
                name={user.name}
                key={user.id}
                repos={user.public_repos}
                gists={user.public_gists}
                followers={user.followers}
                score={user.public_repos + user.public_gists + user.followers}
                winner={winner}
                users={this.state.users.length}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;
