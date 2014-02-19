/*jslint browser: true*/
/*global $, alert, Highcharts, moduleCSV */

var donneesDpt;
var selectedSportDtp = "tous";
var selectedDpt = "Loire-Atlantique";


function majCompteurDpt(value) {
    'use strict';
    setTimeout(function () {
        document.getElementById('odometerDpt').innerHTML = value;
    }, 1);
}


function obtenirHistorique(departement, sport) {
    'use strict';
    var ret = [],
        annee;
    for (annee = 2009; annee <= 2012; annee += 1) {
        ret[annee - 2009] = donneesDpt[annee][departement][sport];
    }
    return ret;
}



function receptionnerCliqueDepartement(departement, sport) {
    'use strict';
    selectedDpt = departement;
    document.getElementById('nomDepartementTexte').innerHTML = departement;
    var donnees = obtenirHistorique(departement, sport);
    $('#courbeDpt').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent'
        },
        exporting: { enabled: false },
        title: {
            text: 'Nombre de licenciés',
            style: {
                color: '#D33C3D'
                //font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        xAxis: [{
            categories: ['2009', '2010', '2011', '2012']
        }],
        yAxis: [{ // Primary yAxis
            min: 0,
            minRange: 0.1,
            title: {
                text: 'Nombre de licenciés'
            }
        }],
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                lineWidth: 3,
                marker: {
                    enabled: true,
                    fillColor: "#ff0000"
                },
                threshold: null
            }
        },
        series: [{
            type: 'line',
            name: 'Nombre de licenciés',
            data: donnees
        }]
    });
    document.getElementById('courbeDpt').style.backgroundImage = 'url(img/background_highchart/' + sport + '.png)';
    majCompteurDpt(donnees[3]);
}



function handleDptSportChange(sport) {
    'use strict';
    selectedSportDtp = sport;
    if (selectedDpt !== undefined) {
        receptionnerCliqueDepartement(selectedDpt, selectedSportDtp);
    }
}

/**
 * Lit les fichiers de données des départements pour initialiser la variable donneesDpt
 */
function lireFichiersDpt(callback) {
    'use strict';
    donneesDpt = {};
    var moduleC = moduleCSV(),
        annee = 2009,
        fInit = function (csvString) {
            donneesDpt[annee] = {};
            var csvObject = moduleC.csvToObject(csvString),
                prop,
                i;
            
            for (i = 0; i < csvObject.firstLine.length; i += 1) {
                donneesDpt[annee][csvObject.firstLine[i]] = {};
            }
            
            for (prop in csvObject) {
                if (csvObject.hasOwnProperty(prop) && prop.toString() !== "firstLine") {
                    for (i = 0; i < csvObject[prop].length; i += 1) {
                        if (donneesDpt[annee][csvObject.firstLine[i]].tous === undefined) {
                            donneesDpt[annee][csvObject.firstLine[i]].tous = 0;
                        }
                        donneesDpt[annee][csvObject.firstLine[i]][prop] = parseInt(csvObject[prop][i], 10);
                        donneesDpt[annee][csvObject.firstLine[i]].tous += parseInt(csvObject[prop][i], 10);
                    }
                }
            }
            annee += 1;
            if (annee <= 2012) {
                moduleC.readTextFile('dataviz2/departements_PDL_licencies_par_sport_' + annee + '.csv', fInit);
            } else {
                callback();
            }
        };
    moduleC.readTextFile('dataviz2/departements_PDL_licencies_par_sport_' + annee + '.csv', fInit);
}










$(document).ready(function () {
    'use strict';
    
    lireFichiersDpt(function () {
        receptionnerCliqueDepartement(selectedDpt, selectedSportDtp);
    });
    $('#carte2').vectorMap({
        map: 'pays_de_la_loire',
        hoverOpacity: 0.5,
        hoverColor: null,
        backgroundColor: "#EAE9E5",
        color: "#218FB2",
        borderColor: null,
        selectedColor: null,
        enableZoom: false,
        showTooltip: true,
		onRegionClick: function (element, code, region) {
			receptionnerCliqueDepartement(code, selectedSportDtp);
		}
    });
    
    var carte = document.getElementById("carte2"),
        svg = carte.getElementsByTagName("svg")[0];
    svg.setAttribute("viewBox", "350 100 300 250");
});