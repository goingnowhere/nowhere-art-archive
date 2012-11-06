<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
<head>
  <link href='http://fonts.googleapis.com/css?family=Josefin+Slab:600' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,300italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="style.css" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
  <script src="js/simple-smugmug.js"></script>
  <script src="js/galleria/galleria-1.2.7.min.js"></script>
  <script src="js/project.js"></script>
  <script type="text/javascript">
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

      if (project_year == null || project_id == null) displayFail();
      $.getJSON('data/projects_' + project_year + '.json', function(data) {
        var project = data[project_id];
        displayProject(project, "#galleria");
      }).error(function() { displayFail(); });
    });
  </script>
</head>
<body>
  <div id="header">
    <a href="http://goingnowhere.org/">&lt; Nowhere</a> <a href="archive.php">&lt; Art Archive</a>
  </div>
  <div id="main">
    <div id="title"></div>
    <div id="artist_info">
      by <span id="artist"></span>
      from <span id="country"></span>
      <img id="flag" src="http://nerochiaro.net/gfx/logo.gif" width="30" height="15">
    </div>
    <div id="description"></div>
  </div>
  <div id="galleria"></div>
</body>
</html>