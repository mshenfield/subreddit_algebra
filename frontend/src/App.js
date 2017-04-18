import React, { Component } from 'react';
import ErrorNotification from './components/ErrorNotification';
import Footer from './components/Footer';
import Header from './components/Header';
import OperatorSelector from './components/OperatorSelector';
import SubredditInput from './components/SubredditInput';
import SubredditResultList from './components/SubredditResultList';
import GithubCorner from './components/GithubCorner';
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
      this.setState({'errorNotification': 'We\'re having trouble connecting, please try again in a bit.'})
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

  swapSubreddits = () => {
    const subredditLeft = this.state.subredditRight
    const subredditRight = this.state.subredditLeft
    this.setState({ subredditLeft })
    this.setState({ subredditRight })
  }

  render() {
    return (
      <div>
        <GithubCorner
          fillColor="#fff"
          octocatColor="#ff4500"
          url="https://github.com/mshenfield/subreddit_algebra"
          targetBlank
        />
        <Header className="Sized"/>
        <div className="App Sized">
          <SubredditInput
            inputProps={{
              id: 'subreddit-input-left',
              placeholder: 'choose a subreddit'
            }}
            onChange={this.handleSubredditLeftChange}
            setNetworkAvailability={this.setNetworkAvailability}
            value={this.state.subredditLeft}
          />
          <div className="Operators">
            <OperatorSelector
              value={this.state.operator}
              onChange={this.handleOperatorChange}
            />
            <button
              className="SubredditAlgebraForm__swapbutton"
              onClick={this.swapSubreddits}
              title="Swap subreddits"
            >

              ⇵
            </button>
          </div>
          <SubredditInput
            inputProps={{
              id: 'subreddit-input-right',
              placeholder: 'add or subtract a subreddit'
            }}
            onChange={this.handleSubredditRightChange}
            setNetworkAvailability={this.setNetworkAvailability}
            value={this.state.subredditRight}
          />
          <button
            className="SubredditAlgebraForm__submit"
            onClick={this.getAlgebraResult}
            title="Get the result"
          >
            =
          </button>
          <SubredditResultList subreddits={this.state.matches} />
          <Footer className="Sized"/>
          <ErrorNotification message={this.state.errorNotification} />
        </div>
      </div>
    );
  }
}

export default App;
