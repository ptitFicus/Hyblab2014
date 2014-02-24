/*jslint browser: true*/
/*global $, jQuery, jvm, alert, moduleDegrade, moduleCSV, Highcharts, odometer, lisibilite_nombre*/

// Evite une erreur JavaScript au clique sur une région
var regionClickEvent = function () {"use strict"; };
regionClickEvent.isDefaultPrevented = function () {"use strict"; };

// Variables globales
var map, donnees, moduleD;			// pour la carte
var chart;							// référence le diagramme
var donneesGeneralesC;				// toutes les données du csv (10 000 hab), pour le diagramme
var donneesTousLesSportsC = [];		// données pour tous les sports (10 000 hab), pour le diagramme
var regionsDeBaseC = [];			// régions dans l'ordre alphabétique (10 000 hab), pour le diagramme
var regionsC = [];					// régions, pour le diagramme (10 000 hab)
var donneesC = [];		            // données, pour le diagramme (10 000 hab)
var paletteDiagramme;						// couleurs, pour le diagramme
var sportSelectionne = 'Tous les sports';	// pour le diagramme
var regionGagnante = '';                    // région ayant la coupe du nombre de licenciés pour le sport sélectionné
var modeGlobal = true;						// tous les sports ou non
var regionCliquee = 'France';		// pour le diagramme
var donneesGeneralesBrutes;         // toutes les données du csv (total)
var donneesParSportsBrutes;         // chiffres de licenciés (total) par sport
var sports;                         // liste des sports
var totalLicenciesTousLesSports;    // pour le compteur
var couleurMin = "#218FB2";         // pour le dégardé de couleur
var couleurMax = "#0D3D48";         // pour le dégradé de couleur
var img = "<img src='img/la_coupe.png' class='coupeCarte' />";
var diagramme = true;
var couleurDeFond = "#EAE9E5";
var bleuFonce = "#0F6377";
var bleuClair = "#218FB2";
var rouge = "#D33C3D";





// Création/configuration du diagramme ---------------------------------------------------------------------
function creerDiagramme() {
    'use strict';
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'bar',
            backgroundColor: null, // transparent, permet de mettre une image derrière, par exemple
            borderColor: couleurDeFond,
            style: {
                fontFamily: 'Abel'
            }
        },
        title: {
            text: sportSelectionne.replace(/_/g, " ")
        },
        xAxis: {
            categories: regionsC,
            tickmarkPlacement: 'on',
            labels: {
                align: 'left',
                useHTML: true,
                formatter: function () {
                    var nomRegion = this.value;
                    if (this.value === "Provences-Alpes-Cote-d-Azur") {
                        nomRegion = "PACA";
                    } else if (this.value === "Languedoc-Roussillon") {
                        nomRegion = "Lang. Roussillon";
                    } else if (this.value === "Champagne-Ardenne") {
                        nomRegion = "Champ. Ardenne";
                    }
                    return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + nomRegion;
                },
                style: {
                    color: "#EAE9E5"
                }
            },
            min: 0,
            max: 4
        },
        scrollbar: {
            enabled: true,
            barBackgroundColor: rouge,
            barBorderRadius: 7,
            barBorderWidth: 0,
            buttonBackgroundColor: rouge,
            buttonBorderWidth: 0,
            buttonArrowColor: couleurDeFond,
            buttonBorderRadius: 7,
            rifleColor: couleurDeFond,
            trackBackgroundColor: couleurDeFond,
            trackBorderWidth: 1,
            trackBorderColor: couleurDeFond,
            trackBorderRadius: 7
        },
        yAxis: {
            title: {
                text: 'Nombre de licenciés (pour 10 000 habitants)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
            gridLineWidth: 0
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
                    click: function () {
                        chart.setTitle(null, {text: this.category + ', ' + this.y + ' licenciés pour 10 000 habitants'});
                    }
                }
            }
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
}






function minDataValue() {
    'use strict';
	var min = 1000000,
        i;
	for (i = 0; i < donneesC.length; i += 1) {
		if (donneesC[i] < min) {
			min = donneesC[i];
		}
	}
	
	return min - min / 10;
}











function maxDataValue() {
    'use strict';
	var max = 0,
        i;
	for (i = 0; i < donneesC.length; i += 1) {
		if (donneesC[i] > max) {
			max = donneesC[i];
		}
	}
	
	return max;
}


