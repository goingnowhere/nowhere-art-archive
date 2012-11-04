var SkyDiveState = { BEFORE: 0, RUNNING: 1, DONE: 2 };
if (Object.freeze) Object.freeze(SkyDiveState);
var skydive = SkyDiveState.BEFORE;
var skydiveStart = 15;
var skydiveTarget = 18;
var skydiveTimeout = 2300;
var lastZoomUpdate;

var nowhereSiteLocation = new Microsoft.Maps.Location(41.69692036166501, -0.17015731952668034);

var map_options = {
  credentials: "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf",
  center: nowhereSiteLocation,
  zoom: skydiveStart,
  mapTypeId: Microsoft.Maps.MapTypeId.aerial,
  showDashboard: false, showMapTypeSelector: false, showScalebar: false,
  enableSearchLogo: false, enableClickableLogo: false
}

var map = null;
var defaultPolyOptions = {
  fillColor: new Microsoft.Maps.Color(64, 0, 0, 0),
  strokeColor: new Microsoft.Maps.Color(128, 0, 0, 0),
  strokeThickness: 1
};

/* Main configuration for the Galleria photo browser component. */
var galleriaConfiguration = { dataSource: [],
  height: 660, minScaleRatio: 1, maxScaleRatio: 1,
  carousel: false, thumbnails: false, responsive: true,
  autoplay: 3500, pauseOnInteraction: false,
}

function makeStructure(name, points) {
  var structure = new Microsoft.Maps.Polygon(points.map(function(point) {
    return new Microsoft.Maps.Location(point[0], point[1]);
  }), defaultPolyOptions);
  structure.pins = null;
  structure.name = name;
  structure.isPoly = true;
  return structure;
}

$(document).ready(function() {
  map = new Microsoft.Maps.Map($("#mapdiv")[0], map_options);

  Microsoft.Maps.EntityCollection.prototype.forEach = function(callback) {
    for (var i = 0; i < this.getLength(); i++) callback(this.get(i));
  }
  
  Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function(e) {
    if (skydive == SkyDiveState.RUNNING && map.getZoom() == skydiveTarget) {
      addStructures(); 
      addArt();
      skydive = SkyDiveState.DONE;
    } else if (skydive == SkyDiveState.DONE) {
      if (lastZoomUpdate != map.getZoom()) {
        lastZoomUpdate = map.getZoom();
        updateArtForZoom(lastZoomUpdate);
      }
    }
  });

  setTimeout(function() {
    skydive = SkyDiveState.RUNNING;
    map.setView({zoom: skydiveTarget, animate: true});
  }, skydiveTimeout);
});
   
function addStructures() {
  structures.forEach(function(structure) { map.entities.push(structure); });
}

function addArt() {
  art.forEach(function(piece) { map.entities.push(piece) });
}

function makeArt(piece) {
   var thumbURL = function(size) {
      return "http://nerochiaro.smugmug.com/photos/##ID##/0/##SIZE##/##ID##-##SIZE##.jpg"
            .replace(/##ID##/g, piece.thumbId)
            .replace(/##SIZE##/g, size + "x" + size);
  }
  var pin = new Microsoft.Maps.Pushpin(
    new Microsoft.Maps.Location(piece.position[0], piece.position[1]),
    { typeName: "artpiece", text: piece.title,
      icon: thumbURL(50),
      textOffset: new Microsoft.Maps.Point(0, -14),
      anchor: new Microsoft.Maps.Point(0, 0)
    } 
  );
  pin.setThumbSize = function(size) {
    pin.setOptions({icon: thumbURL(size) })
  };
  pin.setVisibility = function(isVisible) {
    pin.setOptions({visible: isVisible});
  };
  Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
    loadProject(piece);
  });
  return pin;
}

function loadProject(project) 
{
  $("#blurb").load("http://nerochiaro.net/art/project.php?year=2012&id=" + project.id + "&ajax=1", function(x) {
    console.log("Loaded");

    var smug = new SmugMug();
    smug.call('login.anonymously', {}, function(result) {
      var args = { AlbumID: project.albumId, AlbumKey: project.albumKey, Extras: 'LargeURL,SmallURL,LightboxURL' };
      if (result.stat == "ok") smug.call('images.get', args, function(data,ok) {
        if (ok) {
          var images = [];
          data.Album.Images.forEach(function(img) {
            images.push({ image: img.LargeURL, link: img.LightboxURL });
          });
          $("#project").show(30, function() {
            galleriaConfiguration.dataSource = images;
            /* Ideally we should be able to load Galleria only once and then call
             * galleria.load(images) but it's not working for some reason so the best we can do is
             * to reload Galleria every time. It seems quick enough anyway */
            Galleria.run("#galleria", galleriaConfiguration);
          });
        }
      });
    });
  });
}

function unloadProject() {
  $('#project').hide()
}

var SIZE_FOR_ZOOM = { 17: 25, 18: 50, 19: 75, 20: 150 };
function updateArtForZoom(zoom) {
  art.forEach(function(piece) { 
    if (zoom > 16) {
      piece.setVisibility(true);
      
      piece.setThumbSize(SIZE_FOR_ZOOM[zoom]);
    } else piece.setVisibility(false);
  });
}
