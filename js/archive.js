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
    $('#smallmap').attr('src', 'map.htm?embed=true&year=' + year);
    $('#mapholder').attr('opacity', 1);
    $('#catcher').click(function() { window.location.href = 'map.htm?year=' + year; });
    currentYear = year;
    
    $('#projects').empty();
    if (year.projects == undefined) {
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
        }
      });
    }
  }
}

function appendYear(year) {
  var id = 'y_' + year;
  yearData = years[year];
  var theme;
  if (yearData.info) theme = yearData.info.theme;
  $('#timeline').append(
    $('<li/>', { class: 'year', id: id }).append(
      $('<h2/>').append(
        $('<a/>', { href: '#' }).text(year).on("click", function() {
          setCurrentYear(year); return false;
        })
      )
    ).append((theme) ? '"' + theme + '"' : '')
  );
  if (currentYear == null) setCurrentYear(year);
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
  smug.call("albums.get", { NickName: 'nowhere-art', Extras: 'Keywords,NiceName,Description' }, function(result) {
  if (result.stat == "ok") {
      years = collectYears(result.Albums); 
      var dates = [];
      for (var year in years) dates.push(year);
      dates.sort();
      dates.reverse().forEach(appendYear);
    }
  });
});
