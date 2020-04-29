import React from 'react';

class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.editFormat(props.value),
      focused: false,
      valid: true,
    };
  }

  onFocus = () => {
    this.setState({ focused: true });
  };

  onBlur = (e) => {
    const { value, valid: oldValid } = this.state;
    const { onValidityChange, onChange } = this.props;
    const dateValue = this.unformat(value);
    const valid = value === '' || (dateValue !== null && dateValue !== undefined);
    if (valid !== oldValid && onValidityChange) {
      onValidityChange(e, valid);
    }
    this.setState({ focused: false, valid });
    if (valid) onChange(e, dateValue);
  };

  onChange = (e) => {
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({ value: e.target.value });
    }
  };

  displayFormat = (date) => {
    return date !== null && date !== undefined ? date.toString() : '';
  };

  editFormat = (date) => {
    return date !== null && date !== undefined ? date.toISOString().substr(0, 10) : '';
  };

  unformat = (str) => {
    const val = new Date(str.replace(/-/g, '/').replace(/T.+/, ''));
    return Number.isNaN(val.getTime()) ? null : val;
  };

  render() {
    const { valid, focused, value } = this.state;
    const { value: origValue, name } = this.props;
    const className = !valid && !focused ? 'invalid' : 'valid';
    const displayValue = focused || !valid ? value : this.displayFormat(origValue);
    return (
      <input
        type="text"
        size={20}
        name={name}
        className={className}
        value={displayValue}
        placeholder={focused ? 'yyyy-mm-dd' : null}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

export default DateInput;
