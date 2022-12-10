let prefixDict = {
  'O*EUD': 'id',
  'A': 'a',
  'PHA*PB': 'man',
  'A*D': 'ad',
  'A*L': 'al',
  'A*PBT': 'ant',
  'KWR*EU': 'i',
  'ARB': 'arb',
  'EUT': 'it',
  'A*RT': 'art',
  'A*UT': 'aut',
  'AO*': 'o',
  'PWAO*E': 'be',
  'PW*EU': 'bi',
  'PWAOEU': 'bi',
  'PWAO*EU': 'by',
  'KOE': 'co',
  'KO*E': 'co-',
  'KO*PB': 'con',
  'TRA': 'tra',
  'TKAO*E': 'de',
  'TKEUS': 'dis',
  'TK*EUS': 'dys',
  'AO*E': 'e',
  '*EL': 'el',
  '*EPL': 'em',
  '*EPB': 'en',
  '*EPBT': 'enter',
  'EP': 'ep',
  '*EBG': 'eq',
  '*ER': 'er',
  '*ES': 'es',
  '*EFPL': 'ex',
  'SKWRAOE': 'ge',
  'H*EUP': 'hyp',
  'HAO*EUP': 'hyp',
  '*EUG': 'ig',
  '*EUL': 'il',
  '*EUPL': 'im',
  '*EUPB': 'in',
  '*EUPBT': 'inter',
  '*EUR': 'ir',
  'PHAL': 'mal',
  'PHAOEUBG': 'mic',
  'ROE': 'ro',
  'PHAOEUBG': 'mil',
  'KWR*EU': 'li',
  'PH*EUS': 'mis',
  'O*E': 'o',
  'OB': 'ob',
  'O*BGT': 'oct',
  'O*PB': 'on',
  'O*RG': 'org',
  'O*RPB': 'orn',
  'PAEUR': 'par',
  'A*U': 'a',
  'P*ER': 'per',
  'PRAO*E': 'pre',
  'PREPBLG': 'prej',
  'PRO*E': 'pro',
  'RAO*E': 're',
  'S*UB': 'sub',
  'SAO*UP': 'super',
  'S*EUPL': 'sym',
  'S*EUPB': 'syn',
  'T*EL': 'tele',
  'TRAPBZ': 'trans',
  'TR*EU': 'tri',
  '*UPB': 'un',
  'AOUPB': 'un',
  'KWR*EU': 'i',
  'PUB': 'pub',
  'PUPB': 'pun',
  '*EFR': 'every',
  'SEF': 'sev',
  'TPOER': 'fore',
  'SKAPL': 'exam',
  'SKEPB': 'exten',
  'AOU': 'ua',
  'KREUPL': 'crim',
  'PAR': 'par',
  'KO*RT': 'court',
  'WEUT': 'wit',
};

