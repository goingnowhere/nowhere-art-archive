function parseInfo(text) {
    var info = {}
    text.split(/\n/g).forEach(function(line) {
        var eq = line.indexOf("=");
        if (eq != -1) {
          var key = $.trim(line.substr(0, eq));
          var value = $.trim(line.substr(eq + 1));
          if (key == "position") {
            value = value.split(/,/);
            value[0] = parseFloat(value[0]);
            value[1] = parseFloat(value[1]);
          }
          info[key] = value;
        }
    });
    return info;
}

function normalizeWords(words) { return $.trim(words.toLowerCase().replace(/[^0-9a-z]+/g, ' ')) }

/* Collect all info for albums that are named "Nowhere YEAR" and "Info YEAR".
 * For the latter parse the description field as a key=value pair per line */
function extractAlbum(words, album, years) {
  var year = parseInt(words.replace(/[^0-9]/g, ''), 10);
  if (year > 1990) {
    if (years[year] == undefined) years[year] = {};
    var words = normalizeWords(words);
    if (words.indexOf('nowhere') != -1) { years[year].album = album; return true; }
    else if (words.indexOf('info') != -1) {
      years[year].info = parseInfo(album.Description); 
      years[year].infoAlbum = album;
      return true;
    }
  }
  return false;
};

function collectYears(albums) {
  var years = {};
  
  albums.forEach(function(album) {
    extractAlbum(album.NiceName, album, years)
  });

  
  return years;
}

function filterAlbum(album, keyword) {
  return album.filter(function(picture) {
    if (keyword == "__other__") return picture.Keywords == "";
    else return $.inArray(keyword, picture.Keywords.split(", ")) != -1
  });
}
