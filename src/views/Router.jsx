import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Calculator from './Calculator';
class Router extends React.Component {
   
    render() {
        return (<BrowserRouter>
            <Switch>
                <Route path="/:theme?" render={({match}) => <Calculator theme={match.params.theme || 'default'} />} />
            </Switch>
        </BrowserRouter>);
    }
}

export default Router;