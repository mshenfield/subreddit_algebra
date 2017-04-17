import React from 'react';
import SubredditResult from './SubredditResult';

import './SubredditResultList.css';

const SubredditResultList = (props) => {
  let subreddits = props.subreddits.map((subreddit) =>
    <SubredditResult key={subreddit} name={subreddit}/>
  )

  return (
    <div className="SubredditResultList">
      <ul className="SubredditResultList__list">
        {subreddits}
      </ul>
    </div>
  )
}

export default SubredditResultList
