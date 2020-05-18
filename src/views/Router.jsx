import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Calc from './Calculator';
import settings from '../settings.config';
import Colors from '../js/colors';
class Router extends React.Component {
   
    
    setStyles(theme) {
        let css = settings.themes[theme];
        if (!css) {
            css = settings.themes.default;
        }
        if (!css || typeof css !== 'object') {
            return false;
        }
        css.hoverColor = css.reverse ? css.btn : css.accent;
        css.hoverBg = css.reverse ? css.accent : Colors.darken(css.btn, 20);
        css.activeDark = Colors.lighten(css.active, 20);
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