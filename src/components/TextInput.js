import React from 'react';

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.format(props.value) };
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  onBlur = (e) => {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, this.unformat(value));
  };

  format = (text) => {
    return text !== null && text !== undefined ? text : '';
  };

  unformat = (text) => {
    return text.trim().length === 0 ? null : text;
  };

  render() {
    const { value } = this.state;
    const { tag = 'input', ...props } = this.props;
    return React.createElement(tag, {
      ...props,
      value,
      onBlur: this.onBlur,
      onChange: this.onChange,
    });
  }
}

export default TextInput;
