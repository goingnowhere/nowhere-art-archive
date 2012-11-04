<?php
error_reporting(E_ALL);
ini_set('display_errors', True);

include "headfoot.php";
$NOT_FOUND_DESCRIPTION = "The art project you are looking for was not found in the archive. Sorry !<br> Please contact artchive@goingnowhere.org and we'll fix it.";
$isAjax = isset($_GET['ajax']);

function display_project($p, $isAjax) 
{
if (!$isAjax) {
?>
<div id="header">
  <a href="http://goingnowhere.org/">&lt; Nowhere</a> <a href="archive.php">&lt; Art Archive</a>
</div>
<? } ?>
<div id="main">
  <div id="title"><?=$p ? $p->title : "Not Found" ?></div>
  <? if ($p) { ?>
  <div id="artist_info">
    by <span id="artist"><?=$p->artist ?></span>
    from <span id="country"><?=$p->country ?><img id="flag" height=15 width=30 src="http://www.geonames.org/flags/x/<?=strtolower($p->countryCode) ?>.gif"></span>
  </div>
  <? } ?>
  <div id="description"><?=$p ? $p->description : $NOT_FOUND_DESCRIPTION ?></div>
</div>
<div id="galleria"></div>
<?
}

$projectyear = intval($_GET['year'], 10);
$projectid = $_GET['id'];
$projectInfo = NULL;
$data = @file_get_contents("data/projects_" . $projectyear . ".json");
if ($data != FALSE) {
  $projects = json_decode($data);
  foreach ($projects as $id => $project) {
    if ($id == $projectid) {
      $projectInfo = $project;
      break;
    }
  }
}

if (!$isAjax) {
  head(array("gallery" => TRUE), ($projectInfo) ? array("album_id" => $projectInfo->album_id, "album_key" => $projectInfo->album_key) : array());
}
display_project($projectInfo, $isAjax);
if (!$isAjax) {
  foot();
}
?>