  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
  <head>
    <link href='http://fonts.googleapis.com/css?family=Josefin+Slab:600' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,300italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="map_style.css" />
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
    <script charset="UTF-8" type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
    <script type="text/javascript" src="js/map.js"></script>
    <script src="js/simple-smugmug.js"></script>
    <script src="js/galleria/galleria-1.2.7.min.js"></script>
    <script src="js/project.js"></script>
  </head>
  <body>
    <div id="mapdiv"></div>
    <h1>Nowhere Art Archive</h1>
    <h2>
      <a href="http://goingnowhere.org/">&lt; Nowhere</a> <a href="archive.php">&lt; Art Archive</a>
    </h2>

    <div id="project">
      <div id="project-info">
        <div id="closebox"><a href="javascript:void(0)">CLOSE</a></div>
          <div id="title"></div>
          <div id="artist_info">
            by <span id="artist"></span>
            from <span id="country"></span>
            <img id="flag" height=15 width=30/>
          </div>
          <div id="description"></div>
        </div>
        <div id="galleria"></div>
      </div>
    </div>
  </body>
</html>