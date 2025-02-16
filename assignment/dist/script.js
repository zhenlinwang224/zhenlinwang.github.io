mapboxgl.accessToken = 'pk.eyJ1IjoiemhlbmxpbndhbmciLCJhIjoiY201d2l3bnBsMGJyaTJrcXU0YjF3eWl3cSJ9.JM6Sr28yqNuOs30yUg-drQ'; 

// Create two map containers
const map1 = new mapboxgl.Map({
    container: 'map1',
    style: 'mapbox://styles/mapbox/dark-v11',  
    center: [-0.1, 51.5], 
    zoom: 10
});

const map2 = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mapbox/dark-v11',  
    center: [-0.1, 51.5], 
    zoom: 10
});

// Load IMD data
function loadIMDData(map, id) {
    map.addSource('imd-' + id, {
        type: 'vector',
        url: 'mapbox://zhenlinwang.88s0zaau'
    });

    map.addLayer({
        'id': 'imd-layer-' + id,
        'type': 'fill',
        'source': 'imd-' + id,
        'source-layer': 'IMD_SelectedAreas2-cdn5zx',
        'paint': {
            'fill-color': [
    'interpolate', ['linear'], ['get', 'IMDDecil'],
    1, '#08306b', 2, '#08519c', 3, '#2171b5', 4, '#4292c6',
    5, '#6baed6', 6, '#9ecae1', 7, '#c6dbef', 8, '#deebf7',
    9, '#f7fbff', 10, '#ffffff'
],
            'fill-opacity': 0.8
        }
    });
}

// Mapbox Tilesets ID for crime datasets
const crimeDataTilesets = {
    "january": { id: "zhenlinwang.23r8ymb4", layer: "2023-01-8lbsdi" },
    "february": { id: "zhenlinwang.9lv11y5x", layer: "2023-02-69w7jf" },
    "march": { id: "zhenlinwang.d26t82sz", layer: "2023-03-8ldjn7" },
    "april": { id: "zhenlinwang.5y7gzq3d", layer: "2023-04-crx4si" },
    "may": { id: "zhenlinwang.6xwg17oc", layer: "2023-05-4ut0vf" },
    "june": { id: "zhenlinwang.7pg4qi3q", layer: "2023-06-4kq84a" }
};

// Loading crime data
function loadCrimeData(map, mapID, month) {
    let tileset = crimeDataTilesets[month]; 

    if (!tileset) {
        console.error(` No crime dataset found for month: ${month}`);
        return;
    }
  
  
// Mouse hover
  function addCrimePopup(map, mapID) {
    map.on('mouseenter', 'crime-layer-' + mapID, function (e) {
        map.getCanvas().style.cursor = 'pointer';
        const properties = e.features[0].properties;
        const popup = new mapboxgl.Popup({ closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Crime Type:</strong> ${properties["Crime type"]}<br>
                      <strong>Date:</strong> ${properties["Month"]}`)
            .addTo(map);
    });

    map.on('mouseleave', 'crime-layer-' + mapID, function () {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.mapboxgl-popup').forEach(el => el.remove());
    });
}
  
    // Remove the old data source first
    if (map.getSource('crime-data-' + mapID)) {
        map.removeLayer('crime-layer-' + mapID);
        map.removeSource('crime-data-' + mapID);
    }

    // Add a new crime data source
    map.addSource('crime-data-' + mapID, {
        type: 'vector',
        url: 'mapbox://' + tileset.id 
    });

    // Add crime data layer
    map.addLayer({
        'id': 'crime-layer-' + mapID,
        'type': 'circle',
        'source': 'crime-data-' + mapID,
        'source-layer': tileset.layer, 
        'paint': {
            'circle-radius': 4,
            'circle-color': mapID === '1' ? 'red' : 'yellow',
            'circle-opacity': 0.7
        }
     
    });

    console.log(` Crime data loaded for map ${mapID}: ${tileset.id}, Layer: ${tileset.layer}`);

    //  Add mouse hover interaction
    addCrimePopup(map, mapID);
}

//  **Move 'addCrimePopup()' to the outside**
function addCrimePopup(map, mapID) {
    map.on('mouseenter', 'crime-layer-' + mapID, function (e) {
        map.getCanvas().style.cursor = 'pointer';
        const properties = e.features[0].properties;
        const popup = new mapboxgl.Popup({ closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Crime Type:</strong> ${properties["Crime type"]}<br>
                      <strong>Date:</strong> ${properties["Month"]}`)
            .addTo(map);
    });

    map.on('mouseleave', 'crime-layer-' + mapID, function () {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.mapboxgl-popup').forEach(el => el.remove());
    });
}

//  Monitor map loading
map1.on('load', function () {
    loadIMDData(map1, "1");
});

map2.on('load', function () {
    loadIMDData(map2, "2");
});

//  button click events
document.getElementById("updateMap").addEventListener("click", function () {
    const month1 = document.getElementById("month1").value;
    const month2 = document.getElementById("month2").value;

    console.log(` Updating maps: ${month1} vs ${month2}`);

    loadCrimeData(map1, "1", month1);
    loadCrimeData(map2, "2", month2);
});



function updateCrimeFilter(map, layerID, classSelector) {
    
    if (!map.getLayer(layerID)) {
        console.error(` Layer ${layerID} not found!`);
        return;
    }

    let selectedTypes = [];
    document.querySelectorAll(classSelector + ':checked').forEach(checkbox => {
        selectedTypes.push(checkbox.value);
    });

    //  Use "match" instead of "in" and make sure not to filter when there is no choice
    let filter = selectedTypes.length
        ? ["match", ["get", "Crime type"], selectedTypes, true, false]
        : null;

    //  Update filters on the map
    map.setFilter(layerID, filter);
}

document.querySelectorAll('.crime-filter').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        updateCrimeFilter(map1, 'crime-layer-1', '.crime-filter');
        updateCrimeFilter(map2, 'crime-layer-2', '.crime-filter');
    });
});




