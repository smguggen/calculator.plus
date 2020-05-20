import React from 'react';

export default class CalcScreen extends React.Component {
    render() {
        return (
          <textarea id="screen" 
            value={ this.props.readout } 
            className="calc-screen" 
            maxLength="15" 
            readOnly
        />)
      }
}