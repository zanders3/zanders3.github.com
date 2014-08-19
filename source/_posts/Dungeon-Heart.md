title: Dungeon Heart
date: 2013-1-27
tags:
- Unity
- C#
categories:
- Portfolio
---

Dungeon Heart was a game made in 48 hours with the [Alex Trowers](http://alextrowers.blogspot.co.uk/) and [Leanne Bayley](http://huhjustablog.blogspot.co.uk/) as part of the 2013 [http://globalgamejam.org/](Global Game Jam) game jamming competition. We even managed to get a good 7 hours sleep and got the game we planned to make finished on time!

The theme was 'Heartbeats' so naturally as big fans (and for some of us ex-employees) of Bullfrog we made a Dungeon Keeper clone, since Dungeon Keeper has a heart in the middle. The game was built with the Unity Game Engine using C#. I find Unity one of the easiest game engines to use, and it is the perfect tool for prototyping and game jamming.

At first we decided how to best split up the work. It was decided that I would focus on the code, Leanne on the Art and Trowers would handle the game design and jump into the other two disciplines where needed. 

Day 1
-----

To start with I focused on getting a basic tile based map engine going, and we made a decision to go 3D. Leanne started cranking out some monsters whilst Trowers searched for sound effects and started throwing some particle effects together. Each level used a really simple text file to define each level layout, with each different character in the text file representing a tile in the map in the level. This allowed us to create a whole bunch of levels really quickly.

So I got that all up and running and then started to focus on the biggest, scariest task - AI Pathfinding! Whilst I knew about the A* pathfinding algorithm and how it worked, I had never attempted to write one from scratch during a game jam before. Luckily thanks to [this fantastic explanation](http://www.policyalmanac.org/games/aStarTutorial.htm) and some fixing of a few off by one errors I managed to get a basic pathfinding system working.

I then spent the next few hours setting up a basic AI system. None of the characters in the game were controlled directly and instead needed to decide for themselves where they needed to go. This was done using [Dijkstra's algorithm](Dijkstra's_algorithm), a variant of A* to find the nearest target. For good characters their targets involved other creatures as a first priority, followed by the Dungeon Heart itself. For the evil creatures they simply targeted the nearest (in map steps) good creature.

The AI system also had a really simple animation system that made the characters jump and move between tiles to the time of the Dungeon's Heartbeat.

There were 6 character types implemented in the game - 3 good and 3 evil. Naturally the good guys are sneaking into your dungeon and trying to smash up your Dungeon Heart whilst the evil player needs to defend the Dungeon by setting trapdoors (a last minute inclusion, but one of the best bits) and clicking on spawn points at the correct time. If you clicked the spawn point on the beat of the heartbeat three times in row then you would spawn the most powerful creature, two times for the second most powerful and once for the least. Mess up your timing and nothing would happen! The balancing and implementation of the spawn timing system was done by Trowers whilst I was sorting out the pathfinding and character AI system.

By the end of the first night we were in a pretty good position - we had a basic pathfinding system with good creatures pathfinding to the Dungeon Heart but not doing any damage.

Day 2
-----

So with the solid start from the previous day things were looking pretty good the following morning! The final day was spent implementing the final gameplay design making the two different sides attack each other by introducing an attack system and hit points to each character. I also set up the victory and loss conditions, making the Dungeon Heart beat faster when you are about to lose, creating lots of tension in the final moments.

The rest of the day was spent getting multiple levels with multiple waves of enemies working and fixing lots of bugs that had popped up over time. Trowers also got the sound effects plugged in and threw some quick designs for multiple levels together. Leanne had by this point finished all of the art so was making papercraft of the characters in the game.

