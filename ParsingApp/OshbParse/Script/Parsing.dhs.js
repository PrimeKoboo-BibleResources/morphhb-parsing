/**
 * @fileOverview Parsing is the JavaScript controller for OSHB parsing.
 * @version 1.0
 * @author David
 */
(function() {
var Ajax = function()                           // Ajax library.
{ var url, responseFunction, postData;
     
  this.setUrl = function(value)               { url = value; };
  this.setResponseFunction = function(value)  { responseFunction = value; };
  this.setPostData = function(value)          { postData = value; };
  var getXhr = function()                       // Gets the XMLHttpRequest.
  { var xhr = false;
    if      (window.XMLHttpRequest)   { xhr = new XMLHttpRequest(); } 
    else if (window.ActiveXObject)    
    { try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); }
      catch(e) 
      { try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }
        catch(e) { xhr = false; }
      }
    }
    return xhr;
  };
  this.getResponse = function()
  { var request = getXhr();
     if (request) 
     { request.onreadystatechange = function() { parseResponse(request); };
       if (postData) 
       { request.open("POST", url, true);
         request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
         request.send(postData);
       } 
       else { request.open("GET", url, true); request.send(null); }
     }
  };
var parseResponse = function(request)
{ if (request.readyState === 4) 
  { if (request.status === 200 || request.status === 304) { responseFunction(request); } }
};
};
// Summary of Hebrew morphology codes.
    var morphCodes = {
        'partOfSpeech': {
            'A': 'Adjective',
            'C': 'Conjunction',
            'D': 'Adverb',
            'N': 'Noun',
            'P': 'Pronoun',
            'R': 'Preposition',
            'S': 'Suffix',
            'T': 'Particle',
            'V': 'Verb'
        },
        'adjectiveType': {
            'a': 'adjective',
            'c': 'cardinal number',
            'g': 'gentilic',
            'o': 'ordinal number',
            'x': ''
        },
        'conjunctionType': {
            'c': 'conjunctive',
            'v': 'vav consecutive'
        },
        'nounType': {
            'c': 'common',
            'g': 'gentilic',
            'p': 'proper name',
            'x': ''
        },
        'pronounType': {
            'd': 'demonstrative',
            'f': 'indefinite',
            'i': 'interrogative',
            'p': 'personal',
            'r': 'relative',
            'x': ''
        },
        'suffixType': {
            'd': 'directional he',
            'h': 'paragogic he',
            'n': 'paragogic nun',
            'p': 'pronominal',
            'x': ''
        },
        'particleType': {
            'a': 'affirmation',
            'd': 'definite article',
            'e': 'exhortation',
            'i': 'interrogative',
            'j': 'interjection',
            'm': 'demonstrative',
            'n': 'negative',
            'o': 'direct object marker',
            'p': 'definite article with inseparable preposition',
            'r': 'relative'
        },
        'verbStemHebrew': {
            'q': 'qal',
            'N': 'niphal',
            'p': 'piel',
            'P': 'pual',
            'h': 'hiphil',
            'H': 'hophal',
            't': 'hithpael',
            'o': 'polel',
            'O': 'polal',
            'r': 'hithpolel',
            'm': 'poel',
            'M': 'poal',
            'k': 'palel',
            'K': 'pulal',
            'Q': 'qal passive',
            'l': 'pilpel',
            'L': 'polpal',
            'f': 'hithpalpel',
            'D': 'nithpael',
            'j': 'pealal',
            'i': 'pilel',
            'u': 'hothpaal',
            'c': 'tiphil',
            'v': 'hishtaphel',
            'w': 'nithpalel',
            'y': 'nithpoel',
            'z': 'hithpoel',
            'x': ''
        },
        'verbStemAramaic': {
            'q': 'peal',
            'Q': 'peil',
            'u': 'hithpeel',
            'N': 'niphal',
            'p': 'pael',
            'P': 'ithpaal',
            'M': 'hithpaal',
            'a': 'aphel',
            'h': 'haphel',
            's': 'saphel',
            'e': 'shaphel',
            'H': 'hophal',
            'i': 'ithpeel',
            't': 'hishtaphel',
            'v': 'ishtaphel',
            'w': 'hithaphel',
            'o': 'polel',
            'z': 'ithpoel',
            'r': 'hithpolel',
            'f': 'hithpalpel',
            'b': 'hephal',
            'c': 'tiphel',
            'm': 'poel',
            'l': 'palpel',
            'L': 'ithpalpel',
            'O': 'ithpolel',
            'G': 'ittaphal',
            'x': ''
        },
        'verbAspect': {
            'a': 'infinitive absolute',
            'c': 'infinitive construct',
            'h': 'cohortative',
            'i': 'imperfect',
            'j': 'jussive',
            'p': 'perfect',
            'q': 'sequential perfect',
            'r': 'participle active',
            's': 'participle passive',
            'v': 'imperative',
            'w': 'sequential imperfect',
            'x': ''
        },
        'adjCase': {
            'a': 'accusative',
            'n': 'nominative',
            'x': ''
        },
        'person': {
            '1': 'first person',
            '2': 'second person',
            '3': 'third person',
            'x': ''
        },
        'gender': {
            'b': 'both',
            'c': 'common',
            'f': 'feminine',
            'm': 'masculine',
            'x': ''
        },
        'number': {
            'd': 'dual',
            'p': 'plural',
            's': 'singular',
            'x': ''
        },
        'state': {
            'a': 'absolute',
            'c': 'construct',
            'd': 'determined'
        },
        'language': {
            'H': 'Hebrew',
            'A': 'Aramaic'
        }
    };
