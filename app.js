import React from "react";
import axios from "axios";
import "./styles.css";

const User = (props) => (
  <div>
    <div>{props.name}</div>
    <div></div>
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
    hasError: false
  };

  getUser = async (user) => {
    try {
      this.setState({ isLoading: true });
      const response = await axios(`https://api.github.com/users/${user}`);
      const data = response.data;
      const points =
        response.data.public_repos +
        response.data.public_gists +
        response.data.followers;
      data.score = points;

      const isFound = this.state.users.some((user) => user.id === data.id)
      if (isFound) {
        this.setState({ isLoading: false, hasError: false });
      } else {
        const newUsers = [...this.state.users, data];
        this.setState({ users: newUsers, isLoading: false, hasError: false });
        console.log(this.state.users);
      }
      this.getWinner();
    } catch (err) {
      this.setState({ hasError: true, isLoading: false });
      console.error(err);
    }
  };

  getWinner = () => {
    const scores = this.state.users
      .map((user) => user.score)
      .reduce((acc, val) => {
        return acc > val ? acc : val;
      });
    console.log(scores);
    // if(this.state.users.map((user) => user.score)
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
    return (
      <div className="App">
        <h1>Github Profile Battle</h1>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.searchTerm} />
        </form>
        {this.state.hasError && <div>User Not Found</div>}
        {this.state.isLoading && <div>loading</div>}
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
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;
