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
            'a': 'AC',
            'Backspace': 'C'
        }
    }
    
    getKey(char) {
        let key = Object.keys(this.dict).find(key => char === this.dict[key]);
        if (!key) {
          return char;
        }
        return key;
    }
    
    _getObjFromString(str) {
        let p = str.split(';');
        if (p && p.length) {
            return p.reduce((acc, q) => {
                let o = q.split(':').map(a => a.trim());
                if (o && o.count === 2) {
                    acc[o[0]] = o[1];
                }
                return acc;
            }, {});
        }
        return null;
    }
    
    lighten(col,perc) {
        return this.hue(col, perc);
    }
    
    darken(col,perc) {
        return this.hue(col, perc, true);
    }
    
    hue(col,perc, darken) {
        perc = Math.abs(perc);
        if (darken) {
            perc*=-1;
        }
        var R = parseInt(col.substring(1,3),16);
        var G = parseInt(col.substring(3,5),16);
        var B = parseInt(col.substring(5,7),16);
    
        R = parseInt(R * (100 + perc) / 100);
        G = parseInt(G * (100 + perc) / 100);
        B = parseInt(B * (100 + perc) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }
}