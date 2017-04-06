import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subreddit_left: '',
      operator: '',
      subreddit_right: '',
      matches: []
    }
  }

  handleSubredditLeftChange(event) {
    this.setState({...this.state, subreddit_left: event.target.value})
  }

  handleOperatorChange(event) {
    this.setState({...this.state, operator: event.target.value})
  }

  handleSubredditRightChange(event) {
    this.setState({...this.state, subreddit_right: event.target.value})
  }

  getAlgebraResult() {
    let query = `${this.state.subreddit_left}/${this.state.operator}/${this.state.subreddit_right}`
    fetch(`http://localhost:5000/api/algebra/${query}`)
      .then((response) => {
        response.json().then((matches) => {
          this.setState({...this.state, matches: matches })
        })
      })
      .catch((err) => { console.error(err)})
  }

  render() {
    let matches;
    if (this.state.matches) {
      matches = this.state.matches.map((match) =>
        <li className="subreddit" key={match}>{match}</li>
      )
    } else {
      matches = null
    }

    return (
      <div className="App">
        <span className="subreddit">r/</span>
        <input type="text" value={this.state.subreddit_left}
          onChange={this.handleSubredditLeftChange.bind(this)}/>

        <input type="text" placeholder="+/-" value={this.state.operator}
          onChange={this.handleOperatorChange.bind(this)}/>

        <span className="subreddit">r/</span>
        <input type="text" value={this.state.subreddit_right}
          onChange={this.handleSubredditRightChange.bind(this)}/>
        <button onClick={this.getAlgebraResult.bind(this)}>Send</button>
        <ul className="matches">
          {matches}
        </ul>
      </div>
    );
  }
}

export default App;
