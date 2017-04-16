import React from 'react';
import classNames from 'classnames';

import './Header.css';

export default (props) => {
    let className = classNames(props.className)

    return (
      <div className="Header">
        {/*
          The header should fill up the entire screen, but allow an inner
          div that conforms to the App width.
        */}
        <div className={className}>
          <h1>Subreddit Algebra</h1>
          <h2>What's your favorite subreddit made of?</h2>
        </div>
      </div>
    )
}
