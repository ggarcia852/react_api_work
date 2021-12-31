import React from "react";
import axios from "axios";
import "./styles.css";

const User = ({ img, name }) => (
  <>
    <div>{name}</div>
    <img src={img} alt="avatar "></img>
  </>
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
      const newUsers = [...this.state.users, response.data];
      this.setState({ users: newUsers, isLoading: false, hasError: false });
    } catch (err) {
      this.setState({ hasError: true, isLoading: false });
      console.error(err);
    }
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
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.searchTerm} />
        </form>
        {this.state.hasError && <div>User Not Found</div>}
        {this.state.isLoading && <div>loading</div>}
        {hasUser && (
          <div>
            {this.state.users.map((user) => (
              <User img={user.avatar_url} name={user.name} key={user.id} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default App;
