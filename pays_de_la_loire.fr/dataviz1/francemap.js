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
    
    //palette = moduleD.obtenirPalette('#1d06ff', '#07b8fe', ratios);
    //palette = moduleD.obtenirPalette('#efefef', '#000000', ratios);
    
    moduleC.readTextFile('regions_sans_dom_licencies_par_sport10000_2012.csv', function (csvString) {
        var csvObject = moduleC.csvToObject(csvString), prop, s = '',
            premiereLigne = csvObject.firstLine,
            regions = premiereLigne,
            chiffres,
            i,
            ratiosTotalSport = [],
            ratiosTotauxSpotsRegions = {};
        
        for (i = 0; i < regions.length; i += 1) {
            ratiosTotalSport[i] = 0;
        }
        
        for (prop in csvObject) {
            if (csvObject.hasOwnProperty(prop) && prop.toString() !== "firstLine") {
                chiffres = csvObject[prop];
                for (i = 0; i < chiffres.length; i += 1) {
                    ratiosTotalSport[i] += parseFloat(chiffres[i], 10);
                }
            }
        }
        
        for (i = 0; i < regions.length; i += 1) {
            ratiosTotauxSpotsRegions[regions[i]] = ratiosTotalSport[i];
        }
        
        for (prop in ratiosTotauxSpotsRegions) {
            if (ratiosTotauxSpotsRegions.hasOwnProperty(prop)) {
                s += prop + " : " + ratiosTotauxSpotsRegions[prop] + "\n";
            }
        }
        palette = moduleD.obtenirPalette('#000000', '#efefef', ratiosTotauxSpotsRegions);
        map.series.regions[0].setValues(palette);
        //alert(s);
    });
    
    
});