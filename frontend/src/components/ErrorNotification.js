import React from 'react';

import './ErrorNotification.css';

export default (props) => {
  if (!props.message) {
    return null
  }

  return(
    <div className="ErrorNotification">
      <span className="ErrorNotification__icon">❕ </span>
      <span className="ErrorNotification__message">{props.message}</span>
    </div>
  )
}