//Full screen mode
map1.addControl(new mapboxgl.FullscreenControl());
map2.addControl(new mapboxgl.FullscreenControl());

function updateCrimeFilter(map, layerID, classSelector) {
    let selectedTypes = [];
    document.querySelectorAll(classSelector + ':checked').forEach(checkbox => {
        selectedTypes.push(checkbox.value);
    });

    let filter = ["in", "Crime type", ...selectedTypes];

    map.setFilter(layerID, selectedTypes.length ? filter : null);
}

//Add data statistics
function updateCrimeStats(map, layerID, statsID) {
    let features = map.queryRenderedFeatures({ layers: [layerID] });
    let crimeCounts = {};

    features.forEach(f => {
        let crimeType = f.properties["Crime type"];
        crimeCounts[crimeType] = (crimeCounts[crimeType] || 0) + 1;
    });

    let statsHTML = `<h4>Total Crimes: ${features.length}</h4>`;
    for (let type in crimeCounts) {
        statsHTML += `<p>${type}: ${crimeCounts[type]} (${((crimeCounts[type] / features.length) * 100).toFixed(2)}%)</p>`;
    }

    document.getElementById(statsID).innerHTML = statsHTML;
}

// Monitor map changes
map1.on('idle', () => updateCrimeStats(map1, 'crime-layer-1', 'stats-left'));
map2.on('idle', () => updateCrimeStats(map2, 'crime-layer-2', 'stats-right'));





let isHeatmap = false;

document.getElementById("toggleHeatmap").addEventListener("click", function () {
    isHeatmap = !isHeatmap;
    updateCrimeLayer();
});

// Updated Crime Layer (Dot Map 头、 Heat Map)
function updateCrimeLayer() {
    const layerType = isHeatmap ? "heatmap" : "circle";  // Switching layer type
    const paintProperties = isHeatmap
        ? {
            "heatmap-weight": 1,  // Set weights for the heat map
            "heatmap-intensity": 1,
            "heatmap-color": [
                "interpolate", ["linear"], ["heatmap-density"],
                0, "rgba(33,102,172,0)",
                0.2, "rgb(103,169,207)",
                0.4, "rgb(209,229,240)",
                0.6, "rgb(253,219,199)",
                0.8, "rgb(239,138,98)",
                1, "rgb(178,24,43)"
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 12, 20]
        }
        : {
            "circle-radius": 4,  
            "circle-color": "red",
            "circle-opacity": 0.7
        };

    // Remove an existing layer
    if (map1.getLayer('crime-layer-1')) {
        map1.removeLayer('crime-layer-1');
        map1.removeSource('crime-data-1');
    }
    if (map2.getLayer('crime-layer-2')) {
        map2.removeLayer('crime-layer-2');
        map2.removeSource('crime-data-2');
    }

    // Reload data
    loadCrimeData(map1, "1", document.getElementById("month1").value, layerType, paintProperties);
    loadCrimeData(map2, "2", document.getElementById("month2").value, layerType, paintProperties);
}

// Loading crime data
function loadCrimeData(map, mapID, month, layerType = "circle", paintProperties = null) {
    let tileset = crimeDataTilesets[month];

    if (!tileset) {
        console.error(` No crime dataset found for month: ${month}`);
        return;
    }

    if (map.getSource('crime-data-' + mapID)) {
        map.removeLayer('crime-layer-' + mapID);
        map.removeSource('crime-data-' + mapID);
    }

    map.addSource('crime-data-' + mapID, {
        type: 'vector',
        url: 'mapbox://' + tileset.id
    });

    // Apply dynamic rendering types
    map.addLayer({
        'id': 'crime-layer-' + mapID,
        'type': layerType,
        'source': 'crime-data-' + mapID,
        'source-layer': tileset.layer,
        'paint': paintProperties || {
            "circle-radius": 4,
            "circle-color": mapID === '1' ? 'red' : 'yellow',
            "circle-opacity": 0.7
        }
    });

    console.log(` Crime data loaded for map ${mapID}: ${tileset.id}, Layer: ${tileset.layer}`);

    // Rebind mouse hover interaction events for the dot plot
    if (layerType === "circle") {
        addCrimePopup(map, mapID);
    }
}

// Mouse hover event: Only bind dots
function addCrimePopup(map, mapID) {
    map.on('mouseenter', 'crime-layer-' + mapID, function (e) {
        map.getCanvas().style.cursor = 'pointer';
        const properties = e.features[0].properties;
        const popup = new mapboxgl.Popup({ closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Crime Type:</strong> ${properties["Crime type"]}<br>
                      <strong>Date:</strong> ${properties["Month"]}`)
            .addTo(map);
    });

    map.on('mouseleave', 'crime-layer-' + mapID, function () {
        map.getCanvas().style.cursor = '';
        document.querySelectorAll('.mapboxgl-popup').forEach(el => el.remove());
    });
}