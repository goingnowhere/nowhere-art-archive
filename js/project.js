/* Main configuration for the Galleria photo browser component. */
var galleriaConfiguration = { dataSource: [],
  height: 660, minScaleRatio: 1, maxScaleRatio: 1,
  carousel: false, thumbnails: false, responsive: true,
  autoplay: 3500, pauseOnInteraction: false,
}

var galleriaRunning = false;

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
    smug.call('login.anonymously', {}, function(result) {
      var args = { AlbumID: project.album_id, AlbumKey: project.album_key, Extras: 'LargeURL,SmallURL,LightboxURL' };
      if (result.stat == "ok") smug.call('images.get', args, function(data,ok) {
        if (ok) {
          var images = [];
          data.Album.Images.forEach(function(img) {
            images.push({ image: img.LargeURL, link: img.LightboxURL });
          });
          
          if (!galleriaRunning) {
            Galleria.run(where, galleriaConfiguration);
            Galleria.on("image", function(e) { 
              if (e.index == 0) $(where).css({ opacity: 1 });
            });
            galleriaRunning = true;
          }
          Galleria.get(0).load(images);
          Galleria.get(0).play(galleriaConfiguration.autoplay);
        }
      });
    });
  }
}

function unloadProject(where) {
  Galleria.get(0).pause();
  $(where).css({ opacity: 0.01 });
}

$(document).ready(function() {
  Galleria.loadTheme('js/galleria/themes/classic/galleria.classic.min.js');
});