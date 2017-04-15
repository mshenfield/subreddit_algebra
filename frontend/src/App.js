import React, { Component } from 'react';
import SubredditInput from './components/SubredditInput';
import SubredditResult from './components/SubredditResult';
import {apiUrl} from './utils';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subredditLeft: '',
      operator: '-',  // Default to -
      subredditRight: '',
      matches: []
    }
  }

  handleSubredditLeftChange = (event, value) => {
    this.setState({subredditLeft: value})
  }

  handleOperatorChange = (event) => {
    this.setState({operator: event.target.value})
  }

  handleSubredditRightChange = (event, value) => {
    this.setState({subredditRight: value})
  }

  getAlgebraResult = () => {
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
        <SubredditInput
          inputProps={{className: 'subreddit-input', id: 'subreddit-input-left'}}
          onChange={this.handleSubredditLeftChange}
        />
        <select
          id="operator"
          value={this.state.operator}
          onChange={this.handleOperatorChange}
        >
          <option value="-">-</option>
          <option value="+">+</option>
        </select>
        <SubredditInput
          inputProps={{className: 'subreddit-input', id: 'subreddit-input-right'}}
          onChange={this.handleSubredditRightChange}
        />
        <a
          tabIndex="0"
          className="button"
          onClick={this.getAlgebraResult}
          // XXX: Only submit on "Enter"
          onKeyPress={this.getAlgebraResult}
        >
          =
        </a>
        <ul className="matches">
          {matches}
        </ul>
      </div>
    );
  }
}

export default App;
