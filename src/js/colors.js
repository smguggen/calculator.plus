class Colors {
    static lighten(col,perc) {
        let colors = new Colors();
        return colors.hue(col, perc);
    }
    
    static darken(col,perc) {
        let colors = new Colors();
        return colors.hue(col, perc, true);
    }
    
    static opposite(col) {
        let colors = new Colors();
        let rgb = colors.getrgb(col);
        let res = rgb.map(num => {
            num = Number(num);
            return 255 - Math.round(num);
        }).join(',');
        return `rgb(${res})`;
    }
    
    keepInRange(num) {
        if (num > 255) {
            return 255;
        } else if (num < 0) {
            return 0;
        }
        return num;
    }
    
    getrgb(col) {
        let rgb;
        if (col.substring(0,1) === 'r') {
            // eslint-disable-next-line
            rgb = /^[^\(]*\(([^\)]*)\)/.exec(col)[1].split(',').map(a => a.trim()).slice(0,3);
        } else {
            rgb = this.hextorgb(col); 
        }
        return rgb;
    }
     
    hue(col, perc, darken) {
        let rgb = this.getrgb(col);
        let $this = this;
        let arr = rgb.map(num => {
            num = Number(num);
            let factor = (Number(perc)/100)*255;
            
            if (darken) {
               return $this.keepInRange(Math.round(num - factor));
            } else {
               return $this.keepInRange(Math.round(num + factor));
            }
        }).join(',');
        return `rgb(${arr})`;
    }
    
    hextorgb(hex) {
        let h = hex.replace('#', '').toString().toLowerCase();
        if (h.length === 3) {
            let a = h.substring(0,1);
            let b = h.substring(1,2);
            let c = h.substring(2);
            h = a + a + b + b + c + c;
        }
        if (h.length !== 6) {
            throw new Error('Invalid hex code');
        }
        let r = h.substring(0,2);
        let g = h.substring(2,4);
        let b = h.substring(4);
        return [parseInt(r,16), parseInt(g,16), parseInt(b,16)]
    }
}

export default Colors;