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
    
    set style(obj) {
        if (!this._style) {
            this._style = {};
        }
        if (!obj || Array.isArray(obj) || typeof obj !== 'object') {
            if (typeof obj === 'string') {
                obj = this._getObjFromString(obj);
            }
            if (!obj) {
                return;
            }
        }
        this._style = Object.assign({}, this._style, obj);
    }
    
    get style() {
        return this._style;
    }
    
    styles(styles) {
        let def = {
            $name: 'default',
            $bg: '#dedede',
            $btn: '#aeaeae',
            $accent: '#fff',
            $active: '#ffae42',
            $reverse: false,
            $readout: '#000'
        }  
        styles = Object.assign({}, def, styles || {});
        let css = Object.assign({}, styles);
        delete css.reverse;
        css.hoverColor = styles.reverse ? css.btn : css.accent;
        css.hoverBg = styles.reverse ? css.accent : this.darken(css.btn, 20);
        let tag = document.getElementByTagName('style')[0];
        
        tag.innerHTML = `
            .container {
                background-color: ${css.bg}};
            }
            .top {
                border-bottom: 1px solid ${css.btn};
            }
            .calc-screen {
                background-color: ${css.accent};
                border: 2px solid ${css.btn};
            }
            button.btn {
                background-color: ${css.btn};
                color: ${css.accent};
            }
            button.btn.calc-operator, button.btn:hover {
                color: ${css.hoverColor};
                background-color: ${css.hoverBg};
            }
            button.btn.calc-operator.active, button.btn.calc-operator:hover {
                background-color: ${css.active} !important;
            }           
            button.btn.calc-reset, button.btn.active {
                background-color: ${css.active};
            }       
            
            @media screen and (orientation: portrait) {
                .wrapper {
                    background-color: ${css.bg};
                }
            }
        `
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
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }
}