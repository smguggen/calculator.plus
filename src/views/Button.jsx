import React from 'react';
import Helper from '../helper';

export default class CalcButton extends Helper {
    constructor(props) {
      super(props);
      this.classes = this.getClasses();
    }
    
    getClasses() {
        let cl = this.getKey(this.props.display).toString().toLowerCase();
        let row = Math.floor((this.props.index + 4)/4);
        let col = (this.props.index % 4) + 1;
        let arr = ['btn', `calc-${cl}`, `grid-col-${col}`, `grid-row-${row}`];
        
        if (this.operators.includes(this.props.display)) {
            arr.push('calc-operator');
        } 
        if (this.symbols.includes(this.props.display)) {
            arr.push('calc-symbol');
        }
        if (['AC', 'C'].includes(this.props.display)) {
            arr.push('calc-reset');
        }
        if (!isNaN(Number(this.props.display))) {
            arr.push('calc-digit');
        }
        return arr.join(' ');
    }
    
    render() {
        var cl = this.classes + (this.props.active && this.props.active === this.props.display ? ' active' : '');
      return (
        <button type="input" onClick={this.props.clickHandler} className={cl}><span>{ this.props.display }</span></button>
      )
    }
  }