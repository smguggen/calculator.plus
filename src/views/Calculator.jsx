import React from 'react';
import CalcButton from './Button';
import CalcScreen from './Screen';
import settings from '../settings.config';
import Calculate from '../js/calculate';
import Style from './Style';
import Settings from './Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
const calculate = new Calculate(16);

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.alts = [settings.dictionary.Radic];    
            
        this.state = {
            lastPressed: null,
            readout: '0.',
            operator: null,
            tally: 0,
            resetReadout: true,
            settingsOpen: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
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
            let readout = calculate.getReadout(state.readout);
            let tally = state.tally;
            if (state.resetReadout) {
                if (state.operator) {
                    tally = tally ? calculate.operate(state.operator, tally, readout) : readout;
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
      
            let res = calculate.setReadout(readout);
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
            let currentValue = calculate.getReadout(state.readout);
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
            let currentValue = calculate.getReadout(state.readout);
            operator = operator || state.operator;
            let tally = calculate.operate(operator, state.tally, currentValue);
            if (typeof displayCallback === 'function') {
                tally = displayCallback.call(this, tally);
            }
            res.readout = calculate.setReadout(tally);
            res.tally = 0;
            return res;
        })
    }
    
    toggleSettings() {
        this.setState(st => {
            return {
                settingsOpen: !st.settingsOpen 
            }
        });
    }

    componentDidMount() {
        document.getElementById('screen').focus();
        let $this = this;
        document.addEventListener('keyup', e => {
            $this.handlePress(e);
        });
    }
    
    render() {
        let btns = (settings.order.map((digit, index) => {
            return <CalcButton display={digit} clickHandler={this.handleClick} key={index} active={this.state.operator} index={index} />
        }));
        return (<div className='wrapper'>
            <div className="container">
                <div className="top">
                    <div className="settings-wrapper"><button id="open-settings" 
                    className="open-settings"
                    onClick={this.toggleSettings}
                    ><PowerSettingsNewIcon fontSize="small"/></button></div>
                    <CalcScreen readout={this.state.readout} screenClick={this.screenClick}/>
                </div>
                <div className="bottom">
                    {btns}
                </div>
            </div>
            <Style theme={this.props.theme} />
            <Settings 
                open={this.state.settingsOpen}
                theme={this.state.theme}
                toggle={this.toggleSettings}
            />
        </div>)
    }
}

export default Calculator;