function obtenirSportsDominants(region) {
    'use strict';
    var i,
        indexRegion,
        listeChiffresSport = [],
        listeNomsSports = [],
        sportMinimum = 1001,
        nomSportMinimum,
        j,
        valeurSport,
        retour = {},
        changement = true,
        tmp1,
        tmp2;
    
    for (i = 0; i < regionsDeBaseC.length; i += 1) {
        if (regionsDeBaseC[i] === region) {
            indexRegion = i;
            break;
        }
    }
    
    
    for (i in donnees) {
        if (donnees.hasOwnProperty(i) && i.toString() !== "Fédérations_multisports_affinitaires" && i.toString() !== "Autres_fédérations" && i.toString() !== "firstLine") {
            valeurSport = parseInt(donnees[i][indexRegion], 10);
            if (listeChiffresSport.length < 5) {
                listeChiffresSport.push(valeurSport);
                listeNomsSports.push(i);
                if (valeurSport < sportMinimum) {
                    sportMinimum  = valeurSport;
                    nomSportMinimum = i;
                }
            } else if (valeurSport > sportMinimum) {
                // On ajoute le sport à la liste
                listeChiffresSport.push(valeurSport);
                listeNomsSports.push(i);
                
                // On supprime le minimum actuel
                listeChiffresSport.splice(listeChiffresSport.indexOf(sportMinimum), 1);
                listeNomsSports.splice(listeNomsSports.indexOf(nomSportMinimum), 1);
                
                // On définie temporairement ce sport comme le minimum
                sportMinimum = valeurSport;
                nomSportMinimum = i;
                
                // Recherche du nouveau minimum
                for (j = 0; j < listeChiffresSport.length; j += 1) {
                    if (listeChiffresSport[j] < sportMinimum) {
                        sportMinimum = listeChiffresSport[j];
                        nomSportMinimum = listeNomsSports[j];
                    }
                }
            }
        }
    }
    
    // tri
    while (changement) {
        changement = false;
        for (i = 0; i < listeNomsSports.length - 1; i += 1) {
            if (listeChiffresSport[i] < listeChiffresSport[i + 1]) {
                tmp1 = listeChiffresSport[i];
                tmp2 = listeNomsSports[i];
                listeChiffresSport[i] = listeChiffresSport[i + 1];
                listeNomsSports[i] = listeNomsSports[i + 1];
                listeChiffresSport[i + 1] = tmp1;
                listeNomsSports[i + 1] = tmp2;
                changement = true;
            }
        }
    }
    
    retour.listeNomsSports = listeNomsSports;
    retour.listeChiffresSports = listeChiffresSport;
        
    return retour;
}


function obtenirPictoSport(sportSelect) {
    'use strict';
    if (sportSelect === "Golf") {
        return 'golf.png';
    } else if (sportSelect === "Athlétisme") {
        return 'athletisme.png';
    } else if (sportSelect === "Basketball") {
        return 'basket.png';
    } else if (sportSelect === "Sports_sous_marins") {
        return 'plongee.png';
    } else if (sportSelect === "Football") {
        return 'football.png';
    } else if (sportSelect === "Gymnastique") {
        return 'gymnastique.png';
    } else if (sportSelect === "Handball") {
        return 'handball.png';
    } else if (sportSelect === "Judo_jujitsu_et_disciplines_associées") {
        return 'judo.png';
    } else if (sportSelect === "Karaté_et_arts_martiaux_affinitaires") {
        return 'arts_martiaux.png';
    } else if (sportSelect === "Natation") {
        return 'natation.png';
    } else if (sportSelect === "Pétanque_et_jeu_provençal") {
        return 'petanque.png';
    } else if (sportSelect === "Randonnée_pédestre") {
        return 'rando.png';
    } else if (sportSelect === "Rugby") {
        return 'rugby.png';
    } else if (sportSelect === "Ski") {
        return 'ski.png';
    } else if (sportSelect === "Tennis") {
        return 'tennis.png';
    } else if (sportSelect === "Tennis_de_table") {
        return 'ping_pong.png';
    } else if (sportSelect === "Tir") {
        return 'tir.png';
    } else if (sportSelect === "Voile") {
        return 'voile.png';
    } else if (sportSelect === "Autres_fédérations") {
        return 'autres.png';
    } else {
        return 'equitation.png';
    }
}





