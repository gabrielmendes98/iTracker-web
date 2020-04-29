import React from 'react';

class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.format(props.value) };
  }

  onChange = (e) => {
    if (e.target.value.match(/^\d*$/)) this.setState({ value: e.target.value });
  };

  onBlur = (e) => {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, this.unformat(value));
  };

  format = (num) => (num !== null && num !== undefined ? num.toString() : '');

  unformat = (str) => {
    const val = parseInt(str, 10);
    return Number.isNaN(val) ? null : val;
  };

  render() {
    const { value } = this.state;
    return <input type="text" {...this.props} value={value} onBlur={this.onBlur} onChange={this.onChange} />;
  }
}

export default NumInput;
