/* TODO:
filter problem words by
outline search / word search
toggle problem words for pyramid drill
*/

let version = 0.5;
let lessons = [];
let lessonProgress = {};
let makeSaves = true;

let storageName = 'EFHIII_SM';

let autoAdvance = true;
let onLesson = -1;
let scene = 'lessonSelect';

let repetitions = 10;
let accuracyTarget = 96;
let atAccuracy = 1;

let lessonText = [];
let lessonStrokes = [];
let lessonPhrase = 0;
let lessonStroke = 0;
let mistakes = 0;
let problemWords = {};

let t = Date.now();

let txt = '';
let willDraw = false;

let startingTime = 0;
let progressStatus = [0, 0];
let recentMistake = false;

let file;

const isSteno = /^(#?[S1]?[T2]?K?[P3]?W?[H4]?R?[A5]?[O0]?[\*\-]?E?U?[F6]?R?[P7]?B?[L8]?G?[T9]?S?D?Z?\/)*(#?[S1]?[T2]?K?[P3]?W?[H4]?R?[A5]?[O0]?[\*\-]?E?U?[F6]?R?[P7]?B?[L8]?G?[T9]?S?D?Z?)$/;
const StenoKeys = '#STKPWHRAO*EUFRPBLGTSDZ';
const StenoNumberKeys = '#12K3W4R50*EU6R7B8G9SDZ';

let text = document.getElementById('text');
let keyboard = document.getElementById('keyboard');
let accuracyDiv = document.getElementById('accuracy');
let wpmDiv = document.getElementById('wpm');
let progressDiv = document.getElementById('progress');
let lessonList = document.getElementById('lessonList');
let stenoTape = document.getElementById('stenoTape');
let stenoLastStroke = document.getElementById('stenoLastStroke');

let sceneDivs = {
  lesson: document.getElementById('lesson'),
  pyramid: document.getElementById('lesson'),
  lessonSelect: document.getElementById('lessonSelect'),
  problems: document.getElementById('problems'),
};

let pyramidWords;
let pyramidWordsDone;

function getFile(file, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("text/plain");

  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == XMLHttpRequest.DONE) {
      if(xmlhttp.status == 200) {
        callback(xmlhttp.responseText);
      } else if(xmlhttp.status == 400) {
        console.error('There was an error 400');
      } else {
        console.error(`error ${xmlhttp.status} was returned`);
      }
    }
  };

  xmlhttp.open("GET", file, true);
  xmlhttp.send();
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/&lt;u&gt;/g, "<u>")
    .replace(/&lt;\/u&gt;/g, "</u>")
    .replace(/&lt;i&gt;/g, "<i>")
    .replace(/&lt;\/i&gt;/g, "</i>")
    .replace(/&lt;b&gt;/g, "<b>")
    .replace(/&lt;\/b&gt;/g, "</b>")
    .replace(/ /g, "&nbsp;")
    .replace(/&lt;r&gt;/g, "<span class='phrase'>\u202e")
    .replace(/&lt;\/r&gt;/g, "\u202c</span>")
    .replace(/\\n/g, "<span style='color:grey'>&crarr;</span></span><br><span class='phrase'>");
}
