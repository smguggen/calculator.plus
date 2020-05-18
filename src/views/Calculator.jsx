import React from 'react';
import CalcButton from './Button';
import CalcScreen from './Screen';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import settings from '../settings.config';

class Calc extends React.Component {
    constructor(props) {
        super(props);
        this.alts = [settings.dictionary.Radic];        
        this.state = {
            lastPressed: null,
            readout: '0.',
            operator: null,
            tally: 0,
            resetReadout: true,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.triggerClick(e.target.textContent);
    }

    handlePress(e) {
        let digit = settings.keyMap[e.key] ? settings.keyMap[e.key] : e.key;
        this.pressed = digit;
        if (settings.order.includes(digit)) {
            this.triggerClick(digit);
        }
    }

    triggerClick(digit) {
        if (settings.operators.includes(digit)) {
            this.handleOperators(digit);
        } else if (settings.resolvers.includes(digit)) {
            this.handleResolvers(digit);
        } else if (settings.resetters.includes(digit)) {
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
        if (rd.indexOf('e') > -1 || isNaN(rd) || readout === Infinity) {
            return rd;
        }
        let minus = rd.substring(0, 1) === '-' && readout ? '-' : '';
        // eslint-disable-next-line
        rd = rd.replace(/[^0-9\.]/g, '');
        // eslint-disable-next-line
        if (/^0+[^\.]/.test(rd)) {
            rd = rd.replace(/^0+/, '');
        }
        let rds = rd.split('.');
        let rdo = rds.splice(0, 1);
        let res = rdo.join('') + '.' + rds.join('').replace(/0+$/, '');
        if (res.indexOf('.') < 0) {
            res += '.';
        }
        if (res.substring(0, 1) === '.') {
            res = '0' + res;
        }
        let limit = document.getElementById('screen').offsetWidth > 400 ? 12 : 8;
        if (res.length > limit) {
            res = Number(res).toExponential();
        }
        if (!res) {
            res = '0.';
        }
        return minus + res;
    }

    set pressed(p) {
        this._pressed = !p ? [] : this._pressed || [];
        if (this._pressed.length >= 25) {
            this._pressed.pop();
        }
        this._pressed.unshift(p);
    }

    get pressed() {
        return this._pressed.filter(press => !['Shift', 'Tab', 'Control', 'Alt', 'Meta'].includes(press));
    }

    reset(partial, last) {
        last = last || null;
        this.setState(({ lastPressed }) => {
            let st = {
                readout: '0.',
                operator: null,
                resetReadout: true
            }
            if (!partial && lastPressed !== 'C') {
                st.tally = 0;
            }
            return st;
        }, () => { this.setState({ lastPressed: last }) });
    }

    handleDigits(digit) {
        this.setState(function (state) {
            let readout = this.getReadout(state.readout);
            let tally = state.tally;
            if (state.resetReadout) {
                if (state.operator) {
                    tally = tally ? this.operate(state.operator, tally, readout) : readout;
                } else {
                    tally = readout;
                }
                readout = digit.toString();
                if (state.lastPressed === '.') {
                    readout = '.' + readout;
                }
            } else {
                readout = readout.toString() + 
                    (state.lastPressed === '.' ? '.' : '') +
                    digit.toString();
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
        this.setState(function (state) {
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
        this.equate(null, digit, null, function (tally) {
            let res;
            switch (digit) {
                case this.squareRoot: res = Math.sqrt(tally);
                    break;
                case '%': res = tally / 100;
                    break;
                case '+/-': res = tally * -1;
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
        switch (operator) {
            //using this formula normalizes numbers to correct for javascript's floating point math issue (https://gist.github.com/lsloan/f8c5ab552545ee968cca)
            case '-': tally = Math.round((tally - currentValue)*1e12)/1e12;
                break;
            case 'x': tally = Math.round((tally * currentValue)*1e12)/1e12;
                break;
            case '/': tally = Math.round((tally / currentValue)*1e12)/1e12;
                break;
            default:  tally = Math.round((tally + currentValue)*1e12)/1e12;
                break;
        }
        return tally;
    }
    
    equate(operator, lastPressed, newOperator, displayCallback) {
        this.setState(function (state) {
            let res = {
                lastPressed: lastPressed,
                resetReadout: true,
                tally: state.tally,
                readout: state.readout,
                operator: newOperator
            }
            if (!state.tally && !settings.resolvers.includes(lastPressed)) {
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

    componentDidMount() {
        document.getElementById('screen').focus();
        let $this = this;
        document.addEventListener('keyup', e => {
            $this.handlePress(e);
        });
    }

    render() {
        let styles = this.props.styles;
        let btns = (settings.order.map((digit, index) => {
            return <CalcButton display={digit} clickHandler={this.handleClick} key={index} active={this.state.operator} styles={styles} index={index} />
        }));
        return (<div className='wrapper'>
            <div className="container" style={
                {
                    backgroundColor: styles.bg
                }}
            >
                <div className="top" style={
                    {
                        borderBottom: '1px solid ' + styles.btn 
                    }}
                >
                    <CalcScreen readout={this.state.readout} 
                        btn={styles.btn}
                        accent={styles.accent}
                    />
                </div>
                <div className="bottom">
                    {btns}
                </div>
            </div>
        </div>)
    }
}

export default Calc;