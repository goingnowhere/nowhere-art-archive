var editorLoaded = true;
var draggingPin = false;
var editTarget = null;
var editInfoBox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0),
  { title: "This point", visible: false, actions: [
    {label: 'Delete', eventHandler: function(e) { deletePointAt(editInfoBox.getLocation()) }}, 
    {label: 'Add Before', eventHandler: function(e) { addPointNear(editInfoBox.getLocation(), true) }}, 
    {label: 'Add After', eventHandler: function(e) { addPointNear(editInfoBox.getLocation(), false) }}
  ]}
);

function startEdit(structure) {
  editTarget = structure;
  map.entities.push(editInfoBox);
  if (editTarget.pins == null) {
    editTarget.pins = [];
    editTarget.getLocations().slice(0, -1).forEach(function(loc, i) { 
      editTarget.pins.push(createEditPin(loc, i));
    });
  }
}

function endEdit() {
  if (editTarget.pins) {      
    editTarget.pins.forEach(function(pin) { 
      map.entities.remove(pin);
    });
    editTarget.pins = null;
  }
  map.entities.remove(editInfoBox);
  
  var t = "[\n";
  editTarget.getLocations().forEach( function (loc) {
    t += '\t[' + loc.latitude + ', ' + loc.longitude + '],\n';
  });
  t += "]";
  console.log(t);

  editTarget = null;
}

function deletePointAt(location) {
  if (editTarget == null) return;
  var locs = editTarget.getLocations().slice(0, -1).filter(function(l) {
    return !Microsoft.Maps.Location.areEqual(location, l);
  });

  locs.push(locs[0]);
  
  editTarget.setLocations(locs);
  editTarget.pins = editTarget.pins.filter(function(pin) {
    if (!Microsoft.Maps.Location.areEqual(location, pin.getLocation())) return true;
    map.entities.remove(pin);
    return false;
  });
  editInfoBox.setOptions({visible: false});
}

function addPointNear(location, addBefore) {
  if (editTarget == null) return;
  var locs = editTarget.getLocations().slice(0, -1);
  for (var i = 0; i < locs.length; i++) {
    if (Microsoft.Maps.Location.areEqual(location, locs[i])) {
      var pixel = map.tryLocationToPixel(location);
      pixel.x -= 50;
      pixel.y -= 50;
      var at = (addBefore) ? i : i + 1;
      if (at <= 0) at = locs.length - 1;
      else if (at == locs.length) at = 0;
      newLoc = map.tryPixelToLocation(pixel);
      locs.splice(at, 0, newLoc);
      editTarget.pins.splice(at, 0, createEditPin(newLoc, at));
      break;
    }
  }
  locs.push(locs[0]);
      
  editTarget.setLocations(locs);
  editInfoBox.setOptions({visible: false});
}

function createEditPin(loc, i) {
  var pushpin = new Microsoft.Maps.Pushpin(loc, { draggable: true }); 
  pushpin.isPin = true;
  Microsoft.Maps.Events.addHandler(pushpin, 'dragstart', function(e) {
    e.entity.startPos = e.entity.getLocation();
  });
  Microsoft.Maps.Events.addHandler(pushpin, 'drag', function(e) {
    draggingPin = true;
  });
  Microsoft.Maps.Events.addHandler(pushpin, 'dragend', function(e) {
    onPinEndDrag(e.entity.startPos, e.entity.getLocation());
    e.entity.startPos = undefined;
    setTimeout(function() { draggingPin = false }, 50); // HACK:!!!
  });
  Microsoft.Maps.Events.addHandler(pushpin, 'click', function(e) {
    if (draggingPin) return;
    editInfoBox.setLocation(e.target.getLocation());
    editInfoBox.setOptions({visible: true});
  });
  
  map.entities.push(pushpin);
  return pushpin;
}

function onPinEndDrag(startPos, endPos) {
  var locations = editTarget.getLocations();
  for (var i = 0; i < locations.length - 1; i++) {
    if (Microsoft.Maps.Location.areEqual(locations[i], startPos)) {
      locations[i] = endPos;
      if (i == 0) locations[locations.length - 1] = locations[0];
      editTarget.setLocations(locations);
      return;
    }
  }
}

$(document).ready(function() {
  if (editorLoaded) {
    Microsoft.Maps.Events.addHandler(map, 'keypress', onKeyPress);
    structures.forEach(function(structure) {
      Microsoft.Maps.Events.addHandler(structure, 'click', changeEditTarget);
    });
    art.forEach(function(piece) {
      piece.setOptions({draggable: true});
      Microsoft.Maps.Events.addHandler(piece, 'dragend', function(e) {
        console.log("[" + piece.getLocation().latitude + ", " + piece.getLocation().longitude + "]");
      });
    });
  }
});
   
function onKeyPress(e) {
  if (editTarget == null) return;
  
  var w = 119; var a = 97; var s = 115; var d = 100;
  var shiftY = null; var shiftX = null;
  switch (e.keyCode) {
    case w: shiftY = -1; break;
    case a: shiftX = -1; break;
    case s: shiftY = +1; break;
    case d: shiftX = +1; break;
    default: return;
  }
  
  var newPoints = [];
  var coarseDelta = 10;
  editTarget.getLocations().forEach(function(point) {
    var pixels = map.tryLocationToPixel(point);
    if (shiftX !== null) pixels.x += shiftX * coarseDelta;
    if (shiftY !== null) pixels.y += shiftY * coarseDelta;
    newPoints.push(map.tryPixelToLocation(pixels));
  });
  editTarget.setLocations(newPoints);
  editTarget.pins.forEach(function(pin) {
    var pixels = map.tryLocationToPixel(pin.getLocation());
    if (shiftX !== null) pixels.x += shiftX * coarseDelta;
    if (shiftY !== null) pixels.y += shiftY * coarseDelta;
    pin.setLocation(map.tryPixelToLocation(pixels));
  });
}

function changeEditTarget(e) {
  if (e.targetType != "polygon") return;
  if (editTarget) endEdit();
  startEdit(e.target);
}

// NOT USED FOR NOW
// function simplePolygonCentroid(points) {
//   var sumY = 0; var sumX = 0; var partialSum = 0; var sum = 0;
//   var n = points.length;
// 
//   for (var i = 0; i < n - 1; i++) {
//     partialSum = points[i].longitude * points[i + 1].latitude - points[i + 1].longitude * points[i].latitude;
//     sum += partialSum;
//     sumX += (points[i].longitude + points[i + 1].longitude) * partialSum;
//     sumY += (points[i].latitude + points[i + 1].latitude) * partialSum;
//   }
// 
//   var area = 0.5 * sum;
// 
//   return new Microsoft.Maps.Location(sumY / 6 / area, sumX / 6 / area);
// }