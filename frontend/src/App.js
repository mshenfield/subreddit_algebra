import React, { Component } from 'react';
import ErrorNotification from './components/ErrorNotification';
import OperatorSelector from './components/OperatorSelector';
import SubredditInput from './components/SubredditInput';
import SubredditResultList from './components/SubredditResultList';
import {apiUrl} from './utils';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorNotification: '',
      subredditLeft: '',
      operator: '-',  // Default to -
      subredditRight: '',
      matches: []
    }
  }

  setNetworkAvailability = (isAvailable) => {
    if (isAvailable) {
      this.setState({'errorNotification': ''});
    } else {
      this.setState({'errorNotification': 'Subreddit Algebra was unable to complete a request'})
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
        this.setNetworkAvailability(true)
        response.json().then((matches) => {
          this.setState({...this.state, matches: matches })
        })
      })
      .catch((err) => this.setNetworkAvailability(false))
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
          setNetworkAvailability={this.setNetworkAvailability}
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
          setNetworkAvailability={this.setNetworkAvailability}
          value={this.state.subredditRight}
        />
        <div>
          <button className="SubredditAlgebraForm__submit" onClick={this.getAlgebraResult}>
            =
          </button>
        </div>
        <SubredditResultList subreddits={this.state.matches} />
        <ErrorNotification message={this.state.errorNotification} />
      </div>
    );
  }
}

export default App;
