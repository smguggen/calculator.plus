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
        readout: '0.',
        operator: null,  
        tally:0,
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
    
    getReadout(readout) {
        let num = Number(readout);
        return isNaN(num) ? 0 : num;
    }

    setReadout(readout) {
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
        if (!res || res === '.') {
            res = '0.';
        }
        return res;
    }
    
    reset(partial, last) {
        last = last || null;
        this.setState(({lastPressed}) => {
            let st = {
                readout: '0.',
                operator: null,
                resetReadout: true
            }
            if (!partial && lastPressed !== 'C') {
                st.tally = 0;
            }
            return st;
        }, () => { this.setState({ lastPressed: last })  });
    }
    
    handleDigits(digit) {
        this.setState(function(state) {
            let readout = this.getReadout(state.readout);
            let tally = state.tally;
            if (state.resetReadout) {
                if (state.operator) {
                    tally = tally ? this.operate(state.operator, tally, readout) : readout;
                } else {
                    tally = readout;
                }
                readout = digit.toString();
            } else {
                readout = readout.toString() + digit.toString();
            }
            if (state.lastPressed === '.') {
                readout = '.' + readout;
            }
            let res = this.setReadout(readout);
            return {
                lastPressed: digit,
                resetReadout: false,
                readout: res,
                tally: tally
            }
        });
    }
    
    handleDecimal() {
        this.setState(function(state) {
            let currentValue = this.getReadout(state.readout);
            let val = currentValue === parseInt(currentValue) ? '.' : state.lastPressed;
            return {
                lastPressed: val,
                resetReadout: false
            }
        });
    }
    
    handleResetters(digit) {
        let partial = digit === 'C';
        this.reset(partial, digit);
    }
    
    handleOperators(digit) {
        this.equate(digit, digit, digit);
    }
    
    handleResolvers(digit) {
        this.equate(null, digit, null, function(tally) {
            let res;
            switch(digit) {
                case this.squareRoot: res = Math.sqrt(tally);
                break;
                case '%': res = tally/100;
                break;
                case '+/-': res = tally*-1;
                break;
                default: res = tally;
                break;
            }
            return res;
        });
    }
    
    operate(operator, total, currentValue) {
        let tally = Number(total);
        if (!tally || isNaN(tally)) {
            tally = 0;
        }
        currentValue = Number(currentValue);
        switch(operator) {
            case '-': tally -= currentValue;
            break;
            case 'x': tally *= currentValue;
            break;
            case '/': tally /= currentValue;
            break;
            default: tally += currentValue;
            break;
        }
        return tally;
    }
    
    equate(operator, lastPressed, newOperator, displayCallback) {
        this.setState(function(state) {
            let res = {
                lastPressed: lastPressed,
                resetReadout: true,
                tally: state.tally,
                readout: state.readout,
                operator: newOperator
            }
            if (!state.tally) {
                return res;
            }
            let currentValue = this.getReadout(state.readout);
            operator = operator || state.operator;
            let tally = this.operate(operator, state.tally, currentValue);
            if (typeof displayCallback === 'function') {
                tally = displayCallback.call(this, tally);
            }
            res.readout = this.setReadout(tally);
            res.tally = 0;
            return res;
        })
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
          <CalcScreen readout={this.state.readout} />
        </div>
        <div className="bottom">
          { btns }
        </div>  
      </div>
    }
  }
  
export default Calc;  
  
  
  