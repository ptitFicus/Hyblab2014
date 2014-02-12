/*jslint browser: true*/
/*global $, jQuery, jvm, alert, moduleDegrade, moduleCSV*/

var regionClickEvent = function () {"use strict"; };
regionClickEvent.isDefaultPrevented = function () {"use strict"; };

// Variables globales
var map, donnees, moduleD;					// pour la carte
var chart;									// pour le diagramme
var donneesGeneralesC;						// toutes les données du csv, pour le diagramme
var donneesTousLesSportsC = [];	// données pour tous les sports, pour le diagramme
var regionsDeBaseC = [];			// régions dans l'ordre alphabétique, pour le diagramme
var regionsC = [];					// pour le diagramme
var donneesC = [];					// pour le diagramme
var paletteDiagramme;						// pour le diagramme
var sportSelectionne = 'Tous les sports';	// pour le diagramme
var regionGagnante = ''; // Région ayant la coupe du nombre de licenciés pour le sport sélectionné

	
$(document).ready(function () {
    'use strict';
    var colors = {},
        key,
        ratios = {},
        palette,
        moduleC = moduleCSV();
    
    $('#francemap').vectorMap({
        map: 'france_fr',
        hoverOpacity: 0.5,
        hoverColor: null,
        backgroundColor: "#ffffff",
        color: "#ffffff",
        borderColor: "#ffffff",
        selectedColor: null,
        enableZoom: true,
        showTooltip: true,
        scaleColors: ["#ffffff", "#000000"]
    });
    
    moduleD = moduleDegrade();
    
    
	// Lecture du fichier csv ------------------------------------------------
    moduleC.readTextFile('donnees/regions_sans_dom_licencies_par_sport10000_2012.csv', function (csvString) {
        
		// MAP -----------------------------------------
	    var csvObject = moduleC.csvToObject(csvString), prop, s = '',
            premiereLigne = csvObject.firstLine,
            regions = premiereLigne,
            chiffres,
            i,
            ratiosTotalSport = [],
            ratiosTotauxSpotsRegions = {};
        donnees = csvObject;
        afficherTousSports();
		
		
		// DIAGRAMME ----------------------------------
		donneesGeneralesC = csvObject;

		// Récupération des régions
		for (i = 0; i < premiereLigne.length; i += 1) {
			regionsC.push(premiereLigne[i]);
			regionsDeBaseC.push(premiereLigne[i]);
		}
			
		// Initialisation du tableau de données (une case par région)
		for (i = 0; i < regionsC.length; i += 1) {
			donneesC.push(0);
			donneesTousLesSportsC.push(0);
		}
		
		// Récupération des données (globales, cad somme pour tous les sports)
		var compteur = 0;
		for (prop in csvObject) {
			if ( (compteur>0) && (csvObject.hasOwnProperty(prop))) {
				var ligne = csvObject[prop];
				for (var i=0; i<regionsC.length; i++) {
					donneesC[i] += parseInt(ligne[i]);
					donneesTousLesSportsC[i] += parseInt(ligne[i]);
				}				
			}
			compteur++;
		}
		
		trierDonnees();
	
		var dataDiagramme = new Array();
		for (var i=0; i<regionsC.length; i++) {
			dataDiagramme.push({y:donneesC[i], color:paletteDiagramme[regionsC[i]] });
		}
	
		chart.yAxis[0].setExtremes(minDataValue(), null);
		chart.series[0].update({
			data: dataDiagramme
		});
		chart.xAxis[0].setCategories(regionsC);
    });   	
});


function resizeMap() {
    "use strict";
    var viewportWidth     = window.innerWidth,
        viewportHeight    = window.innerHeight;
    if (viewportWidth > 500) {
        document.getElementById('francemap').style.width  = Math.floor((viewportWidth/2)- 100) + "px";
        document.getElementById('francemap').style.height = Math.floor((viewportHeight/2)) + "px";
    } else {
        document.getElementById('francemap').style.width  = Math.floor((viewportWidth)- 100) + "px";
        document.getElementById('francemap').style.height = Math.floor((viewportHeight)) + "px";
    }
}

window.onresize = function () {
    "use strict";
	resizeMap();
    setTimeout(function () {
        var obj = {},
            img = "<img src='./img/trophy.png' style='width:20px' />";
        obj[regionGagnante] = img;
        $('.jqvmap_pin').remove();
        $('#francemap').vectorMap("placePins", obj, "content");
    }, 0);
};

// fonction à appliquer quand l'utilisateur clique sur une région (switcher de l'histogramme vers les infos sur la région)
var diagramme = true, premiereFois=true;
function cliqueSurRegion() { // TODO récupérer, au clique, le nom de la région
	
	if (premiereFois) { 
		htmlDiagramme = document.getElementById("container").innerHTML;
		premiereFois = false;
	}

	var htmlInfosRegions = "<b>TODO</b><p><p><hr>..."; // TODO en fonction de la région et du mode (global ou sport)
	
	if (diagramme) {			
		document.getElementById("container").innerHTML = htmlInfosRegions;
		diagramme = false;
	}
	else {
		chart.destroy;		
		creerDiagramme();
		var dataDiagramme = new Array();
		for (var i=0; i<regionsC.length; i++) {
			dataDiagramme.push({y:donneesC[i], color:paletteDiagramme[regionsC[i]] });
		}
	
		chart.yAxis[0].setExtremes(minDataValue(), null);
		chart.series[0].update({
			data: dataDiagramme
		});
		chart.xAxis[0].setCategories(regionsC);

		diagramme = true;
	}

}


