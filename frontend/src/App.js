import React, { Component } from 'react';
import OperatorSelector from './components/OperatorSelector';
import SubredditInput from './components/SubredditInput';
import SubredditResultList from './components/SubredditResultList';
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
    return (
      <div className="App">
        <SubredditInput
          inputProps={{
            id: 'subreddit-input-left',
            placeholder: 'a subreddit'
          }}
          onChange={this.handleSubredditLeftChange}
          value={this.state.subredditLeft}
        />
        <OperatorSelector
          value={this.state.operator}
          onChange={this.handleOperatorChange}
        />
        <SubredditInput
          inputProps={{
            id: 'subreddit-input-right',
            placeholder: 'another subreddit'
          }}
          onChange={this.handleSubredditRightChange}
          value={this.state.subredditRight}
        />
        <div>
          <button className="SubredditAlgebraForm__submit" onClick={this.getAlgebraResult}>
            =
          </button>
        </div>
        <SubredditResultList subreddits={this.state.matches} />
      </div>
    );
  }
}

export default App;
