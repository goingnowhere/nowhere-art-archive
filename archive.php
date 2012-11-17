<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
<head>
  <link href='http://fonts.googleapis.com/css?family=Josefin+Slab:600' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,300italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="style.css" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
  <script>
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
        //$('#theme').html(yearData.theme_description);
        $('#smallmap').attr('src', 'map.php?embed=true&year=' + year).attr('opacity', 1);
        currentYear = year;
        
        $('#projects').empty();
        if (year.projects == undefined) {
          $.getJSON("data/projects_" + year + ".json", function(data) {
            var projects = sortProjects(data);
            years['y_' + year].projects = projects;
            projects.forEach(appendProject);
          }).error(function() {
            $('#theme').text("We didn't manage to add any projects for this year yet. Please check back later.");
            $('#smallmap').attr('opacity', 0);
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
            $('<a/>', { href: 'project.php?year=' + currentYear + '&id=' + project.id }).append(
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
  </script>
  <div id="header">
    <a href="http://goingnowhere.org/">&lt; Nowhere</a>
  </div>
  <div id="main">
    <div id="title">Art Archive</div>
    <ul id="timeline"/>
  </div>
  <div id="mapholder">
    <iframe id="smallmap"></iframe>
  </div>
  <ul id="projects"></ul>
</body>
</html>