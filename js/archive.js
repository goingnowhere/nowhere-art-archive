var currentYear = null;
var years = {};
var smug = new SmugMug();

function sortProjects(projects) {
  var sorted = [];
  for (id in projects) {
    var project = projects[id];
    project.id = id;
    sorted.push(project);
  }
  return sorted.sort(function(a, b) { return a.title > b.title });
}

function setCurrentYear(year) {
  if (years[year]) {
    $("#timeline li").removeClass('current');
    $('#y_' + year).addClass('current');
    
    if (years[year].info && years[year].info.position) {
      $('#smallmap').attr('src', 'map.htm?embed=true&year=' + year);
      $('#mapholder').show();
    } else $('#mapholder').hide();
    
    $('#mapholder').attr('opacity', 1);
    $('#catcher').click(function() { window.location.href = 'map.htm?year=' + year; });
    currentYear = year;
    
    $('#projects').empty();
    if (year.projects == undefined) {
      function checkOtherPhotos() {
        /* Go through all the pictures for this year and see which ones have
          * no known project id in the tags, and create a new group for them at the bottom */
        var args = { AlbumID: years[year].album.id,
                      AlbumKey: years[year].album.Key,
                      Extras: "Keywords" };
        smug.call("images.get", args, function(result) {
          var otherCount = 0;
          if (result.stat == "ok") {
            result.Album.Images.forEach(function(image) {
              if (image.Keywords == "") otherCount++;
            });
          }
          if (otherCount > 0) appendProject(year, { info: { 
            id: "__other__",
            title: "Other projects",
            artist: "Various Artists",
            description: "" + otherCount + " more photos from various art projects that we haven't been able to identify or categorize yet"
          }});
        });
      }
      
      if (years[year].infoAlbum) {
        var args = { AlbumID: years[year].infoAlbum.id,
                    AlbumKey: years[year].infoAlbum.Key,
                    Extras: "Keywords,Caption,TinyURL" };
        smug.call("images.get", args, function(result) {
          if (result.stat == "ok") {
            var projects = []
            result.Album.Images.forEach(function(image) {
                var project = { info: parseInfo(image.Caption) }
                project.image = image;
                projects.push(project);
            });
            projects.sort(function(a, b) { if (a.info.title > b.info.title) return 1; else -1 });
            projects.forEach(function(project) { appendProject(year, project); });
            checkOtherPhotos();
          }
        })
      } else checkOtherPhotos();
    }
  }
}

function appendYear(year) {
  var id = 'y_' + year;
  yearData = years[year];
  var theme;
  var f = function() { setCurrentYear(year); window.location.hash = year; return false; }
  if (yearData.info) theme = yearData.info.theme;
  $('#timeline').append(
    $('<li/>', { class: 'year', id: id }).append(
      $('<h2/>').append(
        $('<a/>', { href: '#' + year }).text(year).on("click", f)
      )
    ).append($('<div/>', { class: 'theme' }).append($('<a/>', { href: ('#' + year) }).text(year).on("click", f).text((theme) ? theme : '')))
  );
}

function appendProject(year, project) {
  $("#projects").append(
    $('<li/>', { class: 'project' }).append(
      $('<div/>', { class: 'topsection' }).append(
        $('<a/>', { href: 'project.htm?year=' + year + '&id=' + project.info.id }).append(
          $('<h3/>').text(project.info.title)
        ).append(
          $('<p/>', { class: 'artistInfo' }).text('by ' + project.info.artist + ' (' + project.info.countryCode + ')')
        )
      )
    ).append(
      $('<p/>').text(project.info.description)
    )
  );
}



$(document).ready(function() {
  var requested_year = window.location.hash.replace("#", "");
    
  smug.call("albums.get", { NickName: 'nowhere-art', Extras: 'Keywords,NiceName,Description' }, function(result) {
  if (result.stat == "ok") {
      years = collectYears(result.Albums); 
      var dates = [];
      for (var year in years) dates.push(year);
      dates.sort();
      dates = dates.reverse();
      dates.forEach(appendYear);
      if (requested_year != null && years[requested_year]) setCurrentYear(requested_year);
      if (currentYear == null) setCurrentYear(dates[0]);
    }
  });
});
