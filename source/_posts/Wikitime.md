title: Wikitime
date: 2012-04-12
tags:
- Java
- Javascript
- Lucene
categories:
- Portfolio
---

Wikitime was my final year project of my BSc Computer Science degree at the University of Southampton. The system took the full english text from the whole of english wikipedia which is freely [available to download](http://en.wikipedia.org/wiki/Wikipedia:Database_download#English-language_Wikipedia) and attempted to position them on a timeline. A demo based on the [Simple English Wikipedia](http://simple.wikipedia.org/wiki/Main_Page) is available [here](http://wikitime.herokuapp.com/) thanks to [Heroku](https://www.heroku.com/).

![Famous Scottish Scientists](screen1.jpg)

Historical Event Extraction
---------------------------

To generate a timeline of every event in history the processing system first removed all syntax and formatting from the text. Since the raw text contains wikimedia formatting which is an undocumented and messy format with no official documentation this was achieved through use of lots of regular expressions. Next the text was split into sentences with the (Stanford Named Entity Recogniser)(http://nlp.stanford.edu/ner/) which also pulls out named entities giving additional information useful for later.

At this point we could start looking at the sentences in detail. The final algorithm ran a regular expression over each sentence searching for four consecutive numbers, e.g. 1990. It would then attempt to parse the date in the location around the number looking for months and days.

This system is clearly not foolproof and was very easily confused by pretty much all of the Maths pages in Wikipedia. This issue was resolved by doing a statistical analysis of the dates extracted from the page. If a date fell outside of two standard deviations of all of the dates of the page it would be discarded. In addition any events set more than 50 years in the future (e.g. 2050) or with negative years would be discarded. This really helped to clean things up.

![The Life of Christopher Columbus](screen2.jpg)

Finally all of these events were indexed into a [Lucene](http://lucene.apache.org/) index which could happily search over and retrieve the millions of events produced.

Processing the entire text of the english wikipedia was quite a challenge, since the file was around 44 GB uncompressed. To make the time to process this sane a threaded pipeline was written that splits the work over multiple threads, with queues between them. This allowed the whole wiki to be processed in around 12 hours on a reasonably powerful 12 core server my university left lying around ;)

The Website
-----------

The next challenge was the website needed to display the events in a reasonable way on screen.

![Website Homepage](screen3.jpg)
