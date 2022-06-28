mapboxgl.accessToken = 'pk.eyJ1Ijoic3Jqb3VwcGkiLCJhIjoiY2t4OTd2YnNvMmExcDJucG14cHB6ajJhOCJ9.YFxNr_U53BASB7Eb3IIGAQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/srjouppi/cl4ww5rc7004q15pym9t3b3rw',
    zoom: 6.25,
    maxZoom:10,
    minZoom:4,
    center: [-105.6, 39.05],
    // maxBounds: [
    //     [-110, 48],
    //     [-1200, 39],
    //   ],
    projection: 'mercator',
});

map.on("load", function () {
  // let layers = map.getStyle().layers;
  // for (var i=0; i < layers.length; i++){
  //     console.log(layers(i).id)
  // }
  map.addLayer({
    id: "counties_outline",
    type: "line",
    source: {
      type: "geojson",
      data: "data/countiesPolygons.geojson",
    },
    paint: {
      "line-color": "#ffffff",
      "line-width": 0.7,
    },
  },
  "waterway-label" // Here's where we tell Mapbox where to slot this new layer
  );
  map.addLayer({
    id: "fire_data",
    type: "fill",
    source: {
      type: "geojson",
      data: "data/fireData.geojson",
    },
    maxzoom:7,
    paint: {
      'fill-color': {
        property: 'Mean CFL',
        stops: [[0, '#fff'], [8, '#FF5349']]
        },
        'fill-opacity':.9,
        // 'fill-opacity':[
        //   [{'zoom':3,"value":1}],
        //   [{'zoom':7,"value":0}]
        // ]
        // I WANT TO DO THIS BUT IN REVERSE, WHERE IT BECOMES TRANSPARENT AS YOU ZOOM IN 
      // 'fill-opacity': ['interpolate',
      // // Set the exponential rate of change to 0.5
      // ['exponential', 0.5],
      // ['zoom'],
      // // When zoom is 10, buildings will be 100% transparent.
      // 7,
      // 0.5,
      // // When zoom is 18 or higher, buildings will be 100% opaque.
      // 3,
      // 1
      // ]    
      },
  },
"counties_outline");
map.addLayer({
  id: "fire_data_transparent",
  type: "fill",
  source: {
    type: "geojson",
    data: "data/fireData.geojson",
  },
  minzoom:7,
  paint: {
      'fill-opacity':0,   
    },
},
"counties_outline");
map.addLayer({
  id: "drought_data",
  type: "fill",
  source: {
    type: "geojson",
    data: "data/droughtData.geojson",
  },
  minzoom:7,
  paint: {
    // "fill-color":"#fff",
    // "line-color": "#000000",
    // "line-width": 0.7,
    'fill-color': ['match',
      ['get','DM'],
      0, 
      "#F8DB8C",
      1,
      "#F9B939",
      2,
      "#F98824",
      3,
      "#FD353C",
      4,
      "#650303",
      "#fff",
  ],
    'fill-opacity':.9,    
    },

},
"fire_data"); 
});

    map.on('click', 'fire_data', function (e) {
        var county = e.features[0].properties['NAME_x'];

        // HOW DO I ROUND THESE NUMBERS?
        var meanCFL = e.features[0].properties['Mean CFL'].toLocaleString();
        var housingUnits = e.features[0].properties['Total number of Housing Units (HUs)'].toLocaleString();
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<h2>'+county+'</h2>' 
            + '<hr/>'
            + '<p><strong>Average Flame Length:</strong> '+meanCFL+' feet</p>'
            + '<p><strong>Housing Units:</strong> '+housingUnits+'</p>')
            .addTo(map);
      });
      map.on('mouseenter', 'fire_data', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'fire_data', function () {
        map.getCanvas().style.cursor = '';
      });
      
// transparent data layer for zoom level 7

    map.on('click', 'fire_data_transparent', function (e) {
      var county = e.features[0].properties['NAME_x'];
      var meanCFL = e.features[0].properties['Mean CFL'].toLocaleString();
      var housingUnits = e.features[0].properties['Total number of Housing Units (HUs)'].toLocaleString();
      new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<h2>'+county+'</h2>' 
          + '<hr/>'
          + '<p><strong>Average Flame Length:</strong> '+meanCFL+' feet</p>'
          + '<p><strong>Housing Units:</strong> '+housingUnits+'</p>')
          .addTo(map);
    });
    map.on('mouseenter', 'fire_data_transparent', function () {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'fire_data_transparent', function () {
      map.getCanvas().style.cursor = '';
    });