// Après clique sur une région (switch diagramme <--> infosRegions)
function cliqueSurRegion(region) {
	'use strict';
    var htmlInfosRegions,
        dataDiagramme,
        i,
        sports,
        chiffres,
        nbBrut,
        nb10000,
        prop;
    
        
    // si le diagramme est affiché, ou si on clique sur une nouvelle région
	if (diagramme || (region !== regionCliquee)) {

        // on cache le compteur
        document.getElementById("compteur").style.display = "none";

        htmlInfosRegions = "<center><div style='text-align:center; display: table; background-image: url(img/bandeauRegions.png); width: 336px;height: 46px;'><div id='nomRegion'>" + region + "</div></div></center>";

        if (modeGlobal) {
            htmlInfosRegions += "<center><img src='img/legendes/nbLicences10000.png' width=150></center>";
            sports = obtenirSportsDominants(region).listeNomsSports;
            chiffres = obtenirSportsDominants(region).listeChiffresSports;
                        
            htmlInfosRegions += "<div align='center';><table>";
            htmlInfosRegions += "<tr>" +
                                    "<td><img src='img/1ere.png' width=90></td>" +
                                    "<td><img src='img/popmenu/" + obtenirPictoSport(sports[0]) + "' width=90></td>" +
                                    "<td><div class='celluleSport'><h1>" + chiffres[0] + "</h1></div></td>" +
                                "</tr>";
            htmlInfosRegions += "<tr>" +
                                    "<td></td>" +
                                    "<td><div class='celluleSport'><h2>" + chiffres[1] + "</h2></div></td>" +
                                    "<td><img src='img/popmenu/" + obtenirPictoSport(sports[1]) + "' width=80></td>" +
                                    "<td><img src='img/2eme.png' width=50></td>" +
                                "</tr>";
            htmlInfosRegions += "<tr>" +
                                    "<td align='right'><img src='img/3eme.png' width=40></td>" +
                                    "<td align='middle'><img src='img/popmenu/" + obtenirPictoSport(sports[2]) + "' width=70></td>" +
                                    "<td><div class='celluleSport'><h3>" + chiffres[2] + "</h3></div></td>" +
                                "</tr>";
            htmlInfosRegions += "<tr>" +
                                    "<td></td>" +
                                    "<td align='right'><div class='celluleSport'><h4>" + chiffres[3] + "</h4></div></td>" +
                                    "<td align='middle'><img src='img/popmenu/" + obtenirPictoSport(sports[3]) + "' width=60></td>" +
                                    "<td align='left'><img src='img/4eme.png' width=30></td>" +
                                "</tr>";
            htmlInfosRegions += "<tr>" +
                                    "<td align='right'><img src='img/5eme.png' width=20></td>" +
                                    "<td align='middle'><img src='img/popmenu/" + obtenirPictoSport(sports[4]) + "' width=50></td>" +
                                    "<td><div class='celluleSport'><h5>" + chiffres[4] + "</h5></div></td>" +
                "<td></td>" +
                                "</tr>";
            htmlInfosRegions += "</table></div>";
            
            i = 0;
            nbBrut = 0;
            for (prop in donneesGeneralesBrutes) {
                if (donneesGeneralesBrutes.hasOwnProperty(prop) && i > 0) {
                    nbBrut += parseInt(donneesGeneralesBrutes[prop][regionsDeBaseC.indexOf(region)], 10);
                    i += 1;
                }
            }
        } else {
            htmlInfosRegions += "<p><center><img src='img/popmenu/"  + obtenirPictoSport(sportSelectionne) + "' width=150></center>";
            nbBrut = donneesGeneralesBrutes[sportSelectionne][regionsDeBaseC.indexOf(region)];
            nb10000 = donneesGeneralesC[sportSelectionne][regionsDeBaseC.indexOf(region)];
            
            htmlInfosRegions +=  "<div class='sportRegions'><br>" + lisibilite_nombre(nb10000) + " licenciés pour 10 000 habitants<p>"
                                                             + lisibilite_nombre(nbBrut) + " licenciés au total</div>";
        }
			
		document.getElementById("container").innerHTML = htmlInfosRegions;
		diagramme = false;
	} else { // si on reclique sur la même région

        // on ré-affiche le compteur
        document.getElementById("compteur").style.display = "inline";
        
        chart.destroy();
		creerDiagramme();
		dataDiagramme = [];
		for (i = 0; i < regionsC.length; i += 1) {
			dataDiagramme.push({y: donneesC[i], color: paletteDiagramme[regionsC[i]] });
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
        l1,
        l2,
        l3,
        l4,
        min = 10001,
        legende;
    
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
        if (ratiosTotalSport[i] < min) {
            min = ratiosTotalSport[i];
        }
    }
    
    legende = obtenirLegendes(min, max, 100);
    
    // RATIOS A CALCULER DYNAMIQUEMENT SI LE TEMPS LE PERMET !!!
    ratiosTotauxSpotsRegions.l1 = legende[3];
    ratiosTotauxSpotsRegions.l2 = legende[2];
    ratiosTotauxSpotsRegions.l3 = legende[1];
    ratiosTotauxSpotsRegions.l4 = legende[0];
    palette = moduleD.obtenirPalette(couleurMax, couleurMin, ratiosTotauxSpotsRegions);
    
    l1 = palette.l1;
    l2 = palette.l2;
    l3 = palette.l3;
    l4 = palette.l4;
    delete palette.l1;
    delete palette.l2;
    delete palette.l3;
    delete palette.l4;

    document.getElementById('cadreLegende1').style.backgroundColor = l1;
    document.getElementById('cadreLegende2').style.backgroundColor = l2;
    document.getElementById('cadreLegende3').style.backgroundColor = l3;
    document.getElementById('cadreLegende4').style.backgroundColor = l4;

    document.getElementById('legende1').innerHTML = "+ " + ratiosTotauxSpotsRegions.l1;
    document.getElementById('legende2').innerHTML = "+ " + ratiosTotauxSpotsRegions.l2;
    document.getElementById('legende3').innerHTML = "+ " + ratiosTotauxSpotsRegions.l3;
    document.getElementById('legende4').innerHTML = "+ " + ratiosTotauxSpotsRegions.l4;
    
	paletteDiagramme = palette;        // pour le diagramme    
    $('#francemap').vectorMap("setColors", palette);
    obj[regionGagnante] = img;
    $('.jqvmap_pin').remove();
    $('#francemap').vectorMap("placePins", obj, "content");
}









// ------------------------------------------------------------------------------
// fonction de tri (à bulles) des données/régions pour le diagramme
function trierDonnees() {
    'use strict';
    var changement = true,
        i,
        tmp1,
        tmp2;
    
	while (changement) {
		changement = false;
		for (i = 0; i < regionsC.length - 1; i += 1) {
			if (donneesC[i] < donneesC[i + 1]) {
				tmp1 = regionsC[i];
				tmp2 = donneesC[i];
				regionsC[i] = regionsC[i + 1];
				donneesC[i] = donneesC[i + 1];
				regionsC[i + 1] = tmp1;
				donneesC[i + 1] = tmp2;
				changement = true;
			}
		}
	}
}

// compteur ------------------------------------------------------
function majCompteur(value) {
    'use strict';
    setTimeout(function () {
        odometer.innerHTML = value;
    }, 1);
}



function arrondirALaGranulariteLaPlusProche(nombre, granularite) {
    'use strict';
    var modulo = nombre % granularite;
    if (modulo < 3) {
        return nombre - modulo;
    } else {
        return nombre + granularite - modulo;
    }
}




function obtenirLegendes(min, max, granularite) {
    'use strict';
    var newMin = arrondirALaGranulariteLaPlusProche(min, granularite),
        newMax = arrondirALaGranulariteLaPlusProche(max, granularite),
        ret,
        diff = newMax - newMin;
    if ((diff - granularite) % 3 === 0) {
        if ((newMin + granularite) - min > max - (newMax - granularite)) {
            newMax = newMax - granularite;
        } else {
            newMin = newMin + granularite;
        }
    } else if ((diff + granularite) % 3 === 0) {
        if (min - (newMin - granularite) > (newMax + granularite) - max) {
            newMax = newMax + granularite;
        } else {
            newMin = newMin - granularite;
        }
    }
    diff = newMax - newMin;
    ret = [newMin, newMin + (diff / 3), newMax - (diff / 3), newMax];
    return ret;
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
        min = 10001,
        gagnant,
        obj = {},
        l1,
        l2,
        l3,
        l4,
        dataDiagramme,
        legende;

    sportSelect = sportSelect.toString();
	//document.getElementById("texteCompteur").innerHTML = "licenciés en France (" + sportSelect.replace(/_/g, " ") + ")";
    
    // on ré-affiche le compteur si besoin
    document.getElementById("compteur").style.display = "inline";
    
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
		for (i = 0; i < donneesTousLesSportsC.length; i += 1) {
            donneesC[i] = donneesTousLesSportsC[i];
		}
    } else {// Choix d'un sport ------------------------------------------
		modeGlobal = false;
	
		// carte
        for (i = 0; i < regions.length; i += 1) {
            ratios[regions[i]] = parseInt(chiffres[i], 10);
            if (ratios[regions[i]] > max) {
                max = ratios[regions[i]];
                regionGagnante = regions[i];
            }
            if (ratios[regions[i]] < min) {
                min = ratios[regions[i]];
            }
        }
        
        // Calcul des valeurs qui seront affichée dans la légende
        //obtenirLegendes(min, max);
        legende = obtenirLegendes(min, max, 5);
        ratios.l1 = legende[3];
        ratios.l2 = legende[2];
        ratios.l3 = legende[1];
        ratios.l4 = legende[0];
        
        palette = moduleD.obtenirPalette(couleurMax, couleurMin, ratios);
        
        l1 = palette.l1;
        l2 = palette.l2;
        l3 = palette.l3;
        l4 = palette.l4;
        delete palette.l1;
        delete palette.l2;
        delete palette.l3;
        delete palette.l4;

        document.getElementById('cadreLegende1').style.backgroundColor = l1;
        document.getElementById('cadreLegende2').style.backgroundColor = l2;
        document.getElementById('cadreLegende3').style.backgroundColor = l3;
        document.getElementById('cadreLegende4').style.backgroundColor = l4;

        document.getElementById('legende1').innerHTML = "+ " + ratios.l1;
        document.getElementById('legende2').innerHTML = "+ " + ratios.l2;
        document.getElementById('legende3').innerHTML = "+ " + ratios.l3;
        document.getElementById('legende4').innerHTML = "+ " + ratios.l4;
        
        paletteDiagramme = palette;
        $('#francemap').vectorMap("setColors", palette);
        obj[regionGagnante] = img;
        $('.jqvmap_pin').remove();
        $('#francemap').vectorMap("placePins", obj, "content");
		
		// diagramme
		for (prop in donneesGeneralesC) {
			if (donneesGeneralesC.hasOwnProperty(prop)) {
				if (prop.toString() === sportSelect) {
					for (i = 0; i < donneesGeneralesC[prop].length; i += 1) {
						donneesC[i] = parseInt(donneesGeneralesC[prop][i], 10);
					}
				}
			}
		}
    }
	
	
    
    // Diagramme ------------------------------------------------
	sportSelectionne = sportSelect;
	
	if (diagramme === false) {
		chart.destroy();
		creerDiagramme();
		diagramme = true;
	}
	
	chart.setTitle({ text: sportSelect.replace(/_/g, " ")}, {text: ''});
					
	for (i = 0; i < regionsC.length; i += 1) {
		regionsC[i] = regionsDeBaseC[i];
	}

	trierDonnees();
	
	dataDiagramme = [];
	for (i = 0; i < regionsC.length; i += 1) {
		dataDiagramme.push({y: donneesC[i], color: paletteDiagramme[regionsC[i]] });
	}
	
	chart.yAxis[0].setExtremes(minDataValue(), maxDataValue());
	chart.series[0].update({
		data: dataDiagramme
	});
	chart.xAxis[0].setCategories(regionsC);
    
    
    
    // compteur ------------------------------------------------
    if (chiffres === undefined) {
        majCompteur(totalLicenciesTousLesSports);
    } else {
        majCompteur(donneesParSportsBrutes[sports.indexOf(sportSelect)]);
    }
}








