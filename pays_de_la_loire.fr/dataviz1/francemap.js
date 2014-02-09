/*jslint browser: true*/
/*global $, jQuery, jvm, alert, moduleDegrade, moduleCSV*/
$(document).ready(function () {
    'use strict';
    var colors = {},
        key,
        map = new jvm.WorldMap({
            map: 'fr_mill_en',
            container: $('#francemap'),
            series: {
                regions: [{
                    attribute: 'fill'
                }]
            },
            backgroundColor: '#FFFFFF'
        }),
        ratios = {},
        palette,
        moduleD = moduleDegrade(),
        moduleC = moduleCSV();
    
    // Lecture du fichier csv
    for (key in map.regions) {
        if (map.regions.hasOwnProperty(key)) {
            ratios[key] = Math.random();
        }
    }
    
    palette = moduleD.obtenirPalette('#FF4477', ratios);
    
    moduleC.readTextFile('regions_sans_dom_licencies_par_sport_2012.csv', function (csvString) {
        var csvObject = moduleC.csvToObject(csvString), prop, s = '',
            premiereLigne = csvObject.firstLine;
        for (prop in csvObject) {
            if (csvObject.hasOwnProperty(prop)) {
                s += prop + " : " + csvObject[prop] + "\n";
            }
        }
        alert(s);
    });
    
    map.series.regions[0].setValues(palette);
});