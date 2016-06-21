var IMAGE_URLS = {
  CONDOM: "images/igmikc-map-icon-condom.png",
  EVENT: "images/igmikc-map-icon-event.png"
};
var DEFAULT_MAP_CENTER = {
  LAT: 39.0397266,
  LNG: -94.5785667
};
var POINT_TYPE = {
  CONDOM: 'condom',
  EVENT: 'event'
};
var map;

function mobileAndTabletcheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
function showMap (center) {
  map = new google.maps.Map(document.getElementById('googleMap'), {
    center:center,
    zoom:11,
    scrollwheel:false,
    draggable:false,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  });


  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');
  // (In this example we use a locally stored copy instead.)
  script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
  // script.src = '/maps/documentation/javascript/tutorials/js/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  //google sheet data
  Tabletop.init( { key: '1OsCBjUnhUYDjt86opGTe-iswhfSVC39d-9aRIKIzZI0',
                  callback: function(data, tabletop) {
                    // console.log(data);
                    var locations = data.Locations.elements;
                    var geoJs = location_data_to_geoJson(locations);
                    // console.log(geoJs);
                    put_geoJson_on_map(geoJs);

                  },
                  simpleSheet: false } );

  //add current location as center if the user is on mobile phone
  if(mobileAndTabletcheck()){
    var myMarker = new google.maps.Marker({
      position: center,
      map: map,
    });
  }
}
function initialize() {
  var myCenter;
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myCenter = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      showMap(myCenter);
    }, function() {
      myCenter = new google.maps.LatLng(DEFAULT_MAP_CENTER.LAT, DEFAULT_MAP_CENTER.LNG);
      showMap(myCenter);
    });
  }else{
    myCenter = new google.maps.LatLng(DEFAULT_MAP_CENTER.LAT, DEFAULT_MAP_CENTER.LNG);
    showMap(myCenter);
  }
}


function location_data_to_geoJson (data) {
  var gj = {'type':'FeatureCollection','features':[]},
    feature = {},
    geometry = {'type':'Point'};

  //loop over row data
  var i, row;
  for(i=data.length;i--;){
    row = data[i];
    console.log(row);
    gj.features.push({
      'type':'Feature',
      'geometry': {
        'type':'Point',
        'coordinates':[
          row.Latitude,
          row.Longitude
        ]
      },
      'properties':row
    })
  }
  return gj;
}

var markerInfoWindowContent = function(m) {
  return "<h1 class='infowindow'>"+m.prop.Name+"</h1><div>"+m.prop.Details+"</div>"
};

function put_geoJson_on_map(geoJs){
  
  var i, coords, lat_lng, marker, fp, icon_url;
  for (var i = 0; i < geoJs.features.length; i++) {
    fp = geoJs.features[i];
    coords = fp.geometry.coordinates;
    lat_lng = new google.maps.LatLng(coords[1],coords[0]);
    if(fp.properties.Type.toLowerCase() == POINT_TYPE.CONDOM){
      icon_url = IMAGE_URLS.CONDOM;
    }else if(fp.properties.Type.toLowerCase() == POINT_TYPE.EVENT){
      icon_url = IMAGE_URLS.EVENT;
    }else{
      icon_url = IMAGE_URLS.CONDOM;
    }
    marker = new google.maps.Marker({
      position: lat_lng,
      map: map,
      icon: icon_url,
      prop: fp.properties
    });
    marker.addListener('click', function() {
      var infowindow = new google.maps.InfoWindow({
        content: markerInfoWindowContent(this)
      });
      infowindow.open(map, this);
    });
  }
}

// Loop through the results array and place a marker for each
// set of coordinates.
window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
}