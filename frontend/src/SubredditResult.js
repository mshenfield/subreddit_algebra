import React from 'react';

const SubredditResult = (props) => (
  <a className="SubredditResult" target="_blank" href={`https://reddit.com/r/${props.name}`}>
    r/{props.name}
  </a>
)

export default SubredditResult
