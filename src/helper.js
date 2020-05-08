import { Component } from 'react';

export default class CalcHelper extends Component {
    
    constructor(props) {
        super(props);
        this.squareRoot = String.fromCharCode(8730);
        this.dict = {
            Percent: '%',
            Radic: this.squareRoot,
            Plus: '+',
            Minus: '-',
            Times: 'x',
            Divide: '/',
            Equals: '=',
            Decimal: '.'
        };
        this.alts = ['%'];
        
        this.order = ['AC', 'C', this.squareRoot, '+', 7, 8, 9, '-',
        4, 5, 6, 'x', 1, 2, 3, '/', '+/-',
        0, '.', '='];
        this.operators = ['+', '-', '/', 'x'];
        this.resolvers = ['=', '+/-', this.squareRoot];
        this.resetters = ['AC', 'C'];
        this.symbols = Object.values(this.dict);
    }
    
    getKey(char) {
        let key = Object.keys(this.dict).find(key => char === this.dict[key]);
        if (!key) {
          return char;
        }
        return key;
    }

}


/** class CalcMath {
    constructor() {
      this.reset();
      this.radic = String.fromCharCode(8730);
    }
    
    set display(d) {
      d = d.toString();
      if (this.readout == 0 || this.resetReadout) {
        this._readout = d;
        this.readout = Number(d);
        this.resetReadout = false;
        return;
      }
      let rd = this.readout.toString();
      rd += (this.operator == 'decimal' ? '.' + d : d);
      this._readout = this._processReadoutString(rd);
  
      this.readout = Number(this._readout);
    }
    
    get display() {
      let dis = this.readout;    
      if (!dis) {
          return '0.';
      }
      let rd = dis.toString();
      return this._processReadoutString(rd);
    }
    set operator(o) {
      this.removeClasses(this._op, 'active');
      this._op = o;
      document.getElementsByClassName('btn-char');
      this.addClasses(o, 'active');
    }
    
    get operator() {
      return this._op;
    }
    
    get dict() {
      return {
        Percent: '%',
        Radic: this.radic,
        Plus: '+',
        Minus: '-',
        Times: 'x',
        Divide: '/',
        Equals: '=',
        Decimal: '.'
      }
    }
    
    getKey(char) {
      let key = Object.keys(this.dict).find(key => char == this.dict[key]);
      if (!key) {
        return char;
      }
      return key;
    }
    
    reset () {
      this.operator = null;
      this.readout = 0;
      this.tally = 0;
      this.resetReadout = false;
    }
    
    endEquation() {
       this.tally = this.readout;
       this.operator = null;
       this.resetReadout = false;
    }
  
    onClick(btn) {
      if (!isNaN(Number(btn))) {
          this.clickDigit(Number(btn));
      } else { 
         let fn = this['click' + btn.substring(0,1).toUpperCase() + btn.substring(1)];
         if (typeof fn === 'function') {
          fn();
         } else {
          let func = this.getKey(btn);
          if (func) {
            this['click' + func]();
          }
        }
      }
      return this.display;
    }
    
    clickAC() {
      this.reset();
    }
    
    clickC() {
      this.readout = 0;
    }
    
    clickRadic() {
      this.tally = Math.sqrt(this.quickTally());
      this.clickEquals();
    }
    
    clickPlus() {
      this.tally += this.readout;
      this.operator = 'plus';
      this.resetReadout = true;
    }
    
    clickMinus() {
      this.tally -= this.readout;
      this.operator = 'minus';
      this.resetReadout = true;
    }
    
    clickTimes() {
      this.tally *= this.readout;
      this.operator = 'times';
      this.resetReadout = true;
    }
    
    clickDivide() {
      this.tally /= this.readout;
      this.operator = 'divide';
      this.resetReadout = true;
    }
    
    clickEquals() {
      this.readout = this.tally;
      this.endEquation();
    }
    
    clickPercent() {
      this.tally = this.quickTally()/100;
      this.clickEquals();
    }
    
    clickDecimal() {
      this.operator = 'decimal';
    }
    
    clickDigit(digit) {
      this.display = digit;
    }
    
    calculate(...nums) {
      let first = nums.splice(0,1);
      return nums.reduce((acc, num) => {
        switch(this.operator) {
          case 'plus': acc += num;
          break;
          case 'minus': acc -= num;
          break;
          case 'divide': acc /= num;
          break;
          case 'times': acc *= num;
          break;
        }
        return acc;
      }, first);
    }
  
    quickTally() {
      if (!this.tally) {
        return this.readout;
      }
      if (!this.operator || this.operator == 'decimal') {
        return this.tally;
      }
      return this.calculate(this.tally, this.readout);
    }
    
    _toggleClasses(className, newClass, callback) {
      let c = this.getKey(className);
      let d = c != className ? ('calc-' + c.toLowerCase()) : className;
      let btn = document.getElementsByClassName(d);
      if (!btn.length) {
        return;
      }
      for (let i = 0; i < btn.length; i++) {
        callback(btn, newClass);
        btn.className += ' ' + newClass;
      }
    }
    
    addClasses(className, newClass) {
       this._toggleClasses(className, newClass, (a,b) => {
          a.className += ' ' + b;
       });  
    }
    
    removeClasses(className, newClass) {
       this._toggleClasses(className, newClass, (a,b) => {
          let classes = a.className.split(' ');
          a.className = classes.filter(c => c != b);
       });  
    }
    
    _processReadoutString(rd) {
      rd = rd.toString();
      rd = rd.replace(/[^0-9\.]/g, '');
      let rds = rd.split('.');
      let rdo = rds.splice(0,1);
      let res = rdo.join('') + '.' + rds.join('').replace(/0*$/, '');
      if (res.indexOf('.') < 0) {
        res += '.';
    }
      return res;
    }
    
  }
   */