var MorphParse = function()                     // Parser for morphology codes.
{ var language, nextName;                       // @param {string} code A morph code;  @returns (string} The morphology
        this.Parse = function(code) {
            if (!code)                  {return {"morph": "", "next": "language", "segs": 0};}
            language = code.charAt(0);
            var morph = morphCodes.language[language];

            if (!morph)                 { return {"morph": "Unknown language", "next": "error", "segs": 0}; }
            code = code.substr(1);
            if (code) 
            { var parts = code.split('/'), i = 1, len = parts.length;
              morph += ' ' + parseCode(parts[0]);
              for (; i < len; i++) { morph += ', ' + parseCode(parts[i]); }
            } 
            else { nextName = 'partOfSpeech'; }
            len = len ? len - 1 : 0;
            return {"morph": morph, "next": nextName, "segs": len};
        };
        var parseCode = function(code) {
            if (!code)  { nextName = 'partOfSpeech'; return ''; }

            var pos = code.charAt(0);
            var morph = morphCodes.partOfSpeech[pos];
            if (!morph) { nextName = 'error'; return "Unknown part of speech"; }
            if (code.length > 1) 
            { switch (pos) 
              { case 'A': morph += ' ' + parseAdjective(code);   break;
                case 'C': morph += ' ' + parseConjunction(code); break;
                case 'D': nextName = 'error'; morph += ' ' + "Unknown separator"; break;
                case 'N': morph += ' ' + parseNoun(code); break;
                case 'P': morph += ' ' + parsePronoun(code); break;
                case 'R': nextName = 'error'; morph += ' ' + "Unknown separator"; break;
                case 'S': morph += ' ' + parseSuffix(code);     break;
                case 'T': morph += ' ' + parseParticle(code);   break;
                case 'V': morph += ' ' + parseVerb(code);       break;
                default:  morph += ' Unknown part of speech in ' + code;
              }
            }
            else 
            { switch (pos) 
              { case 'A': nextName = 'adjectiveType';   break;
                case 'C': nextName = 'conjunctionType'; break;
                case 'D': nextName = 'separator';       break;
                case 'N': nextName = 'nounType';        break;
                case 'P': nextName = 'pronounType';     break;
                case 'R': nextName = 'separator';       break;
                case 'S': nextName = 'suffixType';      break;
                case 'T': nextName = 'particleType';    break;
                case 'V': if (language === 'H') { nextName = 'verbStemHebrew'; } else { nextName = 'verbStemAramaic'; }
                          break;
                default:  nextName = 'error';
              }
            }
            return morph;
        };
        var parseAdjective = function(code) {
            var morph = morphCodes.adjectiveType[code.charAt(1)];
            if (!morph) { nextName = 'error'; return "Unknown adjective type"; }
            if (code.length > 2) { morph += ' ' + parseGender(code, 2); } 
            else { nextName = 'gender'; }
            return morph;
        };
        var parseConjunction = function(code) {
            var morph = morphCodes.conjunctionType[code.charAt(1)];
            if (!morph)             { nextName = 'error'; return "Unknown conjunction type"; }
            if (code.length > 2)    { nextName = 'error'; return "Unknown separator"; } 
            else                    { nextName = 'separator'; }
            return morph;
        };
        var parseNoun = function(code) {
            var morph = morphCodes.nounType[code.charAt(1)];
            if (!morph)             { nextName = 'error'; return "Unknown noun type"; }
            if (code.length > 2)    { morph += ' ' + parseGender(code, 2); } 
            else                    { nextName = 'gender'; }
            return morph;
        };
        var parsePronoun = function(code) {
            var morph = morphCodes.pronounType[code.charAt(1)];
            if (!morph)             { nextName = 'error'; return "Unknown pronoun type"; }
            if (code.length > 2)    { morph += ' ' + parseCase(code); } 
            else                    { nextName = 'adjCase'; }
            return morph;
        };
        var parseSuffix = function(code) {
            var morph = morphCodes.suffixType[code.charAt(1)];
            if (!morph)             { nextName = 'error'; return "Unknown suffix type"; }
            if (code.length > 2)    { morph += ' ' + parsePerson(code, 2); } 
            else                    { nextName = 'person'; }
            return morph;
        };
        var parseParticle = function(code) {
            var morph = morphCodes.particleType[code.charAt(1)];
            if (!morph)             { nextName = 'error'; return "Unknown particle type"; }
            if (code.length > 2)    { nextName = 'error'; return "Unknown separator"; } 
            else                    { nextName = 'separator'; }
            return morph;
        };
        var parseVerb = function(code) {
            var morph;
            if (language === 'H')   { morph = morphCodes.verbStemHebrew[code.charAt(1)]; } 
            else                    { morph = morphCodes.verbStemAramaic[code.charAt(1)]; }
            if (!morph)             { nextName = 'error'; return "Unknown verb stem"; }
            if (code.length > 2)    { morph += ' ' + parseAspect(code); } 
            else                    { nextName = 'verbAspect'; }
            return morph;
        };
var parseAspect = function(code) {
            var morph = morphCodes.verbAspect[code.charAt(2)];
            if (!morph) { nextName = 'error'; return "Unknown verb aspect"; }
            if (code.length > 3)    { morph += ' ' + parsePerson(code, 3); } 
            else                    { nextName = 'person'; }
            return morph;
};
var parseCase = function(code) {
            var morph = morphCodes.adjCase[code.charAt(2)];
            if (!morph) { nextName = 'error'; return "Unknown case"; }
            if (code.length > 3) { morph += ' ' + parsePerson(code, 3); } 
            else { nextName = 'person'; }
            return morph;
};
var parsePerson = function(code, pos) {
            var morph = morphCodes.person[code.charAt(pos)];
            if (!morph)                 { nextName = 'error'; return "Unknown person"; }
            if (code.length > ++pos)    { morph += ' ' + parseGender(code, pos); } 
            else                        { nextName = 'gender'; }
            return morph;
};
var parseGender = function(code, pos) {
            var morph = morphCodes.gender[code.charAt(pos)];
            if (!morph)                 { nextName = 'error'; return "Unknown gender"; }
            if (code.length > ++pos)    { morph += ' ' + parseNumber(code, pos); } 
            else                        { nextName = 'number'; }
            return morph;
};
var parseNumber = function(code, pos) {
            var morph = morphCodes.number[code.charAt(pos)];
            if (!morph)             { nextName = 'error'; return "Unknown number"; }
            if (code.length > ++pos)  { morph += ' ' + parseState(code, pos); } 
            else                    { nextName = 'state'; }
            return morph;
};
var parseState = function(code, pos) {
            var morph = morphCodes.state[code.charAt(pos)];
            if (!morph)             { nextName = 'error'; return "Unknown state"; }
            if (code.length > ++pos)  { nextName = 'error'; return "Unknown separator"; } 
            else                    { nextName = 'separator'; }
            return morph;
};
};

