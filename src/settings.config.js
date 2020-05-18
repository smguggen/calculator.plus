const settings = {
    dictionary: {
        Percent: "%",
        Plus: "+",
        Minus: "-",
        Times: "x",
        Divide: "/",
        Equals: "=",
        Decimal: ".",
        Negate: "+/-",
        Radic: String.fromCharCode(8730)
    },
    order: ['AC', 'C', '%', '+', '7', '8', '9', '-',
    '4', '5', '6', 'x', '1', '2', '3', '/', '+/-',
    '0', '.', '='],
    operators: ['+', '-', '/', 'x'],
    resetters: ['C', 'AC'],
    resolvers: ['=', '+/-', String.fromCharCode(8730), '%'],
    keyMap: {
        X: 'x',
        '*': 'x',
        Enter: '=',
        Tab: '=',
        '&': '+',
        '_': '-',
        c: 'C',
        a: 'AC',
        Backspace: 'C'
    },
    themes: {
        default: {
            bg: "#dedede",
            btn: "#aeaeae",
            accent: "#fff",
            active: "#ffae42",
            readout: "#000",
            reverse: false 
        },
        dark: {
            bg: "#444",
            btn: "#222",
            accent: "#fff",
            active: "#777",
            readout: "#fff",
            reverse: false 
        },
        pop: {
            bg: "#aaa",
            btn: "#b00050",
            accent: "#f6d9d6",
            active: "#023e4f",
            readout: "#023e4f",
            reverse: true
        },
        pastel: {
            bg: "#b4f6ff",
            btn: "#ffb4fc",
            accent: "#d5b4ff",
            active: "#b4ccff",
            readout: "#fff",
            reverse: true
        },
        psychedelic: {
            bg: "#fd00ff",
            btn: "#3c00ff",
            accent: "#fd5500",
            active: "#00ff38",
            readout: "#fdff00",
            reverse: true
        }
    }
}

export default settings;