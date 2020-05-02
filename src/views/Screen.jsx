import React from 'react';
import Helper from '../helper';

export default class CalcScreen extends Helper {
    render() {
        return (
          <textarea className="calc-screen" readOnly maxLength="15" value={ this.props.readout } onChange={this.props.handleChange} />
        )
      }
}