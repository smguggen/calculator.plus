import React from 'react';
import Helper from '../helper';

export default class CalcScreen extends Helper {
    render() {
        return (
          <textarea id="screen" 
            value={ this.props.readout } 
            style={{
                border: '2px solid ' + this.props.btn,
                backgroundColor: this.props.accent
            }}
            className="calc-screen" 
            maxLength="15" 
            readOnly
        />)
      }
}