import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Calc from './Calculator';
import settings from '../settings.config';

class Router extends React.Component {
    lighten(col,perc) {
        return this.hue(col, perc);
    }
    
    darken(col,perc) {
        return this.hue(col, perc, true);
    }
    
    hue(col, perc, darken) {
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
    
    setStyles(theme) {
        let css = settings.themes[theme];
        if (!css) {
            css = settings.themes.default;
        }
        if (!css || typeof css !== 'object') {
            return false;
        }
        css.hoverColor = css.reverse ? css.btn : css.accent;
        css.hoverBg = css.reverse ? css.accent : this.darken(css.btn, 20);
        css.activeDark = this.darken(css.active, 20);
        return css;
    }

    render() {
        return (<BrowserRouter>
            <Switch>
                <Route path="/:theme?" render={({match}) => <Calc styles={this.setStyles(match.params.theme || 'default')} />} />
            </Switch>
        </BrowserRouter>);
    }
}

export default Router;