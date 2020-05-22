import React from 'react';
import Colors from '../js/colors';
import settings from '../settings.config';
import ReactDOM from 'react-dom';

class CalcTheme extends React.Component {
    constructor(props) {
        super(props);
        this.node = document.createElement('style');
    }
    
    setStyles() {
        let theme = this.props.theme;
        let def = settings.themes.default;
        let themeColors = theme === 'default' ? {} : settings.themes[theme];
        return Object.assign({}, def, themeColors);
    }

    get style() {
        let styles = this.setStyles(),
        accent = styles.reverse ? Colors.opposite(styles.btn) : styles.accent,
        btnDark = Colors.darken(styles.btn, 20),
        activeDark = Colors.darken(styles.active, 20),
        hoverBg = styles.reverse ? accent : btnDark,
        hoverColor = styles.reverse ? styles.btn : accent;
        return `
            .container {
                background-color: ${styles.bg};
            }
            .top {
                border-bottom: 1px solid ${styles.btn};
            }
            .open-settings {
                background-color: ${styles.active};
            }
            .calc-screen {
                border: 2px solid ${styles.btn};
                background-color: ${accent};
                color: ${Colors.opposite(accent)};
            }
            button.btn {
                background-color: ${styles.btn};
                color: ${accent};
            }
            button.btn:hover {
                background-color: ${hoverBg};
                color: ${hoverColor};
            }
            button.btn.calc-operator {
                background-color: ${btnDark};
            }

            button.btn.calc-reset, button.btn.calc-operator:hover, button.btn.calc-operator.active {
                background-color: ${styles.active}
            }  
            button.btn.calc-reset:hover, button.btn.calc-operator.active:hover {
                background-color: ${activeDark};
            }
        `
    }
    
    componentDidMount() {
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(this.node);
    }
    componentWillUnmount() {
        let head = document.getElementsByTagName('head')[0];
        head.removeChild(this.node);
    }
    
    render() {
        return ReactDOM.createPortal(
            <React.Fragment>{this.style}></React.Fragment>, this.node
        )
    }
}
export default CalcTheme