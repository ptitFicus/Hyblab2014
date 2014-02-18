/*jslint browser: true*/
/*global $, alert, Highcharts, moduleCSV */

var donneesDpt;
var selectedSportDtp = "tous";
var selectedDpt;

function handleDptSportChange(sport) {
    'use strict';
    selectedSportDtp = sport;
    if(selectedDpt !== undefined) {
        receptionnerCliqueDepartement(selectedDpt, selectedSportDtp);
    }
}

/**
 * Lit les fichiers de données des départements pour initialiser la variable donneesDpt
 */
function lireFichiersDpt() {
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
            }
        };
    moduleC.readTextFile('dataviz2/departements_PDL_licencies_par_sport_' + annee + '.csv', fInit);
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
    var donnees = obtenirHistorique(departement, sport);
    $('#courbeDpt').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent'
        },
        exporting: { enabled: false },
        title: {
            text: 'Evolution du nombre de licenciés du sport dans la région'
        },
        xAxis: [{
            categories: ['2009', '2010', '2011', '2012']
        }],
        yAxis: {
            title: {
                text: 'Nombre de licenciés'
            }
        },
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
}






$(document).ready(function () {
    'use strict';
    
    lireFichiersDpt();
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
    svg.setAttribute("viewBox", "350 100 400 400");
});