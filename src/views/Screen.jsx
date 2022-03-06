import React from 'react';

export default class CalcScreen extends React.Component {
    render() {
        return (
          <textarea id="screen" 
            value={ this.props.readout } 
            className="calc-screen" 
            onClick={this.props.screenClick || (() => {})}
            maxLength="20" 
            readOnly
        />)
      }
}