import React from 'react';
import Helper from './helper';
import CalcButton from './views/Button';
import CalcScreen from './views/Screen';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

  class Calc extends Helper {
    constructor(props) {
      super(props);
      this.state = {
        lastPressed: null,
        display: '0.',
        operator: null,  
        tally:0,
        currentValue: 0,
        resetReadout: true  
      }
      this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e) {
      let digit = e.target.innerText;
      if (this.operators.includes(digit)) {
        this.handleOperators(digit);
      } else if (this.resolvers.includes(digit)) {
        this.handleResolvers(digit);
      } else if (this.resetters.includes(digit)) {
          this.handleResetters(digit);
      } else if (digit === '.') {  
            this.handleDecimal();
      } else {
          this.handleDigits(digit);
      }
    }
    
    reset(partial, last) {
        last = last || null;
        this.setState(({lastPressed}) => {
            let st = {
                display: '0.',
                currentValue: 0,
                operator: null,
                resetReadout: true
            }
            if (!partial && lastPressed !== 'C') {
                st.tally = 0;
            }
            return st;
        }, () => { this.setState({ lastPressed: last })  });
    }
    
    handleResetters(digit) {
        let partial = digit === 'C';
        this.reset(partial, digit);
    }

    handleResolvers(digit) {
         switch(digit) {
             default: this.handleEquals();
             break;
         }       
    }
    
    handleEquals() {
        this.operate({
            operator:null,
            resetReadout: true,
            lastPressed: '='
        });    
    }
    
    handleDigits(digit) {
        this.setState(state => {
            if (state.resetReadout) {
                return {
                    display: this.setDisplay(digit),
                    currentValue: Number(digit),
                    resetReadout: false
                }
            }
            let display = state.currentValue.toString();
            let decimal = state.lastPressed === '.' ? '.' : '';
            let val = display + decimal + digit.toString();
            return {
                display: this.setDisplay(val),
                currentValue: Number(val),
                lastPressed: digit
            }
        });
    }
    
    handleOperators(digit) {
        this.setState({
            operator: digit
        }, () => { 
            this.operate({
                lastPressed:digit,
                resetReadout: true
            });
        });
    }
    
    handleDecimal() {
        this.setState(state => {
            let val = state.currentValue === parseInt(state.currentValue) ? '.' : state.lastPressed;
            return {
                lastPressed: val
            }
        });
    }

    operate(state) {
        this.setState(({operator, currentValue, tally }) => {
            switch(operator) {
                case '-': tally -= currentValue;
                currentValue = 0;
                break;
                case 'x': tally *= currentValue;
                currentValue = 0;
                break;
                case '/': tally /= currentValue;
                currentValue = 0;
                break;
                case '+': tally += currentValue;
                currentValue = 0;
                break;
                default: tally += 0;
                break;
            }
            return {
                tally: tally,
                currentValue: currentValue,
                display: this.setDisplay(tally)
            }
        }, () => { this.setState(state) });  
    }

    setDisplay(readout) {
        let rd = readout.toString();
        rd = rd.replace(/[^0-9\.]/g, '');
        if (/^0[^\.]/.test(rd)) {
            rd = rd.replace(/^0*/, '');
        }
        let rds = rd.split('.');
        let rdo = rds.splice(0,1);
        let res = rdo.join('') + '.' + rds.join('').replace(/0*$/, '');
        if (res.indexOf('.') < 0) {
          res += '.';
        }
        return res;
    }
    
    getDisplay(display) {
        let d = Number(display);
        return isNaN(d) ? 0 : d;
    }
    
    getButtonClasses() {
        let cl = this.getKey(this.props.display).toString().toLowerCase();
        let arr = ['btn', 'calc-' + cl];
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
        return arr;
    }

    
    render() {
        let btns = (this.order.map((digit, index) => {
            return <CalcButton display={digit} clickHandler={this.handleClick}  key={index} active={this.state.operator} />
        }));
      return <div className="container">
        <div className="top">
          <CalcScreen readout={this.state.display} />
        </div>
        <div className="bottom">
          { btns }
        </div>  
      </div>
    }
  }
  
export default Calc;  
  
  
  