import React from 'react';
import settings from '../settings.config';
export default class CalcButton extends React.Component {
    constructor(props) {
      super(props);
      this.classes = this.getClasses();
      this.isOperator = this.classes.includes('calc-operator');
      this.isReset = this.classes.includes('calc-reset');
      this.state = this.getStyles();
      this.hover = this.hover.bind(this);
      this.unhover = this.unhover.bind(this);
    }

    getKey(char) {
        let key = Object.keys(settings.dictionary).find(key => char === settings.dictionary[key]);
        if (!key) {
          return char;
        }
        return key;
    }
    
    getClasses() {
        let cl = this.getKey(this.props.display).toString().toLowerCase();
        this.id = `calc-${cl}`;
        let row = Math.floor((this.props.index + 4)/4);
        let col = (this.props.index % 4) + 1;
        let arr = ['btn', this.id, `grid-col-${col}`, `grid-row-${row}`];
        
        if (['+', '-', '/', 'x'].includes(this.props.display)) {
            arr.push('calc-operator');
        } 
        if (Object.values(settings.dictionary).includes(this.props.display)) {
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
    
    getStyles() {
        let css = this.props.styles;
        let active = this.isActive || this.isReset;
        let hoverBg = !active && this.isOperator;
        let type = active ? 'active' : hoverBg ? 'hoverBg' : 'btn';
        return {
            color: this.isOperator ? css.hoverColor : css.accent,
            backgroundColor: css[type]
        }
    }
    
    hover() {
        let css = this.props.styles;
        this.setState({
            color: css.hoverColor,
            backgroundColor: this.isReset || (this.isOperator && this.isActive) ? css.activeDark : this.isOperator ? css.active : css.hoverBg
        })
    }
    
    unhover() {
        this.setState(this.getStyles());
    }
    
    render() {
        this.isActive = this.props.active && this.props.active === this.props.display;
        var cl = this.classes + (this.isActive ? ' active' : '');
        
      return (
        <button id={this.id} 
            type="input" 
            onClick={this.props.clickHandler} 
            onMouseEnter={this.hover}
            onMouseLeave={this.unhover}
            className={cl}
            style={this.state}
        >
            <span>
                { this.props.display }
            </span>
        </button>
      )
    }
  }