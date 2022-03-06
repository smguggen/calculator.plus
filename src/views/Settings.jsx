import React from 'react';
import Theme from './settings/Theme';
import themes from '../themes.json';
import { 
    Drawer, 
    List,
    ListSubheader, 
    Divider, 
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
export default class CalcSettings extends React.Component {
    
    getThemes() { 
        return Object.keys(themes).map((theme, index) => {
            return <Theme theme={theme} selected={this.props.theme === theme} key={index} />
        });
    }

    render() {
        return (
            <Drawer 
                className="settings"
                variant="persistent"
                anchor="left"
                open={this.props.open}
            >
                <ListSubheader inset>Themes <ChevronLeft fontSize="small" onClick={ this.props.toggle }/></ListSubheader> 
                <Divider />
                <List classes={{root: 'settings-list'}}>
                    {this.getThemes()}
                </List>  
            </Drawer>
        )
        
    }
}