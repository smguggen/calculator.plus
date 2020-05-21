class Calculate {
    constructor(limit) {
        this.limit = limit > 20 ? 20 : limit;
        this.readout = 0;
    }
    
    getReadout(readout) {
        let num = Number(readout);
        return isNaN(num) ? 0 : num;
    }
    
    setReadout(readout) {
        let str = readout.toString(),
        hasE = str.indexOf('e') > -1;
        if (hasE) {
            let fractionDigits = this.limit - 6;
            return readout.toExponential(fractionDigits).replace(/\.(\d*)e/,(match, p1) => {
                let hasVals = /[1-9]/.test(p1),
                dec = hasVals ? '.' : '',
                dig = p1.replace(/0+$/, '');
                return dec + dig + 'e';
            });
        }
        let arr = str.split('.'),
        digits = arr.splice(0,1).join('').trim(), 
        decimals = arr.join('').trim().replace(/[^0-9]/g, '').replace(/0+$/g, ''),
        neg = digits.substring(0,1) === '-' ? '-' : '';
        
        digits = digits.replace(/[^0-9]/g, '')
            .replace(/^0+/, '');
        digits = digits || '0';
        let digitCount = digits.length,
        decimalCount = decimals.length,
        count = digitCount + decimalCount,
        res = neg + digits + '.' + decimals;
        
        if (digitCount > this.limit) {
            let fractionDigits = this.limit - 6;
            return Number(res).toExponential(fractionDigits);
        } else if (count > this.limit) {
            let fractionDigits = decimalCount - (count - this.limit);
            if (fractionDigits < 0) {
                fractionDigits = 0;
            }
            return Number(res).toFixed(fractionDigits).toString();
        } else {
            return res;
        }
    }

    operate(operator, total, currentValue) {
        let tally = Number(total);
        if (!tally || isNaN(tally)) {
            tally = 0;
        }
        currentValue = Number(currentValue);
        switch (operator) {
            //using this formula normalizes numbers to correct for javascript's floating point math issue (https://gist.github.com/lsloan/f8c5ab552545ee968cca)
            case '-': tally = Math.round((tally - currentValue)*1e12)/1e12;
                break;
            case 'x': tally = Math.round((tally * currentValue)*1e12)/1e12;
                break;
            case '/': tally = Math.round((tally / currentValue)*1e12)/1e12;
                break;
            default:  tally = Math.round((tally + currentValue)*1e12)/1e12;
                break;
        }
        return tally;
    }
}

export default Calculate;