/* Main configuration for the Galleria photo browser component. */
var galleriaConfiguration = { dataSource: [],
  height: 660, minScaleRatio: 1, maxScaleRatio: 1,
  carousel: false, thumbnails: false, responsive: true,
  autoplay: 3500, pauseOnInteraction: false,
}

var galleriaRunning = false;
var smug = new SmugMug();

function displayFail() {
  $("#title").text("Not Found");
  $("#description").text("The project was not found in the archive, sorry.");
  $("#artist_info").hide();
}

function displayProject(project, where) {
  if (!project) {
    displayFail();
  } else {
    $("#title").text(project.title);
    $("#artist").text(project.artist);
    $("#country").text(project.country);
    $("#flag").attr("src", "http://www.geonames.org/flags/x/" + project.countryCode.toLowerCase() + ".gif");
    $("#description").html(project.description);

    var smug = new SmugMug();
    var args = { AlbumID: project.album_id, AlbumKey: project.album_key, Extras: 'Keywords,LargeURL,SmallURL,LightboxURL' };
    smug.call('images.get', args, function(data,ok) {
      if (ok) {
        var images = [];
        filterAlbum(data.Album.Images, project.id).forEach(function(img) {
          images.push({ image: img.LargeURL, link: img.LightboxURL });
        });

        if (images.length > 0) {
          if (!galleriaRunning) {
            Galleria.run(where, galleriaConfiguration);
            Galleria.on("image", function(e) { 
              if (e.index == 0) $(where).css({ opacity: 1 });
            });
            galleriaRunning = true;
          }
          Galleria.get(0).load(images);
          Galleria.get(0).play(galleriaConfiguration.autoplay);
        } else {
          $("#description").append($("<p/>").text("We don't have any pictures for this project yet. Please check back later or send us some !"));
          $(where).css({ opacity: 0.01 });
        }
      }
    });
  }
}

function unloadProject(where) {
  Galleria.get(0).pause();
  $(where).css({ opacity: 0.01 });
}

$(document).ready(function() {
  Galleria.loadTheme('js/galleria/themes/classic/galleria.classic.min.js');

  var parts = window.location.search;
  parts = parts.replace("?", "").split('&');
  var project_id = null;
  var project_year = null;
  parts.forEach(function(part) {
    var key_val = part.split('=');
    if (key_val[0] == 'id') project_id = key_val[1];
    else if (key_val[0] == 'year') project_year = key_val[1];
  });

  if (project_year == null || project_id == null) {
    displayFail();
    return;
  }
                  
  smug.call("albums.get", { NickName: 'nowhere-art', Extras: 'Keywords,NiceName,Description' }, function(result) {
    if (result.stat == "ok") {
      years = collectYears(result.Albums);
      if (years[project_year]) {
        var yearData = years[project_year];
        var args = { AlbumID: yearData.infoAlbum.id,
                     AlbumKey: yearData.infoAlbum.Key,
                     Extras: "Keywords,Caption" };
        smug.call("images.get", args, function(result) {
          if (result.stat == "ok") {
            var project = null;
            result.Album.Images.forEach(function(image) {
              var info = parseInfo(image.Caption);
              if (info.id != project_id) return;
              project = info;
              console.log(yearData.album);
              project.album_id = yearData.album.id;
              project.album_key = yearData.album.Key;
            });
            if (project) displayProject(project);
            else displayFail();
          } else displayFail();
        });
      } else displayFail();
    } else displayFail();
  });
                
});