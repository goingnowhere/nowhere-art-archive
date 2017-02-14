var SkyDiveState = { BEFORE: 0, RUNNING: 1, DONE: 2 };
if (Object.freeze) Object.freeze(SkyDiveState);
var skydive = SkyDiveState.BEFORE;
var skydiveStart = 15;
var skydiveTarget = 18;
var skydiveTimeout = 2300;
var lastZoomUpdate;
var SIZE_FOR_ZOOM = { 17: 25, 18: 50, 19: 75, 20: 150 };

var nowhereSiteLocation = new Microsoft.Maps.Location(41.69692036166501, -0.17015731952668034);

var map_options = {
  credentials: "Ao4H-8bsrOuVZGX_x1rw0A804s5EaWKpemtcDYFqdIUEsy8GZHLSri_eTPCChuQX",
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

var art = null;
var embedMode = false;
var yearData = null;

function getProjects(year, callback) {
  var smug = new SmugMug();
  smug.call("albums.get", { NickName: 'nowhere-art', Extras: 'Keywords,NiceName,Description' }, function(result) {
    if (result.stat == "ok") {
      var years = collectYears(result.Albums);
      if (years[year]) {
        yearData = years[year]
        art = {};
        var args = { AlbumID: yearData.infoAlbum.id,
                     AlbumKey: yearData.infoAlbum.Key,
                     Extras: "Keywords,Caption,TinyURL" };
        smug.call("images.get", args, function(result) {
          if (result.stat == "ok") {
            var projects = []
            result.Album.Images.forEach(function(image) {
              var project = parseInfo(image.Caption);
              project.image = image.TinyURL;
              project.album_id = yearData.album.id;
              project.album_key = yearData.album.Key;
              art[project.id] = project;
            });
            callback();
          }
        });
      }
    }
  });
}

$(document).ready(function() {
  var parts = window.location.search;
  parts = parts.replace("?", "").split('&');
  var year = 2012;
  var edit = false;
  parts.forEach(function(part) {
    var key_val = part.split('=');
    if (key_val[0] == 'embed') embedMode = true;
    else if (key_val[0] == 'year') year = key_val[1];
    else if (key_val[0] == 'edit') edit = true;
  });

  $('h1').text(year + ' Art Map');
  $('#back-archive').attr('href', 'archive.htm#' + year);
  
  if (embedMode) {
    $("h1,h2").hide();
    skydiveTarget = 17;
    map_options.showCopyright = false;
  }

  map = new Microsoft.Maps.Map($("#mapdiv")[0], map_options);
  getProjects(year, ensureArtDisplayed);
  
  Microsoft.Maps.EntityCollection.prototype.forEach = function(callback) {
    for (var i = 0; i < this.getLength(); i++) callback(this.get(i));
  }
  
  Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function(e) {
    if (skydive == SkyDiveState.RUNNING && map.getZoom() == skydiveTarget) {
      skydive = SkyDiveState.DONE;
      ensureArtDisplayed();
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

function ensureArtDisplayed() {
  if (art == null || skydive != SkyDiveState.DONE) return;
  var artPins = [];
  for (id in art) {
    var pin = makePin(id, art[id]);
    artPins.push(pin);
    map.entities.push(pin);
  }
  art = artPins; 
}

function makePin(id, piece) {
  piece.id = id;
  var thumbURL = function(size) {
      return piece.image.replace(/\/Ti\//g, "/" + size + "x" + size + "/")
            .replace(/-Ti\./g, "-" + size + "x" + size + ".");
  }
  var pin = new Microsoft.Maps.Pushpin(
    new Microsoft.Maps.Location(piece.position[0], piece.position[1]),
    { typeName: "artpiece", text: (embedMode) ? '' : piece.title,
      icon: thumbURL(SIZE_FOR_ZOOM[map.getZoom()]),
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
    $("#project").show(30, function() { displayProject(piece, '#galleria') });
  });
  $("#closebox").click(function() {
      $('#project').hide();
      unloadProject("#gallery");
  });

  return pin;
}

function updateArtForZoom(zoom) {
  art.forEach(function(piece) { 
    if (zoom > 16) {
      piece.setVisibility(true);
      
      piece.setThumbSize(SIZE_FOR_ZOOM[zoom]);
    } else piece.setVisibility(false);
  });
}
