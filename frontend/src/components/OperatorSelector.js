import React from 'react';

import './OperatorSelector.css';

const OperatorRadioOption = props => {
  const id = `OperatorSelector__radio-${props.value}`
  const checked = props.selectorValue === props.value
  const title = checked ? `${props.title} (selected)` : props.title

  return (
    <span className="OperatorRadioOption">
      <input
        checked={checked}
        className="OperatorSelector__radio"
        id={id}
        name="operator"
        onChange={props.onChange}
        type="radio"
        value={props.value}
      />
      <label
        className="OperatorSelector__radiolabel"
        htmlFor={id}
        title={title}
      >
        {props.value}
      </label>
    </span>
  )
}

const OperatorSelector = (props) => {
  const { value, ...radioProps } = props;
  return (
    <span className="OperatorSelector">
      <span className="OperatorSelector__options">
        <OperatorRadioOption value="-" title="Subtract" selectorValue={value} {...radioProps} />
        <OperatorRadioOption value="+" title="Add" selectorValue={value} {...radioProps} />
      </span>
    </span>
  )
}

export default OperatorSelector
