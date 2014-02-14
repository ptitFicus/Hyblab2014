/*jslint browser: true*/
/*global $, jQuery, jvm, alert, moduleDegrade, moduleCSV*/

var regionClickEvent = function () {"use strict"; };
regionClickEvent.isDefaultPrevented = function () {"use strict"; };

// Variables globales
var map, donnees, moduleD;			// pour la carte
var chart;							// référence le diagramme
var donneesGeneralesC;				// toutes les données du csv (10 000 hab), pour le diagramme
var donneesTousLesSportsC = [];		// données pour tous les sports (10 000 hab), pour le diagramme
var regionsDeBaseC = [];			// régions dans l'ordre alphabétique (10 000 hab), pour le diagramme
var regionsC = [];					// régions, pour le diagramme (10 000 hab)
var donneesC = [];					// données, pour le diagramme (10 000 hab)
var paletteDiagramme;						// couleurs, pour le diagramme
var sportSelectionne = 'Tous les sports';	// pour le diagramme
var regionGagnante = '';                    // région ayant la coupe du nombre de licenciés pour le sport sélectionné
var modeGlobal = true;						// tous les sports ou non
var regionCliquee = 'Tous les sports';		// pour le diagramme
var donneesGeneralesBrutes;         // toutes les données du csv (total)
var donneesParSportsBrutes;         // chiffres de licenciés (total) par sport
var sports;                         // liste des sports
var totalLicenciesTousLesSports;    // pour le compteur
var couleurMin = "#ffffff";         // pour le dégardé de couleur
var couleurMax = "#000000";         // pour le dégradé de couleur


// ------------------------------------------------------------------------------
// initiation cartes/lecture fichiers csv
$(document).ready(function () {
    // MAP -------------------------------------
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
        borderColor: "#000000",
        selectedColor: null,
        enableZoom: true,
        showTooltip: true,
        //scaleColors: ["#ffffff", "#000000"],
		onRegionClick: function (element, code, region) {
			cliqueSurRegion(code);
		}
    });    
    moduleD = moduleDegrade();
    
    
    // ------------------------------------------------------------------------------------------------
	// Lecture du fichier csv (10 000 hab)-------------------------------------------------------------
    moduleC.readTextFile('donnees/regions_sans_dom_licencies_par_sports10000_2012.csv',function (csvString){        
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
			if ((compteur > 0) && (csvObject.hasOwnProperty(prop))) {
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
	
		chart.yAxis[0].setExtremes(minDataValue(), maxDataValue());
		chart.series[0].update({
			data: dataDiagramme
		});
		chart.xAxis[0].setCategories(regionsC);
    });   	
    
    
    
    // ------------------------------------------------------------------------------------------------
    // Lecture du fichier csv (nb de licencies total)--------------------------------------------------
    moduleC.readTextFile('donnees/regions_sans_dom_licencies_par_sport_2012.csv', function (csvString) {        
        var csvObject = moduleC.csvToObject(csvString), prop;
        donneesGeneralesBrutes = csvObject;

        var compteur=0, i=0;
        totalLicenciesTousLesSports = 0;
        sports = new Array();
        donneesParSportsBrutes = new Array();
		for (prop in csvObject) {
            if (compteur > 0) {
                sports.push(prop);      // récupération des sports
                donneesParSportsBrutes.push(0);
                var ligne = csvObject[prop];
                for (var j=0; j<regionsC.length; j++) {
                    donneesParSportsBrutes[i] += parseInt(ligne[j]);
                    totalLicenciesTousLesSports += parseInt(ligne[j]);
                }
                i++;
            }
            compteur++;
        }        
        majCompteur(totalLicenciesTousLesSports);
    });
});


// pour le responsive
window.onresize = function () {
    "use strict";
    setTimeout(function () {
        var obj = {},
            img = "<img src='img/trophy.png' style='width:20px' />";
        obj[regionGagnante] = img;
        $('.jqvmap_pin').remove();
        $('#francemap').vectorMap("placePins", obj, "content");
    }, 0);
};


// Après clique sur une région (switch diagramme <--> infosRegions)
var diagramme = true;
function cliqueSurRegion(region) {
	
    // si le diagramme est affiché, ou si on clique sur une nouvelle région
	if (diagramme || (region != regionCliquee) ) {	
			
			var htmlInfosRegions = "<b>"+region+"</b><p><p><hr>";
        
			if (modeGlobal) {
				// TODO
				htmlInfosRegions = htmlInfosRegions+"Mode global... TODO !!";
			}
			else {
				// TODO
				htmlInfosRegions = htmlInfosRegions+"Mode sport :"+sportSelectionne+"... TODO !!";
			}
			
		document.getElementById("container").innerHTML = htmlInfosRegions;
		diagramme = false;
	}
    
    // si on reclique sur la même région
	else {
		chart.destroy;		
		creerDiagramme();
		var dataDiagramme = new Array();
		for (var i=0; i<regionsC.length; i++) {
			dataDiagramme.push({y:donneesC[i], color:paletteDiagramme[regionsC[i]] });
		}
	
		chart.yAxis[0].setExtremes(minDataValue(), maxDataValue());
		chart.series[0].update({
			data: dataDiagramme
		});
		chart.xAxis[0].setCategories(regionsC);

		diagramme = true;
	}
	
	regionCliquee = region;
}




// ------------------------------------------------------------------------------
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





