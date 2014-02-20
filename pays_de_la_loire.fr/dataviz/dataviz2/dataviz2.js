/*jslint browser: true*/
/*global $, alert, Highcharts, moduleCSV */

var donneesDpt;
var selectedSportDtp = "tous";
var selectedDpt = "Loire-Atlantique";
var sportsPDL;

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
    var donnees,
        i,
        min = 10000000;
    selectedDpt = departement;
    document.getElementById('nomDepartementTexte').innerHTML = departement;
    donnees = obtenirHistorique(departement, sport);
    
    for (i = 0; i<4 ; i += 1) {
        if (donnees[i] < min) {
            min = donnees[i];
        }
    }
    
    $('#courbeDpt').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Abel',
            }
        },
        exporting: { enabled: false },
        title: {
            //text: 'Nombre de licenciés pour 10 000 habitants',
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
            min: min - min/10,
            minRange: 0.1,
            title: {
                //text: 'Nombre de licenciés pour 10 000 habitants'
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
        credits: {
            enabled: false,
        },
        series: [{
            type: 'line',
            //name: 'Nombre de licenciés pour 10 000 habitants',
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
    sportsPDL = new Array();
    
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
                if (annee == 2012 && prop.toString() !== "firstLine" && prop.toString() != "Federations_multisports_affinitaires" ) { 
                    sportsPDL.push(prop); 
                }
                
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
                //moduleC.readTextFile('dataviz2/departements_PDL_licencies10000_par_sport_' + annee + '.csv', fInit);
            } else {
                callback();
            }
        };
    moduleC.readTextFile('dataviz2/departements_PDL_licencies_par_sport_' + annee + '.csv', fInit);
    //moduleC.readTextFile('dataviz2/departements_PDL_licencies10000_par_sport_' + annee + '.csv', fInit);
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





/*function sportDominant(departement) {
    'use strict';
    var i,
        max,
        sportMax;
    
    max = 0;
    for (i = 0; i<sportsPDL.length ; i++) {
        if ( donneesDpt[2012][departement][sportsPDL[i]] > max )  {
            max = donneesDpt[2012][departement][sportsPDL[i]];
            sportMax = sportsPDL[i];
        }
    }
    
   return sportMax;
}*/