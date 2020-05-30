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
    }
}

export default settings;