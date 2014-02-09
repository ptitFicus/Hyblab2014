var moduleDegrade = function () {
    'use strict';
    /**
     * Convert hexa char to it value in base 10
     */
    function hexaChartoInt(char) {
        if (typeof char !== 'string' || char.length !== 1) {
            throw ("Not an hexa character");
        }
        
        var ret;
        char =  char.toUpperCase();
        
        switch (char) {
        case '0':
            ret = 0;
            break;
        case '1':
            ret = 1;
            break;
        case '2':
            ret = 2;
            break;
        case '3':
            ret = 3;
            break;
        case '4':
            ret = 4;
            break;
        case '5':
            ret = 5;
            break;
        case '6':
            ret = 6;
            break;
        case '7':
            ret = 7;
            break;
        case '8':
            ret = 8;
            break;
        case '9':
            ret = 9;
            break;
        case 'A':
            ret = 10;
            break;
        case 'B':
            ret = 11;
            break;
        case 'C':
            ret = 12;
            break;
        case 'D':
            ret = 13;
            break;
        case 'E':
            ret = 14;
            break;
        case 'F':
            ret = 15;
            break;
        default:
            throw ("Not an hexa character");
        }
        
        return ret;
    }
    
    /**
     * Convert hexa number to base 10
     */
    function hexaStringToInt(hexa) {
        if (typeof hexa !== 'string') {
            throw ('Not an hexadecimal string');
        }
        var size = hexa.length,
            index = 0,
            value = 0,
            mult = Math.pow(16, size - 1);
        
        if (hexa[0] === '#') {
            index = 1;
            mult = mult / 16;
        }
        
        for (index; index < size; index += 1) {
            value += hexaChartoInt(hexa[index]) * mult;
            mult = mult / 16;
        }
        
        return value;
    }
    function numberToHexChar(number) {
        if (typeof number !== 'number' || number > 15) {
            throw ("Unable to convert " + number + " to hexa char");
        }
        var ret;
        switch (number) {
        case 10:
            ret = 'A';
            break;
        case 11:
            ret = 'B';
            break;
        case 12:
            ret = 'C';
            break;
        case 13:
            ret = 'D';
            break;
        case 14:
            ret = 'E';
            break;
        case 15:
            ret = 'F';
            break;
        default:
            ret = number.toString();
        }
        return ret;
    }
    
    
    
    function intToHexString(int) {
        var res = '',
            resModulo = 1,
            resDivision = int,
            number = int;
    
        while (resDivision > 0) {
            resModulo = resDivision % 16;
            resDivision = Math.floor(resDivision / 16);
            res += numberToHexChar(resModulo);
        }
        
        return (res.split("").reverse().join(""));
    }
    
    return {
        obtenirPalette : function (couleurBase, listeRatios) {
            var valeurRouge = 255 - hexaStringToInt(couleurBase.substring(1, 3)),
                valeurVerte = 255 - hexaStringToInt(couleurBase.substring(3, 5)),
                valeurBleue = 255 - hexaStringToInt(couleurBase.substring(5, 7)),
                prop,
                max = 0,
                palette = {},
                nouvelleValeurRouge,
                nouvelleValeurBleue,
                nouvelleValeurVerte,
                res,
                diff;
            
            // Looking for the maximum ratio
            for (prop in listeRatios) {
                if (listeRatios.hasOwnProperty(prop)) {
                    if (listeRatios[prop] > max) {
                        max = listeRatios[prop];
                    }
                }
            }
            
            for (prop in listeRatios) {
                if (listeRatios.hasOwnProperty(prop)) {
                    res = '#';
                    
                    // Building new Color
                    nouvelleValeurBleue = 255 - Math.floor((listeRatios[prop] * valeurBleue) / max);
                    
                    nouvelleValeurVerte = 255 - Math.floor((listeRatios[prop] * valeurVerte) / max);
                    
                    nouvelleValeurRouge = 255 - Math.floor((listeRatios[prop] * valeurRouge) / max);
                    
                    res += intToHexString(nouvelleValeurRouge);
                    res += intToHexString(nouvelleValeurVerte);
                    res += intToHexString(nouvelleValeurBleue);
                    
                    //alert(prop + "\n"+"VR : "+valeurRouge+" VB : "+valeurBleue+" VR : "+valeurVerte +"\nNVR : "+nouvelleValeurRouge+ " NVB : "+ nouvelleValeurBleue + " NVR : " + nouvelleValeurVerte)
                    
                    palette[prop] = res;
                }
            }
            
        /*    var s = '';
            
            for (prop in palette) {
                if (palette.hasOwnProperty(prop)) {
                    s += prop + ' : ' + palette[prop] + '\n';
                }
            }
            
            alert(s);*/
            
            return palette;
        }
    };
};