let suffixDict = {
  'OUT': 'out',
  'WAOEUZ': 'wise',
  'SAOEUD': 'cide',
  'AOER': 'ere',
  'EPBT': 'ent',
  'UPBT': 'unt',
  'AEZ': "'s",
  'APBT': 'ant',
  'PWAOBG': 'book',
  'EUG': 'ig',
  'EPB': 'en',
  'EUPB': 'in',
  'TKAEU': 'day',
  'EUBGT': 'ict',
  'TKOT': '.',
  'KOPL': 'com',
  '-BLT': 'ability',
  '-BL': 'able',
  'KWRAED': 'ade',
  'APBLG': 'age',
  'AL': 'al',
  'ALT': 'ality',
  'KWRAER': 'ary',
  'KWRAET': 'ate',
  'AEUGS': 'ation',
  'AU': 'a',
  'TAOR': 'tory',
  '-D': 'ed',
  'EL': 'el',
  'EPL': 'em',
  'EPBD': 'end',
  'ER': 'er',
  'ERT': 'erity',
  'ERZ': 'ers',
  'EFT': 'est',
  '-FL': 'ful',
  'TPHREU': 'fully',
  'TPAOEU': 'fy',
  'TKPWR-PL': 'gram',
  'TKPWR-F': 'graph',
  'TKPWR-FR': 'grapher',
  'EUBG': 'ic',
  'TKPWRAEF': 'graphy',
  'KWRAEUD': 'iade',
  'KWRAL': 'ial',
  'KWRAPB': 'ian',
  'KWRAR': 'iar',
  'KWRAEUR': 'iary',
  'KWRAEUT': 'iate',
  'EUBLT': 'ibility',
  'EUBL': 'ible',
  'KWRAOEUD': 'ide',
  'KWRAOE': 'ie',
  'KWRER': 'ier',
  'KWREUZ': 'ies',
  'KWREFT': 'iest',
  'EULT': 'ility',
  '-G': 'ing',
  '-GZ': 'ings',
  'KWROR': 'ior',
  'EUFPL': 'ism',
  'EUFT': 'ist',
  'EUGS': 'ition',
  'AOEUTS': 'itis',
  'EUT': 'ity',
  'KWRUPL': 'ium',
  'EUF': 'ive',
  'EUZ': 'ize',
  'HRAET': 'late',
  '-L': 'le',
  '-LD': 'led',
  '-LS': 'less',
  '-LT': 'let',
  'HREU': 'ly',
  '-PLT': 'ment',
  '-PBS': 'ness',
  '-PBT': "n't",
  'OLGS': 'ologist',
  'OLG': 'ology',
  'KWRAOPB': 'on',
  'KWRAOR': 'or',
  'ORT': 'ority',
  'OUS': 'ous',
  'PAEPBLG': 'pathy',
  'RAET': 'rate',
  'RAEUGS': 'ration',
  'REU': 'ry',
  '-Z': 's',
  'S-FL': 'self',
  'SH-P': 'ship',
  'S-PL': 'some',
  '-PBLG': 'th',
  'T-PB': 'ton',
  'TAOR': 'tory',
  'TEU': 'ty',
  'KWRAOUD': 'ude',
  'AOU': 'uo',
  'OUS': 'us',
  'KWRAOURL': 'ural',
  'KWRAOUR': 'ure',
  'W-FP': 'wich',
  'KWREU': 'y',
  'AS': 'as',
  'EUS': 'ice',
  'AE': "'",
};

let suffixDict2 = {
  'EUF': 'if',
  'SAOEUD': 'side',
};

let innfixDict = {
  'A*U': 'a',
  'AO*': 'o',
};

function deconstructWord(word, strokes) {
  if(strokes.length < 2) return word;

  let lastStroke = strokes[strokes.length - 1];

  // capture ed ending like "liked" where only 'd' shouldn't be captured
  if(lastStroke === '-D' && /[aeiou][a-z]ed$/i.test(word)) {
    let start = deconstructWord(
      word.slice(0, word.length - 1),
      strokes.slice(0, strokes.length - 1)
    );
    if(!start) return false;
    let end = word.slice(word.length - 1);
    return `${start}\x00${end}`;
  }

  // capture ed ending like "sipped" where 'ped' should be captured
  if(lastStroke === '-D' && /([a-km-z])\1ed$/i.test(word)) {
    let start = deconstructWord(
      word.slice(0, word.length - 3),
      strokes.slice(0, strokes.length - 3)
    );
    if(!start) return false;
    let end = word.slice(word.length - 3);
    return `${start}\x00${end}`;
  }

  // capture ing ending like "sipping" where 'ping' should be captured
  if(lastStroke === '-G' && /([a-km-z])\1[aeiou]ng$/i.test(word)) {
    let start = deconstructWord(
      word.slice(0, word.length - 4),
      strokes.slice(0, strokes.length - 4)
    );
    if(!start) return false;
    let end = word.slice(word.length - 4);
    return `${start}\x00${end}`;
  }

  // capture ing ending like "sippings" where 'pings' should be captured
  if(lastStroke === '-GZ' && /([a-km-z])\1[aeiou]ngs$/i.test(word)) {
    let start = deconstructWord(
      word.slice(0, word.length - 5),
      strokes.slice(0, strokes.length - 5)
    );
    if(!start) return false;
    let end = word.slice(word.length - 5);
    return `${start}\x00${end}`;
  }

  if(suffixDict.hasOwnProperty(lastStroke)) {
    let match = word.match(RegExp(suffixDict[lastStroke]+'$', 'i'));
    if(match && match.index === word.length - suffixDict[lastStroke].length) {
      let start = deconstructWord(
        word.slice(0, match.index),
        strokes.slice(0, strokes.length - 1)
      );
      if(!start) return false;
      let end = word.slice(match.index);
      return `${start}\x00${end}`;
    }
  }

  if(suffixDict2.hasOwnProperty(lastStroke)) {
    let match = word.match(RegExp(suffixDict2[lastStroke]+'$', 'i'));
    if(match && match.index === word.length - suffixDict2[lastStroke].length) {
      let start = deconstructWord(
        word.slice(0, match.index),
        strokes.slice(0, strokes.length - 1)
      );
      if(!start) return false;
      let end = word.slice(match.index);
      return `${start}\x00${end}`;
    }
  }

  if(prefixDict.hasOwnProperty(strokes[0])) {
    let match = word.match(RegExp('^'+prefixDict[strokes[0]], 'i'));
    if(match) {
      let end = deconstructWord(
        word.slice(match.index + prefixDict[strokes[0]].length),
        strokes.slice(1)
      );
      if(!end) return false;
      let start = word.slice(0, match.index + prefixDict[strokes[0]].length);
      return `${start}\x00${end}`;
    }
  }

  console.error(`failed:\n${word}\n${strokes.join('/')}`);
  return false;
}

