/*/ -------------------------------------------------------------------------------------------- /*/
/**
 * X-Number class: read/write formated numbers
 *
 * @param (mixed) val - any value that represent a number
 *
 * @param (int|bool) prec - precision: TRUE - preserve,
 *                                     FALSE - free,
 *                                     INT<0 - no more than prec digits after point
 *                                     0<=INT - exact precision ('0' padded)
 *
 * @param (string|bool) term - thousands separator: TRUE   - try to preserve it from input value,
 *                                                  STRING - separator
 *
 * @param (object) fmt - return the used format and primitive value in fmt (optional)
 *
 * @return (object|number|string) if used as constructor, return an instance
 *                                if no prec or term, return primitive
 *                                if prec or term, return formated string
 *
 * @author Dumitru Uzun (DUzun.Me)
 * @version 1.0.0
 */
export default function xNumber(val, prec, term, fmt) {
    fmt || (fmt = {})
    if(this instanceof xNumber) {
    // If in constructor, set up the instance
        // Read number value and format
        if(prec == null) prec = true;
        if(term == null) term = true;
        val = this.parseFloat(val, prec, term, fmt);
        this.value = val ;
        this.prec  = fmt.prec ;
        this.term  = fmt.term ;
    }
    else {
    // If not in constructor, return number or formated string
        var prot = xNumber.prototype;
        // Read number value and format
        val = prot.parseFloat.call(fmt, val, prec, term, fmt);

        if(term || prec || prec === 0) {
        // Formated string requested
            return prot.toString.call(fmt,val)
        } else {
        // Number requested
            return val;
        }
    }
}

(function $xNumber(_cons,_prot) {
    function safe_prec(prec) {
        if(prec === true || prec == null)  prec = false; else
        if(prec !== false) prec = parseInt(prec) || 0;
        return prec
    }

    _prot = _cons.prototype;

    _prot.constructor = _cons;
    // nr of fraction digits: if false - free, if >= 0 - exact (pad with '0'), if < 0 - at most (cut if more digits, don't pad)
    _prot.prec        = false;
    _prot.term        = '';
    _prot.value       = 0;

    _prot.valueOf = function () {
        return this.value
    };

    _prot.toString = function (val) {
        var term = this.term,
            prec = safe_prec(this.prec),
            p = val != null ? val : this.value;

        if(!(p instanceof Number)) {
            p = _prot.parseFloat(p, false, term);
        }
        if(term || prec !== false) {
            var i = String(p).split('.', 2),
                m = i[0],
                o;

            i = i[1]||'';

            if(prec !== false) {
                if(o = prec < 0) prec = -prec;
                if(0 <= prec) {
                    if(prec < i.length) {
                        o = Math.ceil(-0.5 - ('.'+i.substr(prec)));
                        i = i.substr(0, prec);
                        if(o) {
                        if(prec) i = (+i+1)+'';
                        else     m = (+m+1)+'';
                        }
                    } else
                    if(i.length < prec && !o) {
                        i += (new Array(prec - i.length + 1)).join('0')
                    }
                }
            }

            if(term) {
                m = m.split('');
                o = m.splice(0,m.length%3||3).join('');
                while(m.length) o += term + m.splice(0,3).join('');
                m = o;
            }

            if(i != '') m += '.' + i;
            p = m;
        } else {
            p = String(p);
        }
        return p
    };

    /**
     * @param (mixed)       val  - value to parseFloat
     * @param (int|bool)    prec - nr of fraction digits to read from val
     * @param (string|bool) term - thousands separator
     * @param (object) save_format - where to save the used format for reading value
     */
    _cons.parseFloat =
    _prot.parseFloat = function (val, prec, term, save_format) {
        if(val instanceof xNumber) {
            if(save_format) {
                save_format.prec = val.prec;
                save_format.term = val.term;
                save_format.value = val.value;
            }
            return val.value;
        }

        if(val == null) return NaN;
        val = val.valueOf();
        if(val == null) return NaN;

        if(val.constructor != Number) {
            val = String(val);
        }
        // Read value and format info from formated string
        if(val.constructor == String) {
            var rt, rp;
            // read term from val
            val.indexOf(rt="`")>0 ||
            val.indexOf(rt="'")>0 ||
            val.indexOf(rt=" ")>0 || (rt='');

            if(term) {
                if(term === true) {
                    term = rt
                } else {            // replace term in val
                    if(term != ' ') val = val.replace(i=new RegExp('['+escape(term).replace(/%/g, '\\x')+']', 'g'), '');
                    if(!rt && term == ',') rt = term
                }
            } else {
                term = ''
            }

            // Sterge caracterele nenumerice
            val = val.replace(/[\s\x27\x60]+/g,'').match(/[-+]*([0-9,]*[\.]?[0-9]*)/)[1].replace(/,/g, (i=val.indexOf('.'))<0?'.':'');

            rp = (i=val.indexOf('.')) < 0 ? 0 : val.length - i - 1;
            if(prec === true)  prec = rp;
            else prec = safe_prec(prec);

            if(prec !== false && i >= 0) {
                if(prec < 0) {
                    if(rp > -prec) val = val.substr(0, i-prec+1);
                } else {
                    val = val.substr(0, i+prec+(prec>0));
                }
            }
            // Converteste to float
            val = parseFloat(val);
        } else {
            prec = safe_prec(prec);
        }
        if(val.constructor != Number) {
            val = parseFloat(val);
        }
        if(prec !== false) val = +val.toFixed(prec<0?-prec:+prec);
        if(save_format) {
            save_format.prec = prec;
            save_format.term = term === true || !term ? '' : String(term);
            save_format.value = val;
        }
        return val
    }
}(xNumber));
