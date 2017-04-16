import React from 'react';
import classNames from 'classnames';

import './Footer.css';

export default (props) => {
  const className = classNames(props.className)
  return (
    <div className="Footer">
      <div className={className}>
        Based on work by <a className="Footer__fivethirtyeight" target="_blank" href="https://fivethirtyeight.com/features/dissecting-trumps-most-rabid-online-following/">FiveThirtyEight</a>
        <span className="Footer__separator"> | </span>
        Created by <a href="https://twitter.com/MaxShenfield" className="Footer__twitterlink">@MaxShenfield</a>
        <span className="Footer__separator"> | </span>
        <a target="_blank" href="https://github.com/mshenfield/subreddit_algebra/blob/master/LICENSE.md/">MIT</a> Licensed
        <span className="Footer__separator"> | </span>
        <span className="Footer__lastupdated">Data Updated 2017-03-23</span>
      </div>
    </div>
  )
}
