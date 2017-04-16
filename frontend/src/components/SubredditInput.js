/*
  An input that autocompletes to a subreddit name included in our index.
*/
import React, {Component} from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';
import {apiUrl, choice} from '../utils';

import './SubredditInput.css';

const shouldDoCompletions = (value) => value.trim().length > 1;

/*
  Async request for completions of a subreddit name.

  Returns a Promise that resolves to an array of matches
*/
const completions = (value) => {
  let trimmed = value.trim()
  // Don't show completions when there are less than 2 characters
  if (!shouldDoCompletions(trimmed)) {
    return Promise.resolve([])
  }

  return fetch(`${apiUrl()}/completions/${trimmed}`)
    .then((response) => response.json())
}

// Because of the way react-autocomplete adds mouseBlur handlers,
// we can't factor this into it's own component
const renderItem = (item, isHighlighted) => {
  let className = classNames(
    'SubredditCompletion',
    {
      'SubredditCompletion--highlighted': isHighlighted
    },
  )

  return (
    <div
      className={className}
      key={item}
      id={item}
    >
      {item}
    </div>
  )
}

/*
Override renderMenu to hide the menu if there are no items

Uses the "function" keyword so "this.menuStyle" takes "this" from
the context it is called from
*/
function renderMenu(items, value, style) {
  if (!items.length) {
    // Default is '2px 0px'
    this.menuStyle['padding'] = '0px 0px'
  }
  return <div style={{...style, ...this.menuStyle}} children={items}/>
}

const getSubredditInvalidError = (value) => {
    const fieldErrors = [
      `You have chosen poorly.`,
      `Hmmmm...r/${value} isn't in our records.`,
      `Never heard of r/${value}, sorry.`,
      `r/${value} is invalid. Make sure to select a suggestion from the dropdown.`
    ]

    // Some custom one's if people accidentally look for weird stuff
    let fieldError;
    if (value.toLowerCase().endsWith('gw') || value.toLowerCase().startsWith('nsfw')) {
      fieldError = `Unfortunately r/${value} just doesn't exist.`
    } else if (value.toLowerCase().endsWith('_irl')) {
      fieldError = `irl there is no r/${value}.`
    } else if (value.toLowerCase().startsWith('shitty')) {
      fieldError = `There's no shitty version of r/${value.replace('shitty', '')}.`
    } else {
      fieldError = choice(fieldErrors)
    }

    return fieldError
}

/*
  An auto-completing input for subreddit names

  props:
    value: the value of the controlled input
    onChange: accepts a change event and the new value. Should be used to
      update the "value" prop
    ...otherProps: passed on to the Autocomplete component
*/
class SubredditInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completions: [],
      fieldError: '',
    }
  }

  onBlur = (event) => {
    // XXX: Add PR to be able to listen for this
    // https://github.com/reactjs/react-autocomplete/blob/8ce87d30683c66f11546f75d8085c4542e3f5f30/lib/Autocomplete.js#L358
    // Without this, onBlur fires when we click a menu item, falsely issuing a field error
    if (this.auto._ignoreBlur) {
      return;
    }

    if (!shouldDoCompletions(this.props.value)) {
      return
    }

    if (this.state.completions.includes(this.props.value)) {
      return
    }

    const fieldError = getSubredditInvalidError(this.props.value)
    this.setState({fieldError})
  }

  // Call the passed in onChange and initiate a request for new completions
  onChange = (event, value) => {
    this.props.onChange(event, value)

    completions(value).then((completions) => {
      if (completions.length) {
        this.props.setNetworkAvailability(true)
      }

      this.setState({ completions })
    }).catch((err) => {
      this.setState({ completions: [] })
      this.props.setNetworkAvailability(false)
    })
  }

  // Reset fieldError on focus
  onFocus = (event) => {
    this.setState({fieldError: ''})
  }

  setAutcompleteRef = (auto) => {
    this.auto = auto
  }

  render () {
    const { onChange, ...autocompleteProps } = this.props

    // If there is an id or name attribute on inputProps, use for our label
    const { id, name } = autocompleteProps.inputProps

    // Append SubredditInput__input to input className
    autocompleteProps.inputProps['className'] = classNames(
      autocompleteProps.inputProps['className'],
      'SubredditInput__input'
    )

    // Override onBlur, onFocus to set and clear error messages
    autocompleteProps.inputProps['onBlur'] = this.onBlur;
    autocompleteProps.inputProps['onFocus'] = this.onFocus;

    return (
      <div className="SubredditInput">
        <label
          htmlFor={id || name}
          className="SubredditInput__label"
        >
          r/
        </label>
        <Autocomplete
          getItemValue={(item) => item}
          items={this.state.completions}
          onChange={this.onChange}
          // Just hoist change event - don't request new completions
          onSelect={onChange}
          ref={this.setAutcompleteRef}
          renderItem={renderItem}
          renderMenu={renderMenu}
          {...autocompleteProps}
        />
        <div className="SubredditInput__fielderror">
          {this.state.fieldError}
        </div>
      </div>
    )
  }
}

SubredditInput.defaultProps = {
  'inputProps': {}
}

export default SubredditInput
