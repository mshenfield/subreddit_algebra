import React from 'react';

import './SubredditResult.css';

const SubredditResult = (props) => (
  <li className="SubredditResult">
    <a className="SubredditResult__link" target="_blank" href={`https://reddit.com/r/${props.name}`}>
      <span className="SubredditResult__rSlash">
        r/
      </span>
      <span className="SubredditResult__name">
        {props.name} <span className="SubredditResult__outarrow">➡</span>
      </span>
    </a>
  </li>
)

export default SubredditResult
