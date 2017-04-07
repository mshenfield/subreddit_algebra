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
    this.setState({subreddit_left: event.target.value})
  }

  handleOperatorChange(event) {
    this.setState({operator: event.target.value})
  }

  handleSubredditRightChange(event) {
    this.setState({subreddit_right: event.target.value})
  }

  getAlgebraResult() {
    let query = `${this.state.subreddit_left}/${this.state.operator}/${this.state.subreddit_right}`
    // Route to Flask development server if we're on the default create-react-app port
    let isDev = window.location.port === "3000"
    let port = isDev ? ':5000' : ''
    // The Flask app is mounted at /api in production
    let mount = isDev ? '' : '/api'

    fetch(`http://${window.location.hostname}${port}${mount}/algebra/${query}`)
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
        <li className="subreddit" key={match}><a target="_blank" href={`https://reddit.com/r/${match}`}>
          r/{match}</a>
        </li>
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