function loadLessonText(txt) {
  file = txt;
  lessonText = [];
  lessonStrokes = [];
  let lines = txt.split('\n');
  for(let i = 0; i < lines.length - 1; i += 2) {
    let regex = new RegExp('_.+?_','g');
    let line = lines[i].replace(/\r/g, '');
    line = line.replace(/([^\/])\//g, '$1\x00');
    line = line.replace(/\/\//g, '/');

    // underline
    let matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('_','<u>').replace('_','</u>'));
    }
    // bold
    regex = new RegExp('\\*\\*.+?\\*\\*','g');
    matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('**','<b>').replace('**','</b>'));
    }
    // italic
    regex = new RegExp('\\*.+?\\*','g');
    matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('*','<i>').replace('*','</i>'));
    }

    let steno = lines[i + 1].replace(/\r/g, '').split(' ');

    while(steno.length > 0 && steno[0].length === 0) {
      steno.shift();
    }

    let strokes = lines[i + 1].replace(/[\r\/]/g, '').replace(/^\s+/, '');

    let hadStart = false;
    let startStrokes = ['OEUS', 'OEU', 'AE'];

    let done = false;
    while(!done) {
      done = true;
      for(let stroke of startStrokes) {
        let index = strokes.indexOf(stroke + ' ');
        if(index === 0) {
            lessonText.push((hadStart ? '/' : ' ') + line[0]);
            lessonStrokes.push(strokes.slice(0, index + stroke.length).split(' '));
            line = line.slice(1);
            strokes = strokes.slice(stroke.length + 1);
            done = false;
            hadStart = true;
            break;
        }
      }
    }

    let stopStrokes = ['OEUS OEUS', 'OEU OEU', '-FPLT -FPLT', '-FPLT -RBGS', '-FPLT', 'STPH', '-RBGS'];

    let pushAfter = [];

    done = false;
    while(!done) {
      done = true;
      for(let stroke of stopStrokes) {
        let index = strokes.indexOf(' ' + stroke);
        if(index > 0 && index + stroke.length + 1 === strokes.length) {
          pushAfter.unshift([line[line.length - 1], strokes.slice(index + 1)]);
          line = line.slice(0, line.length - 1);
          strokes = strokes.slice(0, index);
          done = false;
          break;
        }
      }
    }

    if(steno[0][0] === '/') {
      hadStart = true;
    }

    if(/\w'\w/.test(line) && strokes.split(' ').length === 2) {
      line = line.replace(/(\w)'(\w)/, "$1\x00'$2");
    }

    line = deconstructWord(line, strokes.split(' ')) || line;

    lessonText.push((hadStart ? '/' : ' ') + line);
    lessonStrokes.push(strokes.split(' '));

    for(let i = 0; i < pushAfter.length; i++) {
      lessonText.push('/' + pushAfter[i][0]);
      lessonStrokes.push(pushAfter[i][1].split(' '));
    }
  }

  sceneDivs['lessonSelect'].style.display = 'none';
  sceneDivs['lesson'].style.display = 'block';
  lessonPhrase = 0;
  lessonStroke = 0;
  mistakes = 0;
  recentMistake = false;
  updateProgressText();
  drawtoLessonText();
}

function gotFile(txt) {
  if(txt.indexOf('\x00') > 0) {
    readSMFile(txt, false);
  }
  else {
    readEFHFile(txt, false);
  }
}

function loadLesson(id) {
  if(file) {
    loadLessonText(file);
    return;
  }
  onLesson = id % lessons.length;
  getFile(lessons[onLesson].url, gotFile);
}