// ------------------------------------------------------------------------------
// Pour afficher tous les sports sur la carte
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
        img = "<img src='img/trophy.png' style='width:20px' />";
    
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

    //palette = moduleD.obtenirPalette('#000000', '#efefef', ratiosTotauxSpotsRegions);
    palette = moduleD.obtenirPalette(couleurMax, couleurMin, ratiosTotauxSpotsRegions);
	paletteDiagramme = palette;        // pour le diagramme    
    $('#francemap').vectorMap("setColors", palette);
    obj[regionGagnante] = img;
    $('.jqvmap_pin').remove();
    $('#francemap').vectorMap("placePins", obj, "content");    
}





// ------------------------------------------------------------------------------
// Après sélection d'un nouveau sport (maj carte + diagramme + compteur)
function afficherSport(sportSelect) {
    // MAP -----------------------
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
        img = "<img src='img/trophy.png' style='width:20px' />";

    sportSelect = sportSelect.toString();
    sportSelect = sportSelect.replace(/ /g, "_");
    for (prop in donnees) {
        if (donnees.hasOwnProperty(prop)) {
            if (prop.toString() === sportSelect) {
                chiffres = donnees[prop];
            }
        }
    }
    
	
    
    // Choix tous les sports -------------------------------------
    if (chiffres === undefined) {
        // carte
		afficherTousSports();	
		modeGlobal = true;
		
		// diagramme
		for (var i=0; i<donneesTousLesSportsC.length; i++) {
				donneesC[i] = donneesTousLesSportsC[i];	
		}
    } 
    
    
    // Choix d'un sport ------------------------------------------
    else {		
		modeGlobal = false;
	
		// carte
        for (i = 0; i < regions.length; i += 1) {
            ratios[regions[i]] = parseInt(chiffres[i], 10);
            if (ratios[regions[i]] > max) {
                max = ratios[regions[i]];
                regionGagnante = regions[i];
            }
        }
        //palette = moduleD.obtenirPalette('#000000', '#dfdfdf', ratios);
        palette = moduleD.obtenirPalette(couleurMax, couleurMin, ratios);
        paletteDiagramme = palette;        
        $('#francemap').vectorMap("setColors", palette);
        obj[regionGagnante] = img;
        $('.jqvmap_pin').remove();
        $('#francemap').vectorMap("placePins", obj, "content");
		
		// diagramme
		for (prop in donneesGeneralesC) {
			if (donneesGeneralesC.hasOwnProperty(prop)) {
				if (prop.toString() === sportSelect) {
					for (var i=0; i<donneesGeneralesC[prop].length; i++) {
						donneesC[i] = parseInt(donneesGeneralesC[prop][i]);
					}
				}
			}
		}
    }
	
	
    
    // Diagramme ------------------------------------------------
	sportSelectionne = sportSelect;
	
	if (diagramme == false) {		
		chart.destroy;		
		creerDiagramme();
		diagramme = true;
	}
	
	chart.setTitle( { text: sportSelect }, {text: ''} );		
					
	for (var i=0; i<regionsC.length; i++) {
		regionsC[i] = regionsDeBaseC[i];
	}

	trierDonnees();
	
	var dataDiagramme = new Array();
	for (var i=0; i<regionsC.length; i++) {
		dataDiagramme.push({y:donneesC[i], color:paletteDiagramme[regionsC[i]] });
	}
	
	chart.yAxis[0].setExtremes(minDataValue(), maxDataValue());
	chart.series[0].update({
		data: dataDiagramme
	});
	chart.xAxis[0].setCategories(regionsC);
    
    
    
    // compteur ------------------------------------------------
    if (chiffres == undefined) {
        majCompteur(totalLicenciesTousLesSports);
    }
    else {
        majCompteur(donneesParSportsBrutes[sports.indexOf(sportSelect)]);
    }
}




// Création/configuration du diagramme ---------------------------------------------------------------------
function creerDiagramme(){
	(function($){ // encapsulate jQuery
		$(function () {
				chart = new Highcharts.Chart({
					chart: {
						renderTo: 'container',
						type: 'bar',
                        //borderWidth: 1,
                        backgroundColor: null,      // transparent, permet de mettre une image derrière, par exemple
                        borderColor: "#ffffff"
					},
					title: {
						text: sportSelectionne
					},
					xAxis: {
						categories: regionsC,
						tickmarkPlacement: 'on',
						labels: { 
							align: 'left',
							useHTML: true,
							formatter: function() {
                                //var nomRegion = (""+(this.value)).substring(0,16);
                                var nomRegion = this.value;
                                if (this.value == "Provences-Alpes-Cote-d-Azur") { nomRegion = "PACA"; }
                                else if (this.value == "Languedoc-Roussillon") { nomRegion = "Lang. Roussillon"; }
                                else if (this.value == "Champagne-Ardenne") { nomRegion = "Champ. Ardenne"; }
								return '&nbsp;&nbsp;&nbsp;'+nomRegion;
							},
							style: {
								color: 'red',
							}
							//enabled: false
							//step: 1 
						},
						min: 0,
						max: 7
					},
					scrollbar: {
						enabled: true,
						barBackgroundColor: 'gray',
						barBorderRadius: 7,
						barBorderWidth: 0,
						buttonBackgroundColor: 'gray',
						buttonBorderWidth: 0,
						buttonArrowColor: 'white',
						buttonBorderRadius: 7,
						rifleColor: 'white',
						trackBackgroundColor: 'white',
						trackBorderWidth: 1,
						trackBorderColor: 'silver',
						trackBorderRadius: 7,
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
						/*startOnTick: 1,
						endOnTick:5,*/
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


function maxDataValue() {
	var max = 0;
	for (var i=0; i<donneesC.length; i++) {
		if (donneesC[i] > max) {
			max = donneesC[i];
		}
	}
	
	return max;
}




// compteur ------------------------------------------------------
function majCompteur(value) {
    setTimeout(function(){
        odometer.innerHTML = value;
    }, 1);
}