// ------------------------------------------------------------------------------
// initiation cartes/lecture fichiers csv
$(document).ready(function () {
    'use strict';
    creerDiagramme();
    // MAP -------------------------------------
    var colors = {},
        key,
        ratios = {},
        palette,
        moduleC = moduleCSV();
    
    $('#francemap').vectorMap({
        map: 'france_fr',
        hoverOpacity: 0.5,
        hoverColor: null,
        backgroundColor: couleurDeFond,
        color: couleurDeFond,
        borderColor: null,
        selectedColor: null,
        enableZoom: false,
        showTooltip: true,
		onRegionClick: function (element, code, region) {
			cliqueSurRegion(code);
		}
    });
    
    
    
    moduleD = moduleDegrade();
    
    
    // ------------------------------------------------------------------------------------------------
	// Lecture du fichier csv (10 000 hab)-------------------------------------------------------------
    moduleC.readTextFile('donnees/regions_sans_dom_licencies_par_sports10000_2012.csv', function (csvString) {
		// MAP -----------------------------------------
	    var csvObject = moduleC.csvToObject(csvString), prop, s = '',
            premiereLigne = csvObject.firstLine,
            regions = premiereLigne,
            chiffres,
            i,
            ratiosTotalSport = [],
            ratiosTotauxSpotsRegions = {},
            compteur,
            ligne,
            dataDiagramme;
        
        donnees = csvObject;

        afficherSport('Tous les sports');
        
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
		compteur = 0;
		for (prop in csvObject) {
            if (csvObject.hasOwnProperty(prop)) {
                if (compteur > 0) {
                    ligne = csvObject[prop];
                    for (i = 0; i < regionsC.length; i += 1) {
                        donneesC[i] += parseInt(ligne[i], 10);
                        donneesTousLesSportsC[i] += parseInt(ligne[i], 10);
                    }
                }
                compteur += 1;
            }
		}
		
		trierDonnees();
	
		dataDiagramme = [];
		for (i = 0; i < regionsC.length; i += 1) {
			dataDiagramme.push({y: donneesC[i], color: paletteDiagramme[regionsC[i]] });
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
        var csvObject = moduleC.csvToObject(csvString),
            prop,
            compteur = 0,
            i = 0,
            ligne,
            j;
        donneesGeneralesBrutes = csvObject;
        
        totalLicenciesTousLesSports = 0;
        sports = [];
        donneesParSportsBrutes = [];
		for (prop in csvObject) {
            if (csvObject.hasOwnProperty(prop)) {
                if (compteur > 0) {
                    sports.push(prop);      // récupération des sports
                    donneesParSportsBrutes.push(0);
                    ligne = csvObject[prop];
                    for (j = 0; j < regionsC.length; j += 1) {
                        donneesParSportsBrutes[i] += parseInt(ligne[j], 10);
                        totalLicenciesTousLesSports += parseInt(ligne[j], 10);
                    }
                    i += 1;
                }
                compteur += 1;
            }
        }
        majCompteur(totalLicenciesTousLesSports);
    });
});


// pour le responsive
window.onresize = function () {
    "use strict";
    setTimeout(function () {
        
        //Placement du picto sur la carte
        var obj = {},
            innerWidth = window.innerWidth,
            tab = document.getElementsByClassName('pictoChoix'),
            i,
            carte = document.getElementById("carte2"),
            svg = carte.getElementsByTagName("svg")[0];
        obj[regionGagnante] = img;
        $('.jqvmap_pin').remove();
        $('#francemap').vectorMap("placePins", obj, "content");
        
        // Dimension du menu de la première dataviz
        $('#demo_box').popmenu({'background': '#BDBDBD', 'focusColor': '#D33C3D', 'iconSize': (Math.floor(innerWidth / 8)) + "px", 'width': innerWidth - 100 + "px"});
    
        for (i = 0; i < tab.length; i += 1) {
            tab[i].style.width = (Math.floor(innerWidth / 9)) + "px";
        }
        
        // Positionnement de la carte des départements
        if (innerWidth > 1000 && innerWidth <= 1250) {
            svg.setAttribute("viewBox", "400 100 300 250");
        } else if (innerWidth > 2000) {
            svg.setAttribute("viewBox", "650 100 300 250");
        } else if (innerWidth > 1250 && innerWidth <= 2000) {
            svg.setAttribute("viewBox", "500 100 300 250");
        } else if (innerWidth <= 800) {
            svg.setAttribute("viewBox", "300 100 300 250");
        } else {
            svg.setAttribute("viewBox", "350 100 300 250");
        }
    }, 0);
};


function lisibilite_nombre(nbr) {
    'use strict';
    var nombre = nbr.toString(),
        retour = '',
        count = 0,
        i;
    for (i = nombre.length - 1; i >= 0; i = i - 1) {
        if (count !== 0 && count % 3 === 0) {
            retour = nombre[i] + ' ' + retour;
        } else {
            retour = nombre[i] + retour;
        }
        count += 1;
    }
    return retour;
}