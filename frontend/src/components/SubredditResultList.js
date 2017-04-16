import React from 'react';
import SubredditResult from './SubredditResult';

import './SubredditResultList.css';

const SubredditResultList = (props) => {
  if (!props.subreddits.length) {
    return null
  }

  let subreddits = props.subreddits.map((subreddit) =>
    <SubredditResult key={subreddit} name={subreddit}/>
  )

  return (
    <ul className="SubredditResultList">
      {subreddits}
    </ul>
  )
}

export default SubredditResultList
