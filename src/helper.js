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
            Decimal: '.',
            Negate: '+/-'
        };
        this.alts = [this.squareRoot];
        
        this.order = ['AC', 'C', '%', '+', '7', '8', '9', '-',
        '4', '5', '6', 'x', '1', '2', '3', '/', '+/-',
        '0', '.', '='];
        this.btns = this.order.concat(this.alts);
        this.operators = ['+', '-', '/', 'x'];
        this.resolvers = ['=', '+/-', this.squareRoot, '%'];
        this.resetters = ['AC', 'C'];
        this.symbols = Object.values(this.dict);
        this.keyMap = {
            'X': 'x',
            '*': 'x',
            'Enter': '=',
            'Tab': '=',
            '&': '+',
            '_': '-',
            'c': 'C',
            'a': 'A' 
        }
    }
    
    getKey(char) {
        let key = Object.keys(this.dict).find(key => char === this.dict[key]);
        if (!key) {
          return char;
        }
        return key;
    }

}