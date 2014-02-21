/*jslint browser: true*/
/*global $, alert */

/** 
 * Change l'année de la dataviz des podiums
 */
function changerAnneePodium(annee, interval) {
    'use strict';
    annee = parseInt(annee, 10);
    var debut = parseInt(interval[0], 10),
        fin = parseInt(interval[1], 10),
        actuel = debut,
        prefixe;
    document.getElementById("imagePodium").src = "img/podiums/" + annee + ".svg";
    for (actuel = debut; actuel <= fin; actuel += 1) {
        if (actuel === annee) {
            prefixe = "c";
        } else {
            prefixe = "nc";
        }
        document.getElementById("img" + actuel).src = "img/podiums/" + prefixe + actuel.toString() + ".png";
    }
}