<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
  <head>
    <link href='http://fonts.googleapis.com/css?family=Josefin+Slab:600' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,300italic' rel='stylesheet' type='text/css'>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
    <script charset="UTF-8" type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
    <script type="text/javascript" src="js/map.js"></script>
    <? if ($_GET["edit"] == 1) { ?><script type="text/javascript" src="js/map_editor.js"></script><? } ?>
    <script src="js/simple-smugmug.js"></script>
    <script src="js/galleria/galleria-1.2.7.min.js"></script>

    <style>
      body { margin: 0px; padding: 0px; font-family: "Ubuntu"; height: 100% }
      #mapdiv { margin: 0px; }
      h1 {
        background-color: #000; /* fallback for browsers that don't support rgba */
        background-color: rgba(0, 0, 0, 0.5);
        color: white; font-size: 3em; font-family: "Josefin Slab";
        position: absolute; left: 0px; top: 0px; margin: 0px; padding: 14px; padding-right: 24px; padding-top: 8px;
        -moz-border-radius-bottomright: 44px; border-bottom-right-radius: 44px; height: 50px
      }
      .polylabel {
          font-size: 0.8em; max-width: 300px; min-width: 100px;
      }
      img { display: block; margin: 0px }
      
      .LogoContainer { opacity: 0.2 }
      
      .artpiece { white-space: nowrap; overflow: visible ! important; }
      .artpiece div { font-size: 0.75em ! important; font-family: "Ubuntu" ! important; color: black ! important }
      
      #project { width: 100%; height: 1800px; position: absolute; top: 100px; display: none }
      #project-info { padding: 25px; background-color: rgba(0,0,0,0.9); position: relative }
      #project-info a { color: white; text-decoration: none }
      #project-info #closebox { 
        position: absolute; top: 0px; right: 0px; padding: 6px;
        border-left-width: 2px; border-bottom-width: 2px; border-bottom-style: solid; border-left-style: solid;
        border-color: white; border-color: rgba(255, 255, 255, 0.75); -moz-border-radius-bottomleft: 8px; border-bottom-left-radius: 8px;
      }
      #blurb { color: white }
      
      #title { font-family: 'Josefin Slab', serif; font-size: 2.8em }
      #artist { margin-right: 60px }
      #artist, #country, h2 { font-size: 1.3em;  }
      #country { position: relative; padding-right: 40px; }
      #flag { margin-left: 8px; border: 2px solid black; position: absolute; right: 0px; bottom: 0px; }
      #description, #years { margin-right: 100px }
      #description { margin-top: 20px; margin-bottom: 20px  }
    </style>
  </head>
  <body>
    <div id="mapdiv"></div>
    <h1>Nowhere Art Archive</h1>
    <div id="project">
      <div id="project-info"><div id="closebox"><a href="javascript:unloadProject()">CLOSE</a></div><div id="blurb"></div></div>
      <div id="galleria"></div>
    </div>
    <!--div class="sidefade"><img src="gfx/side_right_fade.png"><img src="gfx/side_right_fade_low.png"></div-->
  </body>
</html>