// Interface elements.
(function() {
var books = {"Gen": "50", "Exod": "40", "Lev": "27", "Num": "36", "Deut": "34", "Josh": "24", "Judg": "21", "1Sam": "31", "2Sam": "24", "1Kgs": "22", "2Kgs": "25", "Isa": "66", "Jer": "52", "Ezek": "48", "Hos": "14", "Joel": "4", "Amos": "9", "Obad": "1", "Jonah": "4", "Mic": "7", "Nah": "3", "Hab": "3", "Zeph": "3", "Hag": "2", "Zech": "14", "Mal": "3", "Ps": "150", "Prov": "31", "Job": "42", "Song": "8", "Ruth": "4", "Lam": "5", "Eccl": "12", "Esth": "10", "Dan": "12", "Ezra": "10", "Neh": "13", "1Chr": "29", "2Chr": "36"};
var wordList = [];

var elements = {                                    // Retains references to frequently used elements.
  "parser":     document.getElementById('parser'),
  "text":       document.getElementById('text'),
  "wordBox":    document.getElementById('wordBox'),
  "morph":      document.getElementById('morph'),
  "morphHint":  document.getElementById('morphHint'),
  "morphText":  document.getElementById('morphText'),
  "foreWord":   document.getElementById('foreWord'),
  "backWord":   document.getElementById('backWord'),
  "apply":      document.getElementById('apply'),
  "book":       document.getElementById('book'),
  "chapter":    document.getElementById('chapter')
};


//===========================================================================================================================
// Utility functions.
//===========================================================================================================================
var clearNodes  = function(elem)        { // Utility function to clear child nodes from an element.
  while (elem.childNodes.length > 0) { elem.removeChild(elem.firstChild); } 
};

var position    = function(element)     { // Utility to find the position of an element.
  var pos = {top: 0, left: 0};
  while (element) {
    pos.top += element.offsetTop;
    pos.left += element.offsetLeft;  
    element = element.offsetParent;
  }
  return pos;
};

var enterKey    = function(e)           { // Checks if Enter is pressed.
  e = e ? e : event;
  var keycode = e.keyCode;
  return (keycode === 13);
};

        var setClass    = function(node, name)  { // Sets or removes an additional class name.
            var names = node.className.split(' ');
            name = name ? names[0] + ' ' + name : names[0];
            node.className = name;
        };
var setTitle    = function(node, title) { // Sets or removes an additional title.
  var titles = node.title.split("\n");
  title = title ? titles[0] + "\n" + title : titles[0];
  node.title = title;
};
var getParsing  = function(node)        { // Gets the parsing from the title.
  var titles = node.title.split("\n");
  if (titles.length > 1) { setClass(node, 'done'); return titles[1]; }
  return '';
};
//===========================================================================================================================
// Word handling.
//===========================================================================================================================
var wordObject = function(node)         { // Maintains word data in word list and stacks.
  var parsing = getParsing(node);
  return { 
    getNode: function()         { return node; },
    setParsing: function(value) { parsing = value; setTitle(node, parsing); setClass(node, 'done'); },
    getParsing: function()      { return parsing; }
  };
};
var currentWord = function()            { // Maintains the index of the current word.
  var index = -1;
  return {
    getIndex: function()    { return index; },
    setIndex: function(i)   {
      if (index >= 0 && wordList[index]) {
        var node = wordList[index].getNode();
        node.className = node.className.replace(' current', '');
      }
      index = i;
      setClass(wordList[index].getNode(), 'current');
      return wordList[index].getParsing();
    }
  };
}();
var wordSegments = function()           { // Manages word segments.
  var segmentNodes = [], currentIndex = 0, last;
  return {
    setWord: function(word) {
      var segments = word.split('/'), i = 0, len = segments.length;
      last = segments.length - 1;
      clearNodes(elements.wordBox);
      segmentNodes = [];
      for (; i <= last; i++) {
        var span = document.createElement('span');
        span.className = 'seg';
        span.appendChild(document.createTextNode(segments[i]));
        wordBox.appendChild(span);
        segmentNodes.push(span);
      }
      currentIndex = 0;
      setClass(segmentNodes[0], 'current');
    },
    selectSegment: function(index) { 
      if (index <= last) 
      { var currentNode = segmentNodes[currentIndex];
        setClass(currentNode, '');
        currentIndex = index;
        setClass(segmentNodes[index], 'current');
      }
    },
    isLast: function() { return currentIndex === last; }
  };
 }();
var nameTitle = function(name)          { // Converts camel case name to title case.
  function insertSpace(match) { return ' ' + match; };
  var spaced = name.replace(/[A-Z]/g, insertSpace);
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};
var hintLine = function(code, value)    { // Constructs a list item for the hint dropdown.
  var text = code + ': ' + value;
  var item = document.createElement('li');
  item.appendChild(document.createTextNode(text));
  item.setAttribute('title', code);
  item.addEventListener("click", 
    function() {
      elements.morph.value += this.title;
      elements.morphHint.style.display = 'none';
      morphChange();
    }, 
    false);
  return item;
};
var enterLine = function()              { // Constructs a list item for the hint dropdown.
  var item = document.createElement('li');
  item.appendChild(document.createTextNode('Enter: Apply parsing'));
  item.setAttribute('title', 'Enter');
  item.addEventListener("click", function() { elements.morphHint.style.display = 'none'; applyClick(); }, false);
  return item;
 };
var hintDropdown = function(name)       { // Sets up the hint dropdown.
  elements.morph.className = '';
  clearNodes(elements.morphHint);
  var ed = document.createElement('div');
  var title = document.createElement('h3');
  title.appendChild(document.createTextNode(nameTitle(name)));
  ed.appendChild(title);

  // Append hints.
  var list = document.createElement('ul');
  var obj = morphCodes[name];
  for (var code in obj) { list.appendChild(hintLine(code, obj[code])); }
  if (name !== 'language') {
    if (wordSegments.isLast()) { list.appendChild(enterLine()); } 
    else { list.appendChild(hintLine('/', 'Morphological separator')); }
  }
  ed.appendChild(list);
  elements.morphHint.appendChild(ed);

  // Display the dropdown.
  var pos = position(elements.morph);
  elements.morphHint.style.top = pos.top + elements.morph.offsetHeight + 'px';
  elements.morphHint.style.left = pos.left + 'px';
  elements.morphHint.style.display = 'block';
};
var lang        = function()            { // Manages language selection.
   var code = 'H';
   return { 
     hebClick: function() { code = 'H'; }, 
     arcClick: function() { code = 'A'; }, 
     getCode:  function() { return code; } 
   };
 }();

var parser = new MorphParse;            // An instance of MorphParse.

var morphChange = function() {        // Change handler for the morphology input box.
  clearNodes(elements.morphText);
  var verbal = parser.Parse(elements.morph.value);
  wordSegments.selectSegment(verbal.segs);
  elements.morphText.appendChild(document.createTextNode(verbal.morph));
  if (verbal.next === 'error') {
    elements.morph.className = 'error';
    elements.morphHint.style.display = 'none';
  } 
  else { hintDropdown(verbal.next); }
  elements.morph.focus();
};

var wordSelect = function(node, index) {        // Sets the node as selected.
  var parsing = currentWord.setIndex(index);
  wordSegments.setWord(node.innerHTML);
  elements.morph.focus();
  if (parsing)    { elements.morph.value = parsing; } 
  else            { elements.morph.value = lang.getCode(); }
  morphChange();
};

var processWords = function() {                             // Process words in the text article.
  elements.parser.style.visibility = 'visible';
  elements.morph.value = '';
  wordList = [];
  var spans = elements.text.getElementsByTagName('span');
  var i = 0, len = spans.length, start = -1;
  for (; i < len; i++) {
    if (spans[i].className === 'Hebrew') 
    { (function(n) { spans[i].addEventListener("click", function() { wordSelect(this, n); }, false); })(wordList.length);
      wordList.push(wordObject(spans[i]));  // Sets the class for parsed entries.
                                            //TODO Find better way to skip parsed words.  Scroll to selected word.
      if (start < 0 && spans[i].className === 'Hebrew') { start = wordList.length - 1; }
    }
  }
  if (start > -1) { wordSelect(wordList[start].getNode(), start); }
};
//===========================================================================================================================
// Interface elements.
//===========================================================================================================================
var morphKeyup = function(event) {              // Keyup handler for the morphology input box.
  var enter = enterKey(event);
  if (enter) { applyClick(); return false; }
  morphChange();
  return true;
};

var nextWord = function() {                     // Advances to the next word.
  var index = parseInt(currentWord.getIndex());
  if (index < wordList.length) { index++; wordSelect(wordList[index].getNode(), index); }
};
var previousWord = function() {                 // Moves back to the previous word.
  var index = parseInt(currentWord.getIndex());
  if (index > 0) { index--; wordSelect(wordList[index].getNode(), index); }
};
var applyClick = function() {                   // Click handler for the apply button.
  var morph = elements.morph.value;
  if (morph) {
    var index = parseInt(currentWord.getIndex());
    wordList[index].setParsing(morph);
    saveChanges(wordList[index].getNode().id + ' ' + morph);
    nextWord();
  }
};
//===========================================================================================================================
// Navigation elements.
//===========================================================================================================================
var setChapters = function() {        // Sets the chapter options.
  var i = 1, num = parseInt(books[elements.book.value]);
  clearNodes(elements.chapter);
  for (; i <= num; i++) { elements.chapter.options[elements.chapter.options.length] = new Option(i); }
  elements.chapter[initialChapter].selected = "selected";
  initialChapter = 0;
  elements.chapter.focus();
};
var getChapter = function(top) {        // Processes an Ajax request for the new section.
  top = top ? top : 0;
  //TODO Check for saving changes.
  var ajax = new Ajax();
  var book = elements.book.value;
  var chapter = elements.chapter.options[elements.chapter.selectedIndex].text;
  var ref = book + "." + chapter;
  ajax.setUrl('index.php?ref=' + encodeURIComponent(ref));
  var responseFunction = function(request) {
    var response = request.responseText;
    elements.text.innerHTML = response;
    processWords();
    elements.text.scrollTop = top;
  };
  ajax.setResponseFunction(responseFunction);
  ajax.getResponse();
  return false;
};
var chapterKeyup = function(event) {        // Keyup handler for the chapter select.
  var enter = enterKey(event);
  if (enter) { getChapter(); return false; }
  return true;
};

var saveChanges = function(data) {                  // Saves the changes.
  alert("saving changes");
  var postData = 'data=' + data;
  var ajax = new Ajax();
  ajax.setUrl('index.php');
  var responseFunction = function(request) {
    var response = request.responseText;
    if (!response) { alert("The last parsing was not saved properly."); }
    
  };
  ajax.setResponseFunction(responseFunction);
  ajax.setPostData(encodeURI(postData));
  ajax.getResponse();
};

// Initialize.
var initialChapter = elements.chapter.value - 1;
elements.foreWord.onclick = nextWord;
elements.backWord.onclick = previousWord;
elements.apply.onclick = applyClick;
elements.morph.onkeyup = morphKeyup;
document.getElementById('heb').onclick = lang.hebClick;
document.getElementById('arc').onclick = lang.arcClick;
elements.book.onchange      = setChapters;
elements.chapter.onchange   = getChapter;
elements.chapter.onkeyup    = chapterKeyup;
document.getElementById('select').onclick = getChapter;
setChapters();
})();
})();
