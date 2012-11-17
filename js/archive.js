var currentYear = null;
var years = {};

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
  var yearData = years['y_' + year];
  if (yearData) {
    $("#timeline li").removeClass('current');
    $('#y_' + year).addClass('current');
    $('#smallmap').attr('src', 'map.htm?embed=true&year=' + year);
    $('#mapholder').attr('opacity', 1);
    currentYear = year;
    
    $('#projects').empty();
    if (year.projects == undefined) {
      $.getJSON("data/projects_" + year + ".json", function(data) {
        $('#message').hide();
        var projects = sortProjects(data);
        years['y_' + year].projects = projects;
        projects.forEach(appendProject);
        $('#catcher').click(function() { location.href = 'map.htm?year=' + year });
      }).error(function() {
        $('#message').show();
        $('#mapholder').attr('opacity', 0);
        $('#catcher').click(function() {})
      });
    } else for (id in year.projects) appendProject(id, year.projects[id]);
  }
}

function appendYear(year) {
  var id = 'y_' + year.year;
  years[id] = year;
  $('#timeline').append(
    $('<li/>', { class: 'year', id: id }).append(
      $('<h2/>').append(
        $('<a/>', { href: '#' }).text(year.year).on("click", function() {
          setCurrentYear(year.year); return false;
        })
      )
    ).append('"' + year.theme + '"')
  );
  if (currentYear == null) setCurrentYear(year.year);
}

function appendProject(project) {
  $("#projects").append(
    $('<li/>', { class: 'project' }).append(
      $('<div/>', { class: 'topsection' }).append(
        $('<a/>', { href: 'project.htm?year=' + currentYear + '&id=' + project.id }).append(
          $('<h3/>').text(project.title)
        ).append(
          $('<p/>', { class: 'artistInfo' }).text('by ' + project.artist + ' (' + project.countryCode + ')')
        )
      )
    ).append(
      $('<p/>').text(project.description)
    )
  );
}

$(document).ready(function() {
  $.getJSON("data/years.json", function(data) {
    data["years"].forEach(appendYear);

    var parts = window.location.search;
    parts = parts.replace("?", "").split('&');
    parts.forEach(function(part) {
      var key_val = part.split('=');
      if (key_val[0] == 'year') setCurrentYear(key_val[1]);
    });
  });
});
