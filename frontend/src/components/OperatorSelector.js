import React from 'react';

import './OperatorSelector.css';

const OperatorRadioOption = props => {
  const id = `OperatorSelector__radio-${props.value}`

  return (
    <span className="OperatorRadioOption">
      <input
        checked={props.selectorValue === props.value}
        className="OperatorSelector__radio"
        name="operator"
        onChange={props.onChange}
        type="radio"
        value={props.value}
        id={id}
      />
      <label htmlFor={id} className="OperatorSelector__radiolabel">
        {props.value}
      </label>
    </span>
  )
}

const OperatorSelector = (props) => {
  const { value, ...radioProps } = props;
  return (
    <span className="OperatorSelector">
      <span className="OperatorSelector__value">{value}</span>
      <span className="OperatorSelector__options">
        <OperatorRadioOption value="-" selectorValue={value} {...radioProps} />
        <OperatorRadioOption value="+" selectorValue={value} {...radioProps} />
      </span>
    </span>
  )
}

export default OperatorSelector
