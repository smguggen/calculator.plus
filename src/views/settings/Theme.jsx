import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import { Link } from "react-router-dom";

export default class CalcTheme extends React.Component {
    render() {
        let dest = '/' + this.props.theme;
        let themeLink = React.forwardRef((props, ref) => <Link ref={ref} to={dest} replace {...props} />);
        return (<ListItem button component={themeLink} selected={this.props.selected}>
            <ListItemText className="theme-text-item" primary={this.props.theme.substring(0,1).toUpperCase() + this.props.theme.substring(1)} />
        </ListItem>)
    }
}