// fonction de tri (à bulles) des données/régions pour le diagramme
function trierDonnees() {
var changement = true;
	while (changement) {
		changement = false;
		for (var i=0; i<regionsC.length-1; i++) {
			if (donneesC[i] < donneesC[i+1]) {
				var tmp1 = regionsC[i];
				var tmp2 = donneesC[i];
				regionsC[i] = regionsC[i+1];
				donneesC[i] = donneesC[i+1];
				regionsC[i+1] = tmp1;
				donneesC[i+1] = tmp2;
				changement = true;
			}
		}
	}
}


// afficher tous les sports sur la carte
function afficherTousSports() {
    'use strict';
    var ratiosTotalSport = [],
        i,
        regions = donnees.firstLine,
        prop,
        chiffres,
        ratiosTotauxSpotsRegions = {},
        palette,
        max = 0,
        obj = {},
        img = "<img src='./img/trophy.png' style='width:20px' />";
    
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
        if (ratiosTotalSport[i] > max) {
            max = ratiosTotalSport[i];
            regionGagnante = regions[i];
        }
    }

    palette = moduleD.obtenirPalette('#000000', '#efefef', ratiosTotauxSpotsRegions);
	paletteDiagramme = palette;
    
    palette = moduleD.obtenirPalette('#000000', '#ffffff', ratiosTotauxSpotsRegions);
    //$('#francemap').vectorMap("setValues", ratiosTotauxSpotsRegions);
    $('#francemap').vectorMap("setColors", palette);
    obj[regionGagnante] = img;
    $('.jqvmap_pin').remove();
    $('#francemap').vectorMap("placePins", obj, "content");
    
}



// après sélection d'un nouveau sport (carte + diagramme)
function afficherSport(sport) {
    'use strict';
    var prop,
        regions = donnees.firstLine,
        chiffres,
        i,
        ratios = {},
        palette,
        max = 0,
        gagnant,
        obj = {},
        img = "<img src='./img/trophy.png' style='width:20px' />";

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
        // carte
		afficherTousSports();		
		
		// diagramme
		for (var i=0; i<donneesTousLesSportsC.length; i++) {
				donneesC[i] = donneesTousLesSportsC[i];	
		}
    } else {
		// carte
        for (i = 0; i < regions.length; i += 1) {
            ratios[regions[i]] = parseInt(chiffres[i], 10);
            if (ratios[regions[i]] > max) {
                max = ratios[regions[i]];
                regionGagnante = regions[i];
            }
        }
        palette = moduleD.obtenirPalette('#000000', '#dfdfdf', ratios);
        paletteDiagramme = palette;
        
        //$('#francemap').vectorMap("setValues", ratios);
        $('#francemap').vectorMap("setColors", palette);
        obj[regionGagnante] = img;
        $('.jqvmap_pin').remove();
        $('#francemap').vectorMap("placePins", obj, "content");
		
		// diagramme
		for (prop in donneesGeneralesC) {
			if (donneesGeneralesC.hasOwnProperty(prop)) {
				if (prop.toString() === sport) {
					for (var i=0; i<donneesGeneralesC[prop].length; i++) {
						donneesC[i] = parseInt(donneesGeneralesC[prop][i]);
					}
				}
			}
		}
    }
	
	sportSelectionne = sport;
	chart.setTitle( { text: sport }, {text: ''} );		
					
	for (var i=0; i<regionsC.length; i++) {
		regionsC[i] = regionsDeBaseC[i];
	}

	trierDonnees();
	
	var dataDiagramme = new Array();
	for (var i=0; i<regionsC.length; i++) {
		dataDiagramme.push({y:donneesC[i], color:paletteDiagramme[regionsC[i]] });
	}
	
	chart.yAxis[0].setExtremes(minDataValue(), null);
	chart.series[0].update({
		data: dataDiagramme
	});
	chart.xAxis[0].setCategories(regionsC);
}



/* Diagramme ------------------------------------------------------------------------- */
function creerDiagramme(){
	(function($){ // encapsulate jQuery
		$(function () {
				chart = new Highcharts.Chart({
					chart: {
						renderTo: 'container',
						type: 'bar',
						borderWidth: 1,
					},
					title: {
						text: sportSelectionne
					},
					xAxis: {
						categories: regionsC,
						tickmarkPlacement: 'on',
						labels: { 
							step: 1 
						}
					},
					yAxis: {			
						title: {
							text: 'Nombre de licenciés (pour 10 000 habitants)',
							align: 'high'
						},
						labels: {
							overflow: 'justify'
						},
						gridLineWidth: 0,
						startOnTick: false,
						endOnTick:false
					},
					series: [{
						name: '2012',
						data: donneesC,
						dataLabels: {
							enabled: false
						},
						cursor: 'pointer',
						point: {
							events: {
								click: function() {
									chart.setTitle(null, {text:this.category +', '+ this.y+' licenciés pour 10 000 habitants'});
								}
							}
						},
					}],
					exporting: {
						enabled : false
					},
					plotOptions: {
						bar: {
							dataLabels: { 
								enabled: true 
							}
						}
					},
					legend: { 
						enabled: false 
					},
					credits: {
						enabled: false
					},
					tooltip: { 
						enabled: false 
					}
				});
			});
		})
	(jQuery);
}
creerDiagramme();



function minDataValue() {
	var min = 1000000;
	for (var i=0; i<donneesC.length; i++) {
		if (donneesC[i] < min) {
			min = donneesC[i];
		}
	}
	
	return min-min/10;
}