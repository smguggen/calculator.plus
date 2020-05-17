import React from 'react';
import Helper from './helper';
import CalcButton from './views/Button';
import CalcScreen from './views/Screen';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';

class Calc extends Helper {
    constructor(props) {
        super(props);
        this.defaultStyles = this.getDefaultStyles();
        this.theme = this.props.match.params.theme || null;
        this.state = {
            lastPressed: null,
            readout: '0.',
            operator: null,
            tally: 0,
            resetReadout: true,
            opacity: this.theme ? 0 : 1,
            styles: this.defaultStyles
        }
        this.handleClick = this.handleClick.bind(this);
        if (this.theme) {
            this.styles();
        }
    }

    handleClick(e) {
        this.triggerClick(e.target.textContent);
    }

    handlePress(e) {
        let digit = this.keyMap[e.key] ? this.keyMap[e.key] : e.key;
        this.pressed = digit;
        if (this.order.includes(digit)) {
            this.triggerClick(digit);
        }
    }

    triggerClick(digit) {
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
            if (!state.tally && !this.resolvers.includes(lastPressed)) {
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
    
    getDefaultStyles() {
        return {
            name: 'default',
            bg: '#dedede',
            btn: '#aeaeae',
            accent: '#fff',
            active: '#ffae42',
            reverse: false,
            readout: '#000',
            hoverColor: '#fff',
            hoverBg: this.darken('#aeaeae', 20)
        }
    }
    
    async styles() {
        let { themes } = await import('./settings.config.json');
        let styles = Object.assign({}, this.defaultStyles, themes && themes[this.theme] ? themes[this.theme] : {});
        let css = Object.assign({}, styles);
        css.hoverColor = styles.reverse ? css.btn : css.accent;
        css.hoverBg = styles.reverse ? css.accent : this.darken(css.btn, 20);
        this.setState({
            opacity: 1,
            styles: css
        });
    }

    componentDidMount() {
        document.getElementById('screen').focus();
        let $this = this;
        document.addEventListener('keyup', e => {
            console.log(e.key);
            $this.handlePress(e);
        });
    }

    render() {
        let btns = (this.order.map((digit, index) => {
            return <CalcButton display={digit} clickHandler={this.handleClick} key={index} active={this.state.operator} styles={this.state.styles} index={index} />
        }));
        return <div className='wrapper' style={{opacity: this.state.opacity}}>
            <div className="container" style={
                {
                    backgroundColor: this.state.styles.bg
                }}
            >
                <div className="top" style={
                    {
                        borderBottom: '1px solid ' + this.state.styles.btn 
                    }}
                >
                    <CalcScreen readout={this.state.readout} 
                        btn={this.state.styles.btn}
                        accent={this.state.styles.accent}
                    />
                </div>
                <div className="bottom">
                    {btns}
                </div>
            </div>
        </div>
    }
}

export default Calc;


