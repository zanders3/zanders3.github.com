title: "Kinect Sports: Season Two"
date: 2014-08-18 14:23:16
tags:
C++
C#
Actionscript
Xbox 360
---
[Kinect Sports: Season Two](http://en.wikipedia.org/wiki/Kinect_Sports:_Season_Two) was a Xbox 360 game developed by [Rare](http://www.rare.co.uk/) with some assistance from [Big Park](http://bigpark.com/) for the Kinect as a direct sequel to the BAFTA award winning [Kinect Sports](http://en.wikipedia.org/wiki/Kinect_Sports) title. I worked on the game as a software intern as a gap year between my second and third year of University.

I arrived at the studio during the final few weeks of Kinect Sports bug testing, so I was pulled in to assist with some of the servers that would support the final game when launched. After that I was put onto the pre production tools team helping to prepare Kinect Sports: Season Two for production. This involved fixing bugs and improving the art content, localisation and performance metrics reporting pipelines working mainly in C#.

After this the game moved into production and I was moved onto the core engine team working in C++ where I wrote a new GPU and CPU profiler for the internal game engine. I was then put on the multiplayer team where I worked directly with Artists and Designers on the 'Challenge Play' gameplay mode for the final 6 months of the internship. This mode glued all of the various game modes together into a new mode which allowed you to challenge your Xbox Live friends and local profiles on the same Xbox asynchronously. 

Implementing this feature involved modifying the game code for each mode to support async challenges and implementing the user interface using a combination of C++ and Actionscript since Scaleform was used for the UI. Each game mode was implemented differently and in some cases by a team working from a remote office so this presented a challenge at times. There was also an online server component that directly queried a SQL Server to deliver notifications of a challenge from an Xbox Live friend directly from the main menu screen.
