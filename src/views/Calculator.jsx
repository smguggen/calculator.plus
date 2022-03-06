import React, { useState, useCallback, useEffect } from 'react';
import CalcButton from './Button';
import CalcScreen from './Screen';
import settings from '../settings.config';
import Calculate from '../js/calculate';
import Style from './Style';
import Settings from './Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import { useParams } from 'react-router-dom';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
const calculate = new Calculate(16);
const squareRootSymbol = settings.dictionary.Radic;

const Calculator = (props) => {
    const [lastPressed, setLastPressed] = useState(null);
    const [readout, setReadout] = useState('0.');
    const [operator, setOperator] = useState(null);
    const [tally, setTally] = useState(0);
    const [resetReadout, setResetReadout] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [btns, setBtns] = useState([]);

    const params = useParams() || {};

    const reset = useCallback((partial, last) => {
        last = last || null;
        setReadout('0.');
        setOperator(null);
        setResetReadout(true);
        if (!partial && lastPressed !== 'C') {
            setTally(0);
        }
        setLastPressed(last);
    }, []);

    const equate = useCallback((op = operator, lp, newOp, displayCallback) => {
        if (tally || settings.resolvers.includes(lp)) {
            let currentValue = calculate.getReadout(readout);
            let tl = calculate.operate(op, tally, currentValue);
            if (typeof displayCallback === 'function') tl = displayCallback(tl);
            setReadout(calculate.setReadout(tl));
            setTally(0);
        }
        setLastPressed(lp);
        setResetReadout(true);
        setOperator(newOp);
    }, []);

    const handleDigits = useCallback(digit => {
        let ro = calculate.getReadout(readout);
        let tl = tally;
        if (resetReadout) {
            if (operator) tl = tl ? calculate.operate(operator, tl, ro) : ro;
            else tl = ro;
            ro = digit.toString();
            if (lastPressed === '.') ro = '.' + ro;
            setResetReadout(false);
        } else {
            ro = ro.toString() + (lastPressed === '.' ? '.' : '') + digit.toString();
        }
        setReadout(calculate.setReadout(ro));
        setLastPressed(digit);
        setTally(tl);
    },[])

    const handleDecimal = useCallback(() => {
        let currentValue = calculate.getReadout(readout);
        if (currentValue === parseInt(currentValue)) setLastPressed('.');
        setResetReadout(false);
    }, [readout])

    const handleResetters = useCallback(digit => {
        let partial = digit === 'C';
        reset(partial, digit);
    }, [reset]);

    const handleOperators = useCallback(digit => {
        equate(digit, digit, digit);
    }, [equate]);

    const handleResolvers = useCallback(digit => {
        equate(null, digit, null, tl => {
            let res;
            switch (digit) {
                case squareRootSymbol: res = Math.sqrt(tl);
                    break;
                case '%': res = tl / 100;
                    break;
                case '+/-': res = tl * -1;
                    break;
                default: res = tl;
                    break;
            }
            return res;
        });
    }, [equate]);

    const triggerClick = useCallback((digit) => {
        console.log('TALLY', tally);
        if (settings.operators.includes(digit)) {
            console.log('OPERATOR');
            handleOperators(digit);
        } else if (settings.resolvers.includes(digit)) {
            console.log('RESOLVER');
            handleResolvers(digit);
        } else if (settings.resetters.includes(digit)) {
            console.log('RESETTER');
            handleResetters(digit);
        } else if (digit === '.') {
            console.log('DECIMAL');
            handleDecimal();
        } else {
            console.log('NUMBER');
            handleDigits(digit);
        }
    }, []);

    const handleClick = useCallback((e) => {
        triggerClick(e.target.textContent);
    }, [triggerClick])

    const handlePress = useCallback((e) => {
        let digit = settings.keyMap[e.key] ? settings.keyMap[e.key] : e.key;
        if (settings.order.includes(digit)) {
            triggerClick(digit);
        }
    }, [triggerClick]);
    
    const toggleSettings = useCallback(() => {
        setSettingsOpen(s => !s);
    }, []);

    useEffect(() => {
        document.getElementById('screen').focus();
        document.addEventListener('keyup', e => {
            handlePress(e);
        });
    }, [handlePress]);

    useEffect(() => {
        setBtns(settings.order.map((digit, index) => (<CalcButton display={digit} clickHandler={handleClick} key={index} active={operator} index={index} />)))
    }, [handleClick, operator]);

    return (<div className='wrapper'>
        <div className="container">
            <div className="top">
                <div className="settings-wrapper"><button id="open-settings" 
                className="open-settings"
                onClick={toggleSettings}
                ><PowerSettingsNewIcon fontSize="small"/></button></div>
                <CalcScreen readout={readout} screenClick={props.screenClick}/>
            </div>
            <div className="bottom">
                {btns}
            </div>
        </div>
        <Style theme={params.theme} />
        <Settings 
            open={settingsOpen}
            theme={params.theme}
            toggle={toggleSettings}
        />
    </div>)
}

export default Calculator;