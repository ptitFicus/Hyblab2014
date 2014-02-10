/*jslint browser: true*/
/*global $, jQuery, jvm, alert, moduleDegrade, moduleCSV*/
var map,
    donnees,
    moduleD;
$(document).ready(function () {
    'use strict';
    var colors = {},
        key,
        ratios = {},
        palette,
        moduleC = moduleCSV();
    
    map = new jvm.WorldMap({
        map: 'fr_mill_en',
        container: $('#francemap'),
        series: {
            regions: [{
                attribute: 'fill'
            }]
        },
        backgroundColor: '#FFFFFF'
    });
    
    moduleD = moduleDegrade();
    
    // Lecture du fichier csv
    moduleC.readTextFile('regions_sans_dom_licencies_par_sport10000_2012.csv', function (csvString) {
        var csvObject = moduleC.csvToObject(csvString), prop, s = '',
            premiereLigne = csvObject.firstLine,
            regions = premiereLigne,
            chiffres,
            i,
            ratiosTotalSport = [],
            ratiosTotauxSpotsRegions = {};
        donnees = csvObject;
        afficherTousSports()
    });
    
    
});


function afficherTousSports() {
    'use strict';
    var ratiosTotalSport = [],
        i,
        regions = donnees.firstLine,
        prop,
        chiffres,
        ratiosTotauxSpotsRegions = {},
        palette;
    
    for (i = 0; i < regions.length; i += 1) {
        ratiosTotalSport[i] = 0;
    }
        
    for (prop in donnees) {
        if (donnees.hasOwnProperty(prop) && prop.toString() !== "firstLine") {
            chiffres = donnees[prop];
            for (i = 0; i < chiffres.length; i += 1) {
                ratiosTotalSport[i] += parseFloat(chiffres[i], 10);
            }
        }
    }

    for (i = 0; i < regions.length; i += 1) {
        ratiosTotauxSpotsRegions[regions[i]] = ratiosTotalSport[i];
    }

    palette = moduleD.obtenirPalette('#000000', '#efefef', ratiosTotauxSpotsRegions);
    map.series.regions[0].setValues(palette);
}

function afficherSport(sport) {
    'use strict';
    var prop,
        regions = donnees.firstLine,
        chiffres,
        i,
        ratios = {},
        palette;
    sport = sport.toString();
    sport = sport.replace(/ /g, "_");
    for (prop in donnees) {
        if (donnees.hasOwnProperty(prop)) {
            if (prop.toString() === sport) {
                chiffres = donnees[prop];
            }
        }
    }
    
    if (chiffres === undefined) {
        afficherTousSports();
    } else {
        for (i = 0; i < regions.length; i += 1) {
            ratios[regions[i]] = parseInt(chiffres[i], 10);
        }
        palette = moduleD.obtenirPalette('#000000', '#dfdfdf', ratios);
        map.series.regions[0].setValues(palette);
    }
}