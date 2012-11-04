<?php
function head($features = array(), $args = array())
{
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-GB">
<head>
  <link href='http://fonts.googleapis.com/css?family=Josefin+Slab:600' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,300italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="style.css" />
  <? if (array_key_exists('jquery', $features) || array_key_exists('gallery', $features)) { ?>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
  <? } ?>
  
  <? if (array_key_exists('gallery', $features)) { ?>
  <script src="js/simple-smugmug.js"></script>
  <script src="js/galleria/galleria-1.2.7.min.js"></script>
  <script type="text/javascript">
	Galleria.loadTheme('js/galleria/themes/classic/galleria.classic.min.js');
	$(document).ready(function() {
	
	  albumID = '<?=(array_key_exists('album_id', $args)) ? $args['album_id'] : "MISSING" ?>';
	  albumKey = '<?=(array_key_exists('album_key', $args)) ? $args['album_key'] : "MISSING" ?>';

	  var smug = new SmugMug();
	  smug.call('login.anonymously', {}, function(result) {
	    var args = { AlbumID: albumID, AlbumKey: albumKey, Extras: 'LargeURL,SmallURL,LightboxURL' };
	    if (result.stat == "ok") smug.call('images.get', args, function(data,ok) {
	      if (ok) {
		var images = [];
		data.Album.Images.forEach(function(img) {
		  images.push({ image: img.LargeURL, link: img.LightboxURL });
		});
		Galleria.run('#galleria', { 
		  dataSource: images, height: 660, minScaleRatio: 1, maxScaleRatio: 1,
		  carousel: false, thumbnails: false, responsive: true,
		  autoplay: 5000, pauseOnInteraction: false
		});
	      }
	    });
	  });
	});
  </script>
  <? } ?>
  
  <? if (array_key_exists('map', $features)) { ?>
  <script src="http://openlayers.org/api/OpenLayers.js"></script>
  <script src="https://raw.github.com/mapstraction/mxn/master/source/mxn.js?(openlayers)" type="text/javascript"></script>
  <? } ?>
</head>
<body>
<?
}

function foot()
{
?>
</body>
</html>
<?
}
?>
