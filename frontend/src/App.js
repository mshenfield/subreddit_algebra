import React, { Component } from 'react';
import SubredditResult from './SubredditResult';
import SubredditInput from './SubredditInput';
import {apiUrl} from './utils';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subredditLeft: '',
      operator: '',
      subredditRight: '',
      matches: []
    }
  }

  handleSubredditLeftChange(event, value) {
    this.setState({subredditLeft: value})
  }

  handleOperatorChange(event) {
    this.setState({operator: event.target.value})
  }

  handleSubredditRightChange(event, value) {
    this.setState({subredditRight: value})
  }

  getAlgebraResult() {
    let query = `${this.state.subredditLeft}/${this.state.operator}/${this.state.subredditRight}`

    fetch(`${apiUrl()}/algebra/${query}`)
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
        <li className="subreddit" key={match}>
          <SubredditResult name={match}/>
        </li>
      )
    } else {
      matches = null
    }

    return (
      <div className="App">
        <span className="subreddit">r/</span>
        <SubredditInput onChange={this.handleSubredditLeftChange.bind(this)}/>

        <input className="operator" type="text" placeholder="+/-" value={this.state.operator}
          onChange={this.handleOperatorChange.bind(this)}/>

        <span className="subreddit">r/</span>
        <SubredditInput onChange={this.handleSubredditRightChange.bind(this)}/>

        <button onClick={this.getAlgebraResult.bind(this)}>Send</button>
        <ul className="matches">
          {matches}
        </ul>
      </div>
    );
  }
}

export default App;
