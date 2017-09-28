<?php
require_once 'templates.html.php';
#<!DOCTYPE html>
#<html>
#    <head>
#        <meta charset="utf-8" />
#        <title>OpenScriptures Hebrew Bible</title>
#        <link rel="stylesheet" href="HomeFiles/OshbStyle.css" />
#    </head>
#    <body>
#        <header>
#            <img src="HomeFiles/Originally.png" width="127" height="127" alt="OpenScriptures Hebrew Bible logo" />
#            <h1><span>The OpenScriptures</span><br />Hebrew Bible</h1>
#        </header>
start_html();
?>        <article class="topic">
            <h2>About This Project</h2>
            <p>The Open Scripures Hebrew Bible is a project to analyze the Hebrew Bible 
            by lemma and morphology. The project is marked up in OSIS XML and currently 
            contains lemma attributes for most words (using Strong's numbers). Soon we 
            plan to begin adding morphology attributes as well.</p>
            
            <p>Lemma and morphology data are licensed under a
            <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons
            Attribution-ShareAlike</a> license. For 
            attribution purposes, credit the Open Scriptures Hebrew Bible Project. The 
            text of the WLC, including WLC.4.14b.zip in the download section, remains in 
            the <a href="http://creativecommons.org/licenses/publicdomain/">public domain</a>.</p>
        </article>
        <article class="topic">
            <h2>Resources</h2>
            <p>Our primary resource is the text of the
            <a href="https://github.com/openscriptures/morphhb">OpenScriptures Hebrew Bible</a>,
            recently updated to version 4.16 of the Westminster Leningrad Codex.</p>
            <p>The augmented Strong numbers in the OSHB are designed to tie into
            the Brown, Driver, Briggs, Hebrew and English Lexicon of the Old Testament
            and Strong's Concise Dictionary of the Words in the Hebrew Bible,
            both available in our
            <a href="https://github.com/openscriptures/HebrewLexicon">Hebrew Lexicon</a> project.
            We also include references to the numbering of the Theological Wordbook
            of the Old Testament, in the Lexical Index.</p>
            <p>The Hebrew Lexicon has just undergone a complete reformating. We have separated
            out the BDB and Strong's into individual references, with a cross-index
            containing basic lexical data and references. This lexical index can
            even be extended to address other works.</p>
            <p>Our morphology project is in the beginning stages, and is preparing
            to use the <a href="http://openscriptures.github.com/morphhb/parsing/HebrewMorphologyCodes.html">Hebrew Morphology Codes</a>
            to mark the text of the OSHB. A sample application for parsing these codes
            is available under <a href="https://github.com/openscriptures/morphhb/tree/master/parsing">Morph Parse</a>.</p>
        </article>
    </body>
</html>
