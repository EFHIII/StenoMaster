let prefixDict = {
  'TEUBG': 'tiq',
  'TKR': 'dr. ',
  'O*EUD': 'id',
  'AO*': 'o',
  'KO*E': 'co-',
  '*EPBT': 'enter',
  '*EBG': 'eq',
  '*EFPL': 'ex',
  'SKWRAOE': 'ge',
  '*EUPBT': 'inter',
  'PHAOEUBG': 'mil',
  'A*U': 'a',
  'SAO*UP': 'super',
  'T*EL': 'tele',
  '*EFR': 'every',
  'SKAPL': 'exam',
  'SKEPB': 'exten',
  'AOU': 'ua',
  'KREUPL': 'crim',
  'KO*RT': 'court',
  'ABG': 'ack',
  '1E': '11 ',
  '2E': '22 ',
  '3E': '33 ',
  '4E': '44 ',
  '5E': '55 ',
  '6E': '66 ',
  '7E': '77 ',
  '8E': '88 ',
  '9E': '99 ',
  'HREFPB': '11 ',
  'TWEFL': '12 ',
  'TWEPBT': 'twent',
  'THEURT': 'thirt',
  'TPEUFT': 'fift',
  'SEUFPLT': 'sixt',
  'WUPB': 'one',
  'TWO': 'two',
  'THRAOE': 'three',
  'TPOUR': 'four',
  'SEUFPL': 'five',
  'SEUFPL': 'six',
  'SEFPB': 'seven',
  'AET': 'eight',
  'TPHAOEUPB': 'nine',
  'TPHO': 'no ',
  'AUL': 'all ',
  'KWRUR': 'your',
};

let suffixDict = {
  'SES': 'cess',
  'SHAL': 'tial',
  'EURB': 'ish',
  'KWRA': 'ea',
  'AEZ': "'s",
  'TKOT': '.',
  '-BLT': 'ability',
  '-BL': 'able',
  'APBLG': 'age',
  'ALT': 'ality',
  'KWRAER': 'ary',
  'AEUGS': 'ation',
  'AU': 'a',
  'TAOR': 'tory',
  'ERT': 'erity',
  '-FL': 'ful',
  'TPHREU': 'fully',
  'TKPWR-PL': 'gram',
  'TKPWR-F': 'graph',
  'TKPWR-FR': 'grapher',
  'TKPWRAEF': 'graphy',
  'KWRAEUR': 'iary',
  'EUBLT': 'ibility',
  'EUBL': 'ible',
  'KWREUZ': 'ies',
  'EULT': 'ility',
  'EUGS': 'ition',
  'AOEUTS': 'itis',
  'EUT': 'ity',
  '-L': 'le',
  '-LS': 'less',
  '-LT': 'let',
  '-PLT': 'ment',
  '-PBS': 'ness',
  '-PBT': "n't",
  'OLGS': 'ologist',
  'OLG': 'ology',
  'KWRAOPB': 'on',
  'KWRAOR': 'or',
  'ORT': 'ority',
  'OUS': 'us',
  'PAEPBLG': 'pathy',
  'RAEUGS': 'ration',
  'S-FL': 'self',
  'SH-P': 'ship',
  'S-PL': 'some',
  '-PBLG': 'th',
  'T-PB': 'ton',
  'KWRAOURL': 'ural',
  'W-FP': 'wich',
  'AE': "'",
  'OE': 'ow',
  'SEUFPLT': '6',
  'SEFT': '7',
  'WUPB': '1',
  'TWO': '2',
  'THRAOE': '3',
  'TPOUR': '4',
  'TPAOEUF': '5',
  'SEUFPL': '6',
  'SEFPB': '7',
  'AET': '8',
  'TPHAOEUPB': '9',
  'PWE': ' be',
  'P-PL': ' p.m.',
  'AEPL': ' a.m.',
  'TAEPB': 'teen',
  'REURBS': 'ricious',
  'EURBS': 'ious',
  'AEURBS': 'acious',
  'SHUS': 'tious'
};

let suffixDict2 = {
  'SHUS': 'xious',
  'REURBS': 'ritious',
  'KWREU': '',
  'P-PL': ' p.m',
  'AEPL': ' a.m',
  'AOU': 'ue',
  'TAEPB': '',
  'WUPB': '10',
  'TWO': '20',
  'THRAOE': '30',
  'TPOUR': '40',
  'TPAOEUF': '50',
  'SEUFPL': '60',
  'SEFPB': '70',
  'AET': '80',
  'TPHAOEUPBT': '90',
  'TWEPBT': '20',
  'THEURT': '30',
  'TPOURT': '40',
  'TPEUFT': '50',
  'EUT': 'ety',
  '-GS': 'ion',
  'ET': 'ete',
  'APBS': 'ance',
  'P-T': '.'
};

