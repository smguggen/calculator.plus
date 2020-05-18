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
    
    range(num) {
        if (num > 255) {
            return 255;
        } else if (num < 0) {
            return 0;
        }
        return num;
    }
     
    hue(col, perc, darken) {
    
        let num = parseInt(col.replace("#",""), 16);
        let r = this.range((num >> 16) + perc);
        let b = this.range(((num >> 8) & 0x00FF) + perc);
		let g = this.range((num & 0x0000FF) + perc);

		return '#' + (g | (b << 8) | (r << 16)).toString(16);
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