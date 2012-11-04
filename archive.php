<?php
include "headfoot.php";

function display_mainpage($targetyear) {
  ?>
  <div id="header">
    <a href="http://goingnowhere.org/">&lt; Nowhere</a>
  </div>
  <div id="main">
    <div id="title">Art Archive</div>
    <ul id="timeline">
    <?
    $themedescription = NULL;
    $years = json_decode(file_get_contents("data/years.json"));
    foreach ($years as $year => $yearInfo) {
      if ($year == $targetyear && property_exists($yearInfo, 'theme_description'))
	$themedescription = $yearInfo->theme_description;
    ?>
      <li class="year<?=($targetyear == $year) ? " current" : "" ?>">
	<h2><a href="archive.php?year=<?=$year ?>"><?=$year ?></a></h2> "<?=$yearInfo->theme ?>"
      </li>
    <? } ?>
    </ul>
      
    <?
    $i = 0;
    $data = @file_get_contents("data/projects_" . $targetyear . ".json");
    if ($data != FALSE) {
      $projects = json_decode($data);
      if ($themedescription != NULL) { ?><p><i><?=$themedescription ?></i></p><? }
      ?>
      <ul id="projects">
      <?
      foreach ($projects as $id => $project) {
	$i++;
      ?>
	<li class="project">
	  <div class="topsection">
            <a href="project.php?year=<?=$targetyear ?>&id=<?=$id ?>">
              <h3><?=$project->title ?></h3>
              <p class="artistInfo">by <?=$project->artist ?> (<?=$project->countryCode ?>)</p>
            </a>
          </div>
          <p><?=$project->description ?></p>
	</li>
      <? } ?>
      </ul>
    <? }
    if ($i == 0) { ?><p>We didn't manage to add any projects for this year to the archive yet. Please check back later.</p> <? }
    ?>
  </div>
  <?
}

$targetyear = intval($_GET['year'], 10);
if ($targetyear < 2000) $targetyear = 2012;

head(array('jquery' => TRUE));
display_mainpage($targetyear);
foot();
?>