let infixDict = {
  'A*U': 'a',
  'AO*': 'o',
  'TAEPB': ' ',
  'STKAOER': ':',
};

let literalVariants = [
  [/^Y/, ''],
  [/^Y/, 'I'],
  [/^YI/, 'Y'],
  [/S/, 'C'],
  [/G/, 'ING'],
  [/K/, 'C'],
  [/F/, 'V'],
  [/F/, 'VE'],
  [/F/, 'S'],
  [/HR/, 'L'],
  [/IE/, 'I'],
  [/IE/, 'IGH'],
  [/IE/, 'Y'],
  [/AE/, 'A'],
  [/AE/, 'AY'],
  [/EE/, 'E'],
  [/OE/, 'O'],
  [/UE/, 'U'],
  [/UE/, 'EW'],
  [/UE/, 'UO'],
  [/AU/, 'AW'],
  [/OU/, 'OW'],
  [/I/, 'Y'],
  [/D/, 'ED'],
  [/(A|E|I|I|O|U)E(\w)/, '$1$2E'],
  [/Y(\w)/, 'Y$1E'],
  [/Z$/, 'S'],
  [/Z$/, 'SE'],
  [/Z$/, 'ZE'],
];

function toLiteral(steno) {
  let ans = steno
  .replace('STKPW','Z')
  .replace('TKPW','G')
  .replace('SKWR','J')
  .replace('PBLG','J')
  .replace('BGS','X')
  .replace('TPH','N')
  .replace('KWR','Y')
  .replace('PW','B')
  .replace('TK','D')
  .replace('TP','F')
  .replace('BG','K')
  .replace('PH','M')
  .replace('PL','M')
  .replace('PB','N')
  .replace('SR','V')
  .replace('KP','X')
  .replace('KR','C')
  .replace('KW','Q')
  .replace('QE','QUE')
  .replace(/[^\w]/g,'')
  .replace('EU','I')
  .replace('AOI','IE')
  .replace('AI','AE')
  .replace('AOE','EE')
  .replace('AOU','UE')
  .replace('AO','OO');
  return ans;
}

function getLiteralVariants(steno) {
  let variants = [];
  let literal = toLiteral(steno);
  let workableVariants = literalVariants.filter(a => a[0].test(literal));

  for(let i = 0; i < 1 << workableVariants.length; i++) {
    let ans = literal;
    for(let j = 0; j < workableVariants.length; j ++) {
      if(i & 1 << j) {
        ans = ans.replace(...workableVariants[j]);
      }
    }
    if(variants.indexOf(ans) < 0) {
      variants.push(ans);
    }
  }
  return variants.sort((a,b) => b.length - a.length);
}

function deconstructWord(word, withStrokes) {
  if(withStrokes.length < 2) return word;

  let strokes = withStrokes.map(s => {
    return s.replace(/\^/g,'S');
  });

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

  // remove style stuff
  {
    let match = word.match(RegExp('^<\\w>', 'i'));
    if(match) {
      let end = deconstructWord(
        word.slice(match.index + 3),
        strokes
      );
      if(!end) return false;
      let start = word.slice(0, match.index + 3);
      return `${start}${end.replace(/\x00/g, `\x00${start}`)}`;
    }

    match = word.match(RegExp('</\\w>$', 'i'));
    if(match) {
      let start = deconstructWord(
        word.slice(0, match.index),
        strokes
      );
      if(!start) return false;
      let end = word.slice(match.index);
      return `${start.replace(/\x00/g,`${end}\x00`)}${end}`;
    }
  }

  if(suffixDict.hasOwnProperty(lastStroke)) {
    let match = word.match(RegExp(suffixDict[lastStroke] + '$', 'i'));
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

  if(prefixDict.hasOwnProperty(strokes[0])) {
    let match = word.match(RegExp('^' + prefixDict[strokes[0]], 'i'));
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

  if(suffixDict2.hasOwnProperty(lastStroke)) {
    let match = word.match(RegExp(suffixDict2[lastStroke] + '$', 'i'));
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

  if(/^[0-9]+$/.test(withStrokes[0])) {
    let match = word.match(RegExp(' *' + withStrokes[0]+' *', 'i'));
    if(match) {
      let end = deconstructWord(
        word.slice(match.index + match[0].length),
        strokes.slice(1)
      );
      if(!end) return false;
      let start = word.slice(0, match.index + match[0].length);
      return `${start}\x00${end}`;
    }
  }

  for(let i = 1; i < strokes.length - 1; i++) {
    if(infixDict.hasOwnProperty(strokes[i])) {
      let match = word.match(RegExp(infixDict[strokes[i]], 'i'));
      if(match && match.index > 0 && match.index < word.length - infixDict[strokes[i]].length) {
        let end = deconstructWord(
          word.slice(match.index + infixDict[strokes[i]].length),
          strokes.slice(i + 1)
        );
        if(!end) return false;
        let start = deconstructWord(
          word.slice(0, match.index),
          strokes.slice(0, i)
        );
        if(!start) return false;
        let middle = word.slice(match.index, match.index + infixDict[strokes[i]].length);
        return `${start}\x00${middle}\x00${end}`;
      }
    }

    for(let literal of getLiteralVariants(strokes[i])) {
      let match = word.match(RegExp(literal, 'i'));
      if(match && match.index > 0 && match.index < word.length - literal.length) {
        let end = deconstructWord(
          word.slice(match.index + literal.length),
          strokes.slice(i + 1)
        );
        if(!end) return false;
        let start = deconstructWord(
          word.slice(0, match.index),
          strokes.slice(0, i)
        );
        if(!start) return false;
        let middle = word.slice(match.index, match.index + literal.length);
        return `${start}\x00${middle}\x00${end}`;
      }
    }
  }

  // literal translations
  for(let literal of getLiteralVariants(strokes[0])) {
    let match = word.match(RegExp('^'+literal, 'i'));
    if(match) {
      let end = deconstructWord(
        word.slice(match.index + literal.length),
        strokes.slice(1)
      );
      if(!end) return false;
      return `${match[0]}\x00${end}`;
    }
  }

  for(let literal of getLiteralVariants(strokes[strokes.length - 1])) {
    match = word.match(RegExp(literal+'$', 'i'));
    if(match) {
      let start = deconstructWord(
        word.slice(0, match.index),
        strokes.slice(0, strokes.length - 1)
      );
      if(!start) return false;
      return `${start}\x00${match[0]}`;
    }
  }

  if(strokes.length === word.split('-').length) {
    return word.replace(/-/g, '\x00-');
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
    let regex = new RegExp('_.+?_', 'g');
    let line = lines[i].replace(/\r/g, '');
    line = line.replace(/([^\/])\//g, '$1\x00');
    line = line.replace(/\/\//g, '/');

    // underline
    let matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('_', '<u>').replace('_', '</u>'));
    }
    // bold
    regex = new RegExp('\\*\\*.+?\\*\\*', 'g');
    matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('**', '<b>').replace('**', '</b>'));
    }
    // italic
    regex = new RegExp('\\*.+?\\*', 'g');
    matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('*', '<i>').replace('*', '</i>'));
    }

    let steno = lines[i + 1].replace(/\r/g, '').split(' ');

    while(steno.length > 0 && steno[0].length === 0) {
      steno.shift();
    }

    if(steno.length === 0) continue;

    let strokes = lines[i + 1].replace(/[\r\/]/g, '').replace(/^\s+/, '');

    let hadStart = false;
    let startStrokes = ['OEUS', 'OEU', 'AE'];

    let done = false;
    while(!done) {
      done = true;
      for(let stroke of startStrokes) {
        let index = strokes.indexOf(stroke + ' ');
        if(index === 0) {
          lessonText.push((hadStart ? '/' : ' ') + line.replace(/^((?:<\w>)*)(.).+?((?:<\/\w>)*)$/,'$1$2$3').replace(/<\/?u>/g,''));
          lessonStrokes.push(strokes.slice(0, index + stroke.length).split(' '));
          line = line.replace(/^((?:<\w>)*).(.+?)((?:<\/\w>)*)$/,'$1$2$3');
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
          pushAfter.unshift([line.replace(/^((?:<\w>)*).+?(.)((?:<\/\w>)*)$/,'$1$2$3').replace(/<\/?u>/g,''), strokes.slice(index+1)]);
          line = line.replace(/^((?:<\w>)*)(.+?).((?:<\/\w>)*)$/,'$1$2$3');
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
  } else {
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
