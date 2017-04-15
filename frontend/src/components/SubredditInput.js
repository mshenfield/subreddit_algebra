/*
  An input that autocompletes to a subreddit name included in our index.
*/
import React, {Component} from 'react';
import Autocomplete from 'react-autocomplete';
import {apiUrl} from '../utils';

/*
  Async request for completions of a subreddit name.

  Returns a Promise that resolves to an array of matches
*/
function completions(value) {
  return fetch(`${apiUrl()}/completions/${value}`)
    .then((response) => response.json())
    .catch((err) => {
      console.error(err)
      return []
    });
}

/*
  A compbox input that autocompletes subreddit names
*/
class SubredditInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      completions: [],
      loading: false
    }
  }

  setValue(value) {
    // Set state
    this.setState({ value, loading: true })
    // Callback props.onChange
    this.props.onChange(event, value)
  }

  onChange(event, value) {
    this.setValue(value)

    // Request completions and set state with result
    completions(value).then((completions) => {
      this.setState({ completions, loading: false })
    })
  }

  render () {
    let inputId = this.props.inputProps.id || name || ''

    return (
      <div className="SubredditInput">
        <label
          htmlFor={inputId}
          className="subreddit-label"
        >
          r/
        </label>
        <Autocomplete
          inputProps={this.props.inputProps}
          getItemValue={(item) => item}
          items={this.state.completions}
          onChange={this.onChange.bind(this)}
          onSelect={this.setValue.bind(this)}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? {backgroundColor: '#fea5dc'} : {}}
              key={item}
              id={item}
            >
              {item}
            </div>
          )}
          value={this.state.value}
        />
      </div>
    )
  }
}

SubredditInput.defaultProps = {
  'inputProps': {}
}

export default SubredditInput
