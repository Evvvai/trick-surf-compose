<img align="center" src= "https://user-images.githubusercontent.com/66115913/129460181-8440da18-5022-467d-90bc-38842dde9800.jpg">

Trick surf project containing everything I've ever done. Just decided to combine everything into one, maybe someone will need... Can work for any map, but with two conditions. All multiple triggers on the map must be unique, and the trigger on the route can only be touched once. It's also worth keeping in mind that the maps are hardcoded in the plugin(**trick_gxd_detect**). If you need only one map, which will be selected from the list in the database, then you should use **trick_gxd_detect_one**. The details of the related aspects of this or that part of the project are prescribed in the folders to it.

> All jumps reset the execution of the trick, so decided our community, but you can make an exclusion for some triggers

There are also extras, such as a website that allows you to add tricks and view routes([**old versiobn site, without ssr**](https://github.com/Evvvai/trick-surf-frontend)), and the discord bot notifies you about the latest events on the server.

<img align="center" src= "https://user-images.githubusercontent.com/66115913/152298457-0808adb1-5fbc-45d1-9608-f6395a7de90f.png">

## Database

> The entire database storing all tables, procedures, views and data

## Backend

> Web server for the site, it can be used to create all entities and migrate everything else (viewers / procedures / triggers / workers)

## Maps

> All currently implemented maps are found in vmf / blend format with triggers and models accordingly

## Frontend

> Site to view all tricks, leaderboards, and the ability to add new tricks or modify existing ones

## Server-setup

> Server build in which there is everything to deploy the server

## Services

> Additional services for the main system, discord bot to notify about new records / completes / tricks. Tracking database events (situational, better not to use at all). Everything works through the message broker rabbitmq

## Sourcepawn

> Trick detecting

` Tracking and saving performed tricks`

> Saveloc

`Saving the current position and manipulating previous positions`

> Utils

`Additional useful functionality - noclip / zone teleporter / skin / etc`

> Show triggers

`Triggers brushes display`

> Time online

`Saving information about server visits`

> Top display

`Dynamic display of the top in the game using the label (there is no way to create without sewing into the map)`

## Mobile app

_in developmnet_

> A copy of the site for the mobile version

## Overlay GUI

_in developmnet_

> Overlay with trick route preview
