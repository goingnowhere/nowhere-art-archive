## Nowhere Art Archive ##

This repository contains the source for the Nowhere Art Archive site.
Normally you can access the site here:
http://www.goingnowhere.org/artarchive/archive.htm

The website is meant to display picures and information about art installations
that were presented over the years at the Nowhere festival, in the Monegros
region of Spain.

The site is simply a front-end to display pictures from our photo storage on smugmug.com,
which you can access here directly: https://nowhere-art.smugmug.com/ (though it
does not make much sense as all photos are not organized in a way that make
sense for people).

The data is smugmug is accessed using simple AJAX calls to its API (see js/simple_smugmug.js)

The metadata for the photos (tags and captions), as well as the album they are
placed in, define how they will be viewed in the web site.

### Running the code ###

The site has been designed so that it can be run as-is, without the need to be
uploaded anywhere. As long as your machine has an internet connection, it will
work if you open archive.htm locally in your browser.

### Photo hosting structure ###

Only albums named "Nowhere YEAR" and "Info YEAR" are used, everything else is
ignored. YEAR is a four digits year (e.g. 2013) and represent the year of the
event when the pictures have been taken.

Each year several installations (also known as "projects") are presented.
Each project can have several photos in the archive, as well as some extra
information such as the artist who presented it, the description of the project, etc.

The "Nowhere" albums contain the actual pictures, while the "Info" albums
contain the information about the projects.

In each Info album, there is one picture for each project. The picture
is used as the thumbnail for the album when shown on the map, while the caption
for the picture contains some specially formatted metadata describing the project.

The caption is formatted similarly to an INI file, that is to say as a list of
name=value pairs, separated by newlines.
For example:

~~~~
id=heavenandhell
title=Heaven And Hell
artist=Raul Sorrosal
description=blablah
~~~~

Each of these pieces of metadata is meant to be displayed to the user, with the
exception of the "id".
Each id uniquely identifies a project, and is later used in "Nowhere" albums to
tag pictures belonging to that project.

Each Info album also contains some metadata of its own, at the album level.
This has the same INI format as the metadata for pictures, but describes infomation
about the event that took place on that specific year.

When looking at the "Nowhere" albums, you will only find pictures of projects,
and each will be tagged with the "id" of one or more projects.

### Maps ###

The site also shows maps displaying the location of projects on the event grounds.
This information is taken from the projects metadata as described above, in the
"location" key of each project's caption.

The festival moved various times over the years to different places, and therefore
for each "Info" album we have a "location" key at the album level which represents
the center point of that year's event location, so the map can be centered on the
right place.
