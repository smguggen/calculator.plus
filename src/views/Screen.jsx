import React from 'react';

export default class CalcScreen extends React.Component {
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