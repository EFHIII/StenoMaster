// TODO: attachStartFixed e.g. https
// TODO: auto-suffix (ing, s, es, ed)

// #STKPWHRAO*EUFRPBLGTSDZ
function stenoTapeToSteno(steno) {
  let ans = '';
  for(let stroke of steno) {
    if(stroke.length < 23) {
      stroke = ' ' + stroke;
    }
    if(stroke[0] === '#') {
      stroke = ' ' +
      (stroke[1] === ' ' ? ' ' : '1') +
      (stroke[2] === ' ' ? ' ' : '2') + stroke[3] +
      (stroke[4] === ' ' ? ' ' : '3') + stroke[5] +
      (stroke[6] === ' ' ? ' ' : '4') + stroke[7] +
      (stroke[8] === ' ' ? ' ' : '5') +
      (stroke[9] === ' ' ? ' ' : '0') + stroke.slice(10, 13) +
      (stroke[13] === ' ' ? ' ' : '6') + stroke[14] +
      (stroke[15] === ' ' ? ' ' : '7') + stroke[16] +
      (stroke[17] === ' ' ? ' ' : '8') + stroke[18] +
      (stroke[19] === ' ' ? ' ' : '9') + stroke.slice(20);
    }

    ans += stroke.slice(0, 13).replace(/ /g,'');
    if(stroke.slice(13).replace(/ /g, '').length === 0) {
      ans += ' ';
      continue;
    }
    if(stroke.slice(8, 13).replace(/ /g,'').length === 0) {
      ans += '-';
    }
    ans += stroke.slice(13).replace(/ /g,'') + ' ';
  }
  return ans.slice(0, -1);
}

function stenoToStenoTape(steno) {
  let ans = [];
  let strokes = steno.replace(/\//g,' ').split(' ');
  for(let stroke of strokes) {
    let str = stroke.slice();

    const numberTranslation = {
      '0': 'O',
      '1': 'S',
      '2': 'T',
      '3': 'P',
      '4': 'H',
      '5': 'A',
      '6': '-F',
      '7': '-P',
      '8': '-L',
      '9': '-T',
    };

    for(let number in numberTranslation) {
      if(str.indexOf(number) >= 0) {
        if(str[0] !== '#') {
          str = '#' + str;
        }
        str = str.replace(number, numberTranslation[number]);
      }
    }

    let stenoOrder = '#STKPWHRAO*EUFRPBLGTSDZ';

    for(let i = 0; i < stenoOrder.length; i++) {
      if(i > 10) {
        if(str[i] === '-') {
          str = str.substring(0, i) + str.substring(i + 1);
        }
      }
      if(str[i] !== stenoOrder[i]) {
        str = str.substring(0, i) + ' ' + str.substring(i);
      }
    }

    ans.push(str);
  }
  return ans;
}

const isSteno = /^([S1]?[T2]?K?[P3]?W?[H4]?R?[A5]?[O0]?[\*\-]?E?U?[F6]?R?[P7]?B?[L8]?G?[T9]?S?D?Z?\/)*([S1]?[T2]?K?[P3]?W?[H4]?R?[A5]?[O0]?[\*\-]?E?U?[F6]?R?[P7]?B?[L8]?G?[T9]?S?D?Z?)$/;

// The parsing code here is, in effect, a JS copy of Plover's:
// https://github.com/openstenoproject/plover/blob/master/plover/formatting.py
const Case = {
  CAP_FIRST_WORD: 'cap_first_word',
  LOWER_FIRST_CHAR: 'lower_first_char',
  UPPER_FIRST_WORD: 'upper_first_word',
  LOWER: 'lower',
  UPPER: 'upper',
  TITLE: 'title',
};

const Macros = {
  '{*}': '=retrospective_toggle_asterisk',
  '{*!}': '=retrospective_delete_space',
  '{*?}': '=retrospective_insert_space',
  '{*+}': '=repeat_last_stroke',
};

function buildMetasParser(metas) {
  let matchFromLastIndex = [false];
  let regexParts = [];

  for(let meta of metas) {
    let pattern = meta[0];
    let name = meta[1];
    let param = meta[2];

    let numPrevGroups = matchFromLastIndex.length;
    let numGroups = ''.match(pattern + '|').length - 1;

    if(typeof name === 'number') {
      name += numPrevGroups;
    }
    if(typeof param === 'number') {
      param += numPrevGroups;
    }

    if(numGroups === 0) {
      numGroups = 1;
    }
    else {
      pattern = '?:' + pattern;
    }

    let groups = [];
    for(let n = 0; n < numGroups; n++) {
      groups.push(n + numPrevGroups);
    }

    matchFromLastIndex = matchFromLastIndex.concat(new Array(groups.length).fill([name, param]));

    regexParts.push('(' + pattern + ')$');
  }

  let regex = RegExp(regexParts.join('|'), 'is');

  return (meta) => {
    let m = meta.match(regex);
    if(!m) {
      let name = meta;
      for(let alias in Macros) {
        if(`{${meta}}` === alias) {
          return [Macros[alias], false];
        }
      }
      return [name, false];
    }
    let lastIndex = matchFromLastIndex.length;
    while(!m[lastIndex]) lastIndex--;
    let [metaName, metaParam] = matchFromLastIndex[lastIndex];
    if(typeof metaName === 'number') {
      metaName = m[metaName];
    }
    if(typeof metaParam === 'number') {
      metaParam = m[metaParam];
    }
    return [metaName, metaParam];
  }
}

const parseMeta = buildMetasParser([
  // Generic {:macro:cmdline} syntax
  [':([^:]+):?(.*)', 0, 1],
  // Command
  ['PLOVER:(.*)', 'command', 0],
  // Key combination
  ['#(.*)', 'key_combo', 0],
  // Punctuation
  ['([,:;])', 'comma', 0],
  ['([.!?])', 'stop' , 0],
  // Case
  ['-\\|', 'case', Case.CAP_FIRST_WORD],
  ['>', 'case', Case.LOWER_FIRST_CHAR],
  ['<', 'case', Case.UPPER_FIRST_WORD],
  ['\\*-\\|', 'retro_case', Case.CAP_FIRST_WORD],
  ['\\*>', 'retro_case', Case.LOWER_FIRST_CHAR],
  ['\\*<', 'retro_case', Case.UPPER_FIRST_WORD],
  // Explicit word end
  ['(\\$)', 'word_end', 0],
  // Conditional
  ['=(.*)', 'if_next_matches', 0],
  // Mode
  ['MODE:(.*)', 'mode', 0],
  // Currency
  ['\\*\\((.*)\\)', 'retro_currency', 0],
  // Glue
  ['&(.*)', 'glue' , 0],
  // Carry capitalization
  ['(\\^?~\\|.*\\^?)', 'carry_capitalize', 0],
  // Attach
  ['(\\^.*\\^?)', 'attach', 0],
  ['(.*\\^)', 'attach', 0],
]);

const ATOM_RE = /(?:\\\\{|\\\\}|[^{}])+|{(?:\\\\{|\\\\}|[^{}])*}/g;
const WORD_RX = /(?:\d+(?:[.,]\d+)+|[\'\w]+[-\w\']*|[^\w\s]+)\s*/g;

const defaultState = {
  spaceChar: ' ',
  case: false,
  caseMode: false,
  mode: false,
  lastStrokeWasGlue: false,
  startAttached: true,
  startCapitalized: true,
  ifNextMatches: false
};

const startingState = {
  spaceChar: ' ',
  case: Case.CAP_FIRST_WORD,
  caseMode: false,
  mode: false,
  lastStrokeWasGlue: false,
  startAttached: true,
  startCapitalized: true,
  ifNextMatches: false
};

function getMeta(atom) {
  if(atom && atom[0] === '{' && atom[atom.length - 1] === '}') {
    return atom.slice(1, atom.length - 1);
  }
  return false;
}

function atomToAction(atom) {
  let action;
  let meta = getMeta(atom);
  if(meta) {
    meta = meta.replace(/\\{/g, '{').replace(/\\}/g, '}');
    action = parseMeta(meta);
  }
  else {
    action = ['raw', atom];
  }

  return action;
}

function entryToActions(str) {
  let atoms = [];
  if(/^[0-9]*$/.test(str)) {
    atoms = [`{&${str}}`];
  }
  else if(/^[0-9\*]*$/.test(str)) {
    atoms = [`{&${str.replace('*','').split('').reverse().join('')}}`];
  }
  else {
    atoms = [...str.matchAll(ATOM_RE)].map(a => a[0]);
    atoms = atoms.filter(a => a.trim() !== '');
  }
  let actionList = [];
  for(let atom of atoms) {
    let action = atomToAction(atom);
    actionList.push(action);
  }
  return actionList;
}

function appendTextCase(txt, add, state) {
  if(add === '') {
    return txt;
  }
  let ans = txt;

  let wasState = JSON.parse(JSON.stringify(state));

  if(!state.startAttached) {
    ans += state.spaceChar;
  }

  switch(state.case) {
    case Case.CAP_FIRST_WORD:
      if(state.startCapitalized) {
        switch(state.caseMode) {
          case Case.LOWER:
            ans += add[0].toUpperCase() + add.slice(1).toLowerCase();
          break;
          case Case.UPPER:
            ans += add[0].toUpperCase() + add.slice(1).toUpperCase();
          break;
          default:
            ans += add[0].toUpperCase() + add.slice(1);
        }
        state.case = false;
      }
      else {
        switch(state.caseMode) {
          case Case.LOWER:
            ans += add.toLowerCase();
          break;
          case Case.UPPER:
            ans += add.toUpperCase();
          break;
          default:
            ans += add;
        }
      }
    break;
    case Case.LOWER_FIRST_CHAR:
      switch(state.caseMode) {
        case Case.LOWER:
          ans += add[0].toLowerCase() + add.slice(1).toLowerCase();
        break;
        case Case.UPPER:
          ans += add[0].toLowerCase() + add.slice(1).toUpperCase();
        break;
        default:
          ans += add[0].toLowerCase() + add.slice(1);
      }
      state.case = false;
    break;
    case Case.UPPER_FIRST_WORD:
      ans += add.toUpperCase();
      state.case = false;
    break;
    default:
      switch(state.caseMode) {
        case Case.LOWER:
          ans += add.toLowerCase();
        break;
        case Case.UPPER:
          ans += add.toUpperCase();
        break;
        case Case.TITLE:
        if(state.startCapitalized) {
          ans += add[0].toUpperCase() + add.slice(1);
        } else {
          ans += add;
        }
        break;
        default:
          ans += add;
      }
  }

  if(state.ifNextMatches) {
    let addedText = ans.replace(txt, '');
    if(addedText[0] === ' ') {
      addedText = addedText.slice(1);
    }
    let matches = state.ifNextMatches;
    for(let key in state) {
      state[key] = wasState[key];
    }
    state.ifNextMatches = false;

    if(RegExp('^' + matches[0]).test(addedText)) {
      ans = appendTextCase(txt, matches[1], state);
    }
    else {
      ans = appendTextCase(txt, matches[2], state);
    }
    ans = appendTextCase(ans, addedText, state);
  }

  return ans;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
// the main parser
function parseDictionaryEntry(str, oldState = defaultState) {
  let state = JSON.parse(JSON.stringify(oldState));
  let retroCase = false;
  let retroCurrency = false;
  let appendText = '';
  let newWord = !state.ifNextMatches;
  let macro = false;

  let actions = entryToActions(str);

  for(let [action, param] of actions) {
    // TODO: apply casing to phrases
    param = param ? param.replace(/ /g, state.spaceChar) : false;
    let lastWasGlue = state.lastStrokeWasGlue;
    state.lastStrokeWasGlue = false;
    let temp;
    switch(action) {
      case 'raw':
        appendText = appendTextCase(appendText, param, state);
        state.startAttached = false;
      break;
      case 'stop':
        temp = state.spaceChar;
        state.spaceChar = '';
        appendText = appendTextCase(appendText, param, state);
        state.spaceChar = temp;
        state.case = Case.CAP_FIRST_WORD;
        state.startCapitalized = true;
      break;
      case 'comma':
        temp = state.spaceChar;
        state.spaceChar = '';
        appendText = appendTextCase(appendText, param, state);
        state.spaceChar = temp;
      break;
      case 'attach':
        if(param[0] === '^' || param.indexOf('^') < 0) {
          state.startAttached = true;
        }
        if(param.replace(/\^/g).length) {
          appendText = appendTextCase(appendText, param.replace(/\^/g,''), state);
          state.startAttached = false;
        }
        if(param[param.length - 1] === '^') {
          state.startAttached = true;
        }
        if(/[\.\?\!]/.test(param.replace(/\^/g)[param.replace(/\^/g).length - 1])) {
          state.case = Case.CAP_FIRST_WORD;
          state.startCapitalized = true;
        }
      break;
      case 'glue':
        state.lastStrokeWasGlue = true;
        if(lastWasGlue) {
          state.startAttached = true;
          if(appendText === '') {
            newWord = false;
          }
        }
        appendText = appendTextCase(appendText, param, state);
        state.startAttached = false;
      break;
      case 'word_end':
        state.startAttached = false;
        if(appendText === '') {
          newWord = true;
        }
      break;
      case 'case':
        switch(param) {
          case Case.CAP_FIRST_WORD:
          case Case.LOWER_FIRST_CHAR:
          case Case.UPPER_FIRST_WORD:
            state.case = param;
          break;
          case Case.LOWER:
          case Case.UPPER:
          case Case.TITLE:
            state.caseMode = param;
          break;
          defualt:
            state.caseMode = false;
        }
      break;
      case 'retro_case':
        retroCase = param;
        if(appendText === '') {
          newWord = false;
        }
      break;
      case 'carry_capitalize':
        let caseState = [state.case, state.startCapitalized];
        let reduced = param.replace(/~\|/i,'');
        if(/\^|(:attach)/.test(reduced)) {
          let parsed = parseDictionaryEntry(`{${reduced}}`, state);
          appendText += parsed.appendText;
          state = parsed.state;
        }
        else {
          appendText = appendTextCase(appendText, reduced, state);
          state.startAttached = false;
        }

        [state.case, state.startCapitalized] = caseState;
      break;
      case 'retro_currency':
        retroCurrency = param;
        if(appendText === '') {
          newWord = false;
        }
      break;
      case 'if_next_matches':
        let params = param.replace(/\\\//g,'<TMP_ESC>').split('/').
          map(a => a.replace(/<TMP_ESC>/, '\\\/'));
        state.ifNextMatches = params;
      break;
      case '=repeat_last_stroke':
        macro = action;
      break;
      default:
        console.error(`ERROR| no action: ${action}`);
    }
  }

  return {appendText, newWord, retroCase, retroCurrency, macro, state};
}

function stenoNumber(word) {
  let ans = [];
  let at = 0;

  while(at < word.length) {
    let ascending = word.slice(at).match(/^(1|)(2|)(3|)(4|)(5|)(0|)(6|)(7|)(8|)(9|)/)[0];
    let descending = word.slice(at).match(/^(9|)(8|)(7|)(6|)(0|)(5|)(4|)(3|)(2|)(1|)/)[0];
    descending = descending.split('').reverse().join('');
    if(descending.length > ascending.length) {
      at += descending.length;
      let txt = '';
      while(/[1-4]/.test(descending)) {
        txt += descending[0];
        descending = descending.slice(1);
      }
      while(/[05]/.test(descending)) {
        txt += descending[0];
        descending = descending.slice(1);
      }
      txt += '*';
      while(/[6-9]/.test(descending)) {
        txt += descending[0];
        descending = descending.slice(1);
      }
      ans.push(txt);
    }
    else {
      at += ascending.length;
      let txt = '';
      while(/[1-4]/.test(ascending)) {
        txt += ascending[0];
        ascending = ascending.slice(1);
      }
      if(ascending === '') {
        ans.push(txt);
        continue;
      }
      if(!/[05]/.test(ascending)) {
        txt += '-';
      }
      while(/[05]/.test(ascending)) {
        txt += ascending[0];
        ascending = ascending.slice(1);
      }
      while(/[6-9]/.test(ascending)) {
        txt += ascending[0];
        ascending = ascending.slice(1);
      }
      ans.push(txt);
    }
  }

  return ans;
}

function shortestStroke(a, b) {
  return(
    (
      a[0].join(' ').split(/[ \/]/).length * 1e4 +
      a[0].join('').replace(/[ \/-]/g, '').length
    ) - (
      b[0].join(' ').split(/[ \/]/).length * 1e4 +
      b[0].join('').replace(/[ \/-]/g, '').length
    )
  );
}

class Dictionary {

  constructor(options = {dictionary: {}, maxLookAhead: 4}) {
    this.dictionary = options.dictionary;
    this.maxLookAhead = options.maxLookAhead;
    this.longestEntry = 1;
    this.reverseDictionary = {
      all: {},
      raw: {},
      rawFixed: {},
      rawCapSecond: {},
      rawLower: {},
      attachStart: {},
      attachStartLower: {},
      attachEnd: {},
      attachEndLower: {},
      attachEndFixed: {},
      attachBothEnds: {},
      attachBothEndsLower: {},
      glue: {},
      glueLower: {},
      glueStart: {},
      glueStartLower: {},
      glueFixed: {},
      conditional: {},
      currency: {},
      other: {}
    };
    for(let key in options.dictionary) {
      this.addReverseEntry(options.dictionary[key], key);
    }
    this.longDictionary = {};
  }

  addReverseEntry(text, steno) {
    this.longestEntry = Math.max(this.longestEntry, steno.split(/[ \/]/).length);
    let txt = text;
    txt = txt.replace(/^\{([\,\:\;])\} ?([^\{]+)\{(.+\^)\}$/, '{^$1 $2 $3}');
    txt = txt.replace(/^\{([\,\:\;])\} ?([^\{]+)\{([\,\:\;])\}$/, '{^$1 $2$3}');
    txt = txt.replace(/^\{([\,\:\;])\} ?([^\{]+)/g, '{^$1 $2}');
    txt = txt.replace(/([^\}])\{([\,\:\;])\}$/, '$1$2');
    txt = txt.replace(/([^\}\^])\}\{([\,\:\;])\}$/, '$1$2}');
    txt = txt.replace(/([^\}])\{([\,\:\;])\} ?([^\}])/g, '$1$2 $3');

    if(/(\w)\{([\.\!\?])\} /.test(txt)) {
      let tmp = txt.match(/(\w)\{([\.\!\?])\} /);
      txt = txt.replace(tmp[0], `${tmp[1]}${tmp[2]} `);
    }

    if(/^[^\{]+$/.test(txt) && txt.split(' ').length >= this.maxLookAhead) {
      this.longDictionary[txt] = steno;
    }

    if(this.reverseDictionary.all.hasOwnProperty(txt)) {
      let newLength = steno.replace(/-/g,'').length + steno.split(/[ \/]/).length * 100;
      let oldLength = this.reverseDictionary.all[txt].length + this.reverseDictionary.all[txt].split(/[ \/]/).length * 100;
      let shorter = newLength < oldLength;
      if(!shorter) {
        return;
      }
    }
    this.reverseDictionary.all[txt] = steno;

    if(/^[0-9]*$/.test(txt)) {
      this.reverseDictionary.glue[txt] = {steno, case: false};
      this.reverseDictionary.glueLower[txt] = {steno, case: false};
      return;
    }
    if(/^[0-9\*]*$/.test(txt)) {
      txt = txt.replace('*','').split('').reverse().join('');
      this.reverseDictionary.glue[txt] = {steno, case: false};
      this.reverseDictionary.glueLower[txt] = {steno, case: false};
      return;
    }
    let actions = entryToActions(txt);

    let setCase = false;
    let [action, param] = actions[0];
    switch(actions.map(a => a[0]).join(',')) {
      case 'raw':
        this.reverseDictionary.raw[param] = {steno, case: false};
        this.reverseDictionary.rawLower[param.toLowerCase()] = {steno, case: false};
        return;
      case 'stop':
        this.reverseDictionary.attachStart[param] = {steno, case: Case.CAP_FIRST_WORD};
        this.reverseDictionary.attachStartLower[param.toLowerCase()] = {steno, case: Case.CAP_FIRST_WORD};
        return;
      case 'comma':
        this.reverseDictionary.attachStart[param] = {steno, case: false};
        this.reverseDictionary.attachStartLower[param.toLowerCase()] = {steno, case: false};
        return;
      case 'carry_capitalize':
        param = param.replace('~|','');
        if(param.indexOf('^') < 0) {
          this.reverseDictionary.raw[param] = {steno, case: 'carry_capitalize'};
          this.reverseDictionary.rawLower[param.toLowerCase()] = {steno, case: 'carry_capitalize'};
          return;
        }
        setCase = 'carry_capitalize';
      case 'attach':
        txt = param.replace(/\^/g,'');
        if(!setCase && /[\.\?\!]/.test(txt[txt.length - 1])) {
          setCase = Case.CAP_FIRST_WORD;
        }
        if(param[0] === '^') {
          if(param[param.length - 1] === '^') {
            this.reverseDictionary.attachBothEnds[txt] = {steno, case: setCase};
            this.reverseDictionary.attachBothEndsLower[txt.toLowerCase()] = {steno, case: setCase};
          }
          else {
            this.reverseDictionary.attachStart[txt] = {steno, case: setCase};
            this.reverseDictionary.attachStartLower[txt.toLowerCase()] = {steno, case: setCase};
          }
        }
        else if(param[param.length - 1] === '^') {
          this.reverseDictionary.attachEnd[txt] = {steno, case: setCase};
          this.reverseDictionary.attachEndLower[txt.toLowerCase()] = {steno, case: setCase};
        }
        else if(param === '') {
          this.reverseDictionary.attachBothEnds[txt] = {steno, case: setCase};
          this.reverseDictionary.attachBothEndsLower[txt.toLowerCase()] = {steno, case: setCase};
        }
        else {
          this.reverseDictionary.attachStart[txt] = {steno, case: setCase};
          this.reverseDictionary.attachStartLower[txt.toLowerCase()] = {steno, case: setCase};
        }
        return;
      case 'glue':
        this.reverseDictionary.glue[param] = {steno, case: false};
        this.reverseDictionary.glueLower[param.toLowerCase()] = {steno, case: false};
        return;
      case 'if_next_matches':
        this.reverseDictionary.conditional[steno] = param.split('/');
        return;
      case 'retro_currency':
        let cIndex = param.indexOf('c');
        this.reverseDictionary.currency[steno] = [param.slice(0,cIndex), param.slice(cIndex + 1)];
        return;
      // two actions
      case 'attach,raw':
        let attachLefte = actions[0][1][0] === '^';
        let attachRighte =  actions[0][1][actions[0][1].length - 1] === '^';
        actions[0][1] = actions[0][1].replace(/\^/g, '');
        if(!attachRighte && actions[1][1][0] !== ' ') actions[0][1] += ' ';
        if(attachLefte) {
          this.reverseDictionary.attachStart[actions[0][1] + actions[1][1]] = {steno, case: false};
          this.reverseDictionary.attachStartLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: false};
        }
        else {
          this.reverseDictionary.raw[actions[0][1] + actions[1][1]] = {steno, case: false};
          this.reverseDictionary.rawLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: false};
        }
        return;
      case 'raw,attach':
        if(actions[1][1] === '^') {
          this.reverseDictionary.attachEnd[actions[0][1]] = {steno, case: false};
          this.reverseDictionary.attachEndLower[actions[0][1].toLowerCase()] = {steno, case: false};
          return;
        }
        break;
      case 'raw,case':
      case 'stop,case':
        this.reverseDictionary.raw[actions[0][1]] = {steno, case: actions[1][1]};
        this.reverseDictionary.rawLower[actions[0][1].toLowerCase()] = {steno, case: actions[1][1]};
        return;
      case 'comma,raw':
        this.reverseDictionary.attachStart[actions[0][1] + ' ' + actions[1][1]] = {steno, case: false};
        this.reverseDictionary.attachStartLower[(actions[0][1] + ' ' + actions[1][1]).toLowerCase()] = {steno, case: false};
        return;
      case 'stop,raw':
        this.reverseDictionary.attachStart[actions[0][1] + ' ' + actions[1][1][0].toUpperCase()+actions[1][1].slice(1)] = {steno, case: false};
        this.reverseDictionary.attachStartLower[(actions[0][1] + ' ' + actions[1][1]).toLowerCase()] = {steno, case: false};
        return;
      case 'attach,comma':
        this.reverseDictionary.attachStart[actions[0][1].replace(/\^/g,'') + actions[1][1]] = {steno, case: false};
        this.reverseDictionary.attachStartLower[(actions[0][1].replace(/\^/g,'') + actions[1][1]).toLowerCase()] = {steno, case: false};
        return;
      case 'attach,stop':
        this.reverseDictionary.attachStart[actions[0][1].replace(/\^/g,'') + actions[1][1]] = {steno, case: Case.CAP_FIRST_WORD};
        this.reverseDictionary.attachStartLower[(actions[0][1].replace(/\^/g,'') + actions[1][1]).toLowerCase()] = {steno, case: Case.CAP_FIRST_WORD};
        return;
      case 'raw,comma':
        this.reverseDictionary.raw[actions[0][1] + actions[1][1]] = {steno, case: false};
        this.reverseDictionary.rawLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: false};
        return;
      case 'raw,stop':
        this.reverseDictionary.raw[actions[0][1] + actions[1][1]] = {steno, case: Case.CAP_FIRST_WORD};
        this.reverseDictionary.rawLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: Case.CAP_FIRST_WORD};
        return;
      case 'attach,case':
        this.reverseDictionary.attachBothEnds[actions[0][1].replace(/\^/g,'')] = {steno, case: actions[1][1]};
        this.reverseDictionary.attachBothEndsLower[actions[0][1].replace(/\^/g,'').toLowerCase()] = {steno, case: actions[1][1]};
        return;
      case 'glue,attach':
        if(actions[1][1][0] === '^' && actions[1][1][param.length - 1] !== '^') {
          this.reverseDictionary.glueStart[actions[0][1] + actions[1][1].replace(/\^/g,'')] = {steno, case: false};
          this.reverseDictionary.glueStartLower[(actions[0][1] + actions[1][1].replace(/\^/g,'')).toLowerCase()] = {steno, case: false};
          return;
        }
        break;
      case 'carry_capitalize,raw':
        actions[0][1] = actions[0][1].replace('~|','');
        if(actions[0][1][0] !== '^' && actions[0][1][actions[0][1].length - 1] === '^') {
          if(actions[0][1].length === 2) {
            this.reverseDictionary.rawCapSecond[actions[0][1][0] + actions[1][1]] = {steno, case: false};
            return;
          }
        }
        break;
      case 'case,glue':
        this.reverseDictionary.glueFixed[actions[1][1]] = {steno, case: false};
        return;
      // three actions
      case 'attach,raw,attach':
        this.reverseDictionary.attachBothEnds[actions[1][1]] = {steno, case: false};
        this.reverseDictionary.attachBothEndsLower[actions[1][1].toLowerCase()] = {steno, case: false};
        return;
      case 'raw,attach,case':
        let attachLeftc = actions[1][1][0] === '^';
        let attachRightc =  actions[1][1][actions[1][1].length - 1] === '^';
        actions[1][1] = actions[1][1].replace(/\^/g, '');
        if(!attachLeftc) actions[0][1] += ' ';
        if(attachRightc) {
          this.reverseDictionary.attachEnd[actions[0][1] + actions[1][1]] = {steno, case: actions[2][1]};
          this.reverseDictionary.attachEndLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        }
        else {
          this.reverseDictionary.raw[actions[0][1] + actions[1][1]] = {steno, case: actions[2][1]};
          this.reverseDictionary.rawLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        }
        return;
      case 'raw,case,attach':
        let attachLeftd = actions[2][1][0] === '^';
        let attachRightd =  actions[2][1][actions[1][1].length - 1] === '^';
        actions[2][1] = actions[2][1].replace(/\^/g, '');
        if(!attachLeftd) actions[0][1] += ' ';
        if(attachRightd) {
          this.reverseDictionary.attachEnd[actions[0][1] + actions[2][1]] = {steno, case: actions[1][1]};
          this.reverseDictionary.attachEndLower[(actions[0][1] + actions[2][1]).toLowerCase()] = {steno, case: actions[1][1]};
        }
        else {
          this.reverseDictionary.raw[actions[0][1] + actions[2][1]] = {steno, case: actions[1][1]};
          this.reverseDictionary.rawLower[(actions[0][1] + actions[2][1]).toLowerCase()] = {steno, case: actions[1][1]};
        }
        return;
      case 'comma,attach,case':
        let attachLeft = actions[1][1][0] === '^';
        let attachRight =  actions[1][1][actions[1][1].length - 1] === '^';
        actions[1][1] = actions[1][1].replace(/\^/g, '');
        if(!attachLeft) actions[0][1] += ' ';
        if(attachRight) {
          this.reverseDictionary.attachBothEnds[actions[0][1] + actions[1][1]] = {steno, case: actions[2][1]};
          this.reverseDictionary.attachBothEndsLower[(actions[1][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        }
        else {
          this.reverseDictionary.attachStart[actions[0][1] + actions[1][1]] = {steno, case: actions[2][1]};
          this.reverseDictionary.attachStartLower[(actions[1][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        }
        return;
      case 'stop,attach,case':
        let attachLeftb = actions[1][1][0] === '^';
        let attachRightb =  actions[1][1][actions[1][1].length - 1] === '^';
        actions[1][1] = actions[1][1].replace(/\^/g, '');
        if(!attachLeftb) actions[0][1] += ' ';
        if(attachRightb) {
          this.reverseDictionary.attachBothEnds[actions[0][1] + actions[1][1][0].toUpperCase()+actions[1][1].slice(1)] = {steno, case: actions[2][1]};
          this.reverseDictionary.attachBothEndsLower[(actions[1][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        }
        else {
          this.reverseDictionary.attachStart[actions[0][1] + actions[1][1][0].toUpperCase()+actions[1][1].slice(1)] = {steno, case: actions[2][1]};
          this.reverseDictionary.attachStartLower[(actions[1][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        }
        return;
      case 'stop,raw,case':
        this.reverseDictionary.attachBothEnds[actions[0][1] + ' ' + actions[1][1][0].toUpperCase()+actions[1][1].slice(1)] = {steno, case: actions[2][1]};
        this.reverseDictionary.attachBothEndsLower[(actions[0][1] + actions[1][1]).toLowerCase()] = {steno, case: actions[2][1]};
        return;
      case 'case,raw':
        this.reverseDictionary.rawFixed[actions[1][1]] = {steno, case: false};
        return;
      case 'case,raw,attach':
        if(actions[2][1] === '^') {
          this.reverseDictionary.attachEndFixed[actions[1][1]] = {steno, case: false};
          return;
        }
        break;
    }

    this.reverseDictionary.other[txt] = steno;
  }

  // nextMissingEntry - input: text
  nextMissingEntry(txt) {
    let ans;
    try{
      ans = this.toSteno(txt);
    }
    catch(e) {
      if(e.indexOf('No dictionary match for "') === 5) {
        let word = e.slice(30, e.indexOf('\n') - 1);
        return {
          word,
          string: txt,
          index: txt.match(new RegExp('(^|[^\\w\\d])' + word +'($|[^\\w\\d])')).index + 1,
          missing: true,
          steno: undefined
        };
      }
      throw e;
    }
    return {
      word: undefined,
      string: txt,
      index: -1,
      missing: false,
      steno: ans
    };
  }

  // addEntry - input: text, steno or steno tape array
  addEntry(txt, steno) {
    if(Array.isArray(steno)) {
      this.dictionary[stenoTapeToSteno(steno).replace(/ /g,'/')] = txt;

      this.addReverseEntry(txt, stenoTapeToSteno(steno).replace(/ /g,'/'));
      return;
    }
    this.dictionary[steno.replace(/ /g,'/')] = txt;
    this.addReverseEntry(txt, steno.replace(/ /g,'/'));
  }

  // toTextCodeGrouped - input: steno or steno tape array
  toTextCodeGrouped(steno) {
    if(Array.isArray(steno)) {
      steno = stenoTapeToSteno(steno);
    }
    let strokes = steno.replace(/\//g, ' ').split(' ');
    let ans = [];

    nextStroke:
    for(let stroke = 0; stroke < strokes.length;) {
      if(/^[0-9]*$/.test(strokes[stroke].replace('-', ''))) {
        ans.push([strokes[stroke].replace('-', ''), strokes[stroke]]);
        stroke++;
        continue nextStroke;
      }
      if(/^[0-9\*]*$/.test(strokes[stroke])) {
        ans.push([strokes[stroke].replace('*', '').split('').reverse().join(''), strokes[stroke]]);
        stroke++;
        continue nextStroke;
      }
      for(let i = this.longestEntry; i > 0; i--) {
        if(this.dictionary.hasOwnProperty(strokes.slice(stroke, stroke + i).join('/'))) {
          ans.push([
            this.dictionary[strokes.slice(stroke, stroke + i).join('/')],
            strokes.slice(stroke, stroke + i).join('/')
          ]);
          stroke += i;
          continue nextStroke;
        }
      }
      throw `\x1b[31mNo dictionary match for stroke ${stroke}\n` +
      `${ans.map(a=>a[0]).join(' ').slice(-32)} ${strokes.slice(stroke, stroke + 6).join(' ')}\n` +
      `${''.padStart(ans.map(a=>a[0]).join(' ').slice(-32).length, ' ')} ^\x1b[0m`;
    }

    return ans;
  }

  toGrouped(textCode) {
    let ans = [];
    let state = JSON.parse(JSON.stringify(startingState));

    let txt = '';
    let strokes = [];

    for(let group of textCode) {
      let parsed = parseDictionaryEntry(group[0], state);

      if(parsed.macro) {
        switch(parsed.macro) {
          case '=repeat_last_stroke':
            parsed = parseDictionaryEntry(
              this.toTextCodeGrouped([strokes[strokes.length - 1]])[0][0],
              state);
          break;
          default:
            console.error(`ERROR| no macro: ${parsed.macro}`);
        }
      }

      if(parsed.retroCase) {
        switch(parsed.retroCase) {
          case Case.CAP_FIRST_WORD:
          case Case.TITLE:
            txt = txt.split(' ');
            txt[txt.length - 1] =
              txt[txt.length - 1][0].toUpperCase() +
              txt[txt.length - 1].slice(1);
            txt = txt.join(' ');
          break;
          case Case.LOWER_FIRST_CHAR:
            txt = txt.split(' ');
            txt[txt.length - 1] =
              txt[txt.length - 1][0].toLowerCase() +
              txt[txt.length - 1].slice(1);
            txt = txt.join(' ');
          break;
          case Case.LOWER:
            txt = txt.split(' ');
            txt[txt.length - 1] = txt[txt.length - 1].toLowerCase();
            txt = txt.join(' ');
          break;
          case Case.UPPER_FIRST_WORD:
          case Case.UPPER:
            txt = txt.split(' ');
            txt[txt.length - 1] = txt[txt.length - 1].toUpperCase();
            txt = txt.join(' ');
          break;
        }
      }

      if(parsed.retroCurrency) {
        let indexOfC = parsed.retroCurrency.indexOf('c');
        let hasPoint = txt.indexOf('.') >= 0;
        let hasSpace = txt[0] === ' ';
        if(hasSpace) txt = txt.slice(1);
        if(txt.indexOf('.') >= 0) {
          txt = txt.split('.');
          txt[txt.length - 1] = txt[txt.length - 1].padEnd(2, 0);
          txt = txt.join('.');
        }
        txt = (hasSpace ? ' ' : '') +
          parsed.retroCurrency.slice(0, indexOfC) +
          (hasPoint ? txt.split('.')[0] : txt).split('').reduceRight(
            (a,b) => b + (a && a.length % 4 === 3 ? ',': '') + a, ''
          ) + (
            hasPoint ? '.' + txt.split('.')[1] +
            parsed.retroCurrency.slice(indexOfC + 1) : ''
          );
      }

      if(txt.length > 0 && parsed.newWord && strokes.length > 0) {
        ans.push([txt, strokes.join('/')]);
        txt = '';
        strokes = [];
      }
      txt += parsed.appendText;
      state = parsed.state;
      strokes.push(group[1]);
    }

    ans.push([txt, strokes.join('/')]);

    return ans;
  }

  // toTextGrouped - input: steno or steno tape array
  toTextGrouped(steno) {
    return this.toGrouped(this.toTextCodeGrouped(steno));
  }

  // toText - input: steno or steno tape array
  toText(steno) {
    return this.toTextGrouped(steno).map(a=>a[0]).join('');
  }

  // searchPhrase - looks for plain translations
  searchPhrase(word, oldState = defaultState, options = {}) {
    let left = options.hasOwnProperty('left') ? options.left : false;
    let right = options.hasOwnProperty('right') ? options.right : false;

    let state = JSON.parse(JSON.stringify(oldState));

    // check that the case mode will produce valid output
    let outputCase = new Array(word.length).fill(0);
    switch(state.caseMode) {
      case Case.TITLE:
        for(let i = 0; i < searchCase.length - 1; i++) {
          if(searchCase[i] === ' ') {
            searchCase[i + 1] = false;
            outputCase[i + 1] = 2;
          }
        }
        break;
      case Case.LOWER:
        outputCase.fill(1);
        break;
      case Case.UPPER:
        outputCase.fill(2);
        break;
    }

    switch(state.case) {
      case Case.CAP_FIRST_WORD:
        outputCase[0] = 2;
        break;
      case Case.LOWER_FIRST_CHAR:
        outputCase[0] = 1;
        break;
      case Case.UPPER_FIRST_WORD:
        for(let i = 0; i < searchCase.length; i++) {
          if(word[i] === ' ') break;
          outputCase[i] = 2;
        }
        break;
    }

    let willOutput = '';
    let lowerWord = '';
    let upperWord = '';
    for(let i = 0; i < word.length; i++) {
      switch(outputCase[i]) {
        case 1:
          willOutput += word[i].toLowerCase();
          lowerWord += word[i].toLowerCase();
          upperWord += word[i].toUpperCase();
          break;
        case 2:
          willOutput += word[i].toUpperCase();
          lowerWord += word[i].toLowerCase();
          upperWord += word[i].toUpperCase();
          break;
        default:
          willOutput += word[i];
          lowerWord += word[i];
          upperWord += word[i];
      }
    }

    if(word !== willOutput) {
      // check static case
      if(this.reverseDictionary.glueFixed.hasOwnProperty(word)) {
        let ans = this.reverseDictionary.glueFixed[word];
        return [[ans.steno], {...state, case: false}];
      }

      // try to use case-changing strokes
      if(this.reverseDictionary.other.hasOwnProperty('{*-|}') &&
        word[0].toLowerCase() !== word[0] &&
        state.case !== Case.CAP_FIRST_WORD) {
        let rec = this.searchPhrase(word, {...state, case: Case.CAP_FIRST_WORD}, options);
        if(rec[0]) {
          return [
            [
              rec[0][0],
              this.reverseDictionary.other['{*-|}'],
              ...rec[0].slice(1)
            ],
            rec[1]
          ];
        }
      }

      else if(this.reverseDictionary.other.hasOwnProperty('{-|}') &&
        word[0].toLowerCase() !== word[0] &&
        state.case !== Case.CAP_FIRST_WORD) {
        let rec = this.searchPhrase(word, {...state, case: Case.CAP_FIRST_WORD}, options);
        if(rec[0]) {
          return [
            [
              this.reverseDictionary.other['{-|}'],
              ...rec[0]
            ],
            rec[1]
          ];
        }
      }

      if(this.reverseDictionary.other.hasOwnProperty('{*>}') &&
        word[0].toUpperCase() !== word[0] &&
        state.case !== Case.LOWER_FIRST_CHAR) {
        let rec = this.searchPhrase(word, {...state, case: Case.LOWER_FIRST_CHAR}, options);
        if(rec[0]) {
          return [
            [
              rec[0][0],
              this.reverseDictionary.other['{*>}'],
              ...rec[0].slice(1)
            ],
            rec[1]
          ];
        }
      }

      else if(this.reverseDictionary.other.hasOwnProperty('{>}') &&
        word[0].toUpperCase() !== word[0] &&
        state.case !== Case.LOWER_FIRST_CHAR) {
        let rec = this.searchPhrase(word, {...state, case: Case.LOWER_FIRST_CHAR}, options);
        if(rec[0]) {
          return [
            [
              this.reverseDictionary.other['{>}'],
              ...rec[0]
            ],
            rec[1]
          ];
        }
      }

      return [false, state];
    }

    let delayedCaseList = [lowerWord, word, upperWord];
    if(word.length > 1) {
      if(word.length > 1 && state.case === Case.CAP_FIRST_WORD || state.case === Case.LOWER_FIRST_CHAR) {
        delayedCaseList[0] = lowerWord[0] + lowerWord[1].toLowerCase() + lowerWord.slice(2);
        delayedCaseList[2] = upperWord[0] + upperWord[1].toUpperCase() + upperWord.slice(2);
      }
    }

    // look for single-entry solutions
    if(left !== '&' && right !== '&') {
      for(let i = 0; i < 3; i++) {
        let searchWord = [lowerWord, word, upperWord][i];
        if(this.reverseDictionary.raw.hasOwnProperty(searchWord)) {
          let ans = this.reverseDictionary.raw[searchWord];
          return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
        }

        if(searchWord.length > 1) {
          let delayedCase = delayedCaseList[i];

          if(this.reverseDictionary.rawCapSecond.hasOwnProperty(delayedCase)) {
            let ans = this.reverseDictionary.rawCapSecond[delayedCase];
            return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
          }
        }
      }

      if(outputCase.indexOf(0) < 0 && this.reverseDictionary.rawLower.hasOwnProperty(lowerWord)) {
        let ans = this.reverseDictionary.rawLower[lowerWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }
    }

    if(right && left !== '&') {
      for(let searchWord of [lowerWord, word, upperWord]) {
        if(this.reverseDictionary.attachEnd.hasOwnProperty(searchWord)) {
          let ans = this.reverseDictionary.attachEnd[searchWord];
          return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
        }
      }

      if(outputCase.indexOf(0) < 0 && this.reverseDictionary.attachEndLower.hasOwnProperty(lowerWord)) {
        let ans = this.reverseDictionary.attachEndLower[lowerWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }
    }

    if(left && right !== '&') {
      for(let searchWord of [lowerWord, word, upperWord]) {
        if(this.reverseDictionary.attachStart.hasOwnProperty(searchWord)) {
          let ans = this.reverseDictionary.attachStart[searchWord];
          return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
        }
      }

      if(outputCase.indexOf(0) < 0 && this.reverseDictionary.attachStartLower.hasOwnProperty(lowerWord)) {
        let ans = this.reverseDictionary.attachStartLower[lowerWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }
    }

    if(left && right) {
      for(let searchWord of [lowerWord, word, upperWord]) {
        if(this.reverseDictionary.attachBothEnds.hasOwnProperty(searchWord)) {
          let ans = this.reverseDictionary.attachBothEnds[searchWord];
          return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
        }
      }

      if(outputCase.indexOf(0) < 0 && this.reverseDictionary.attachBothEndsLower.hasOwnProperty(lowerWord)) {
        let ans = this.reverseDictionary.attachBothEndsLower[lowerWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }
    }

    for(let searchWord of [lowerWord, word, upperWord]) {
      if(this.reverseDictionary.glue.hasOwnProperty(searchWord)) {
        let ans = this.reverseDictionary.glue[searchWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }

      if(outputCase.indexOf(0) < 0 && this.reverseDictionary.glueLower.hasOwnProperty(lowerWord)) {
        let ans = this.reverseDictionary.glueLower[lowerWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }
    }

    if(right !== '&') {
      for(let searchWord of [lowerWord, word, upperWord]) {
        if(this.reverseDictionary.glueStart.hasOwnProperty(searchWord)) {
          let ans = this.reverseDictionary.glueStart[searchWord];
          return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
        }
      }

      if(outputCase.indexOf(0) < 0 && this.reverseDictionary.glueStartLower.hasOwnProperty(lowerWord)) {
        let ans = this.reverseDictionary.glueStartLower[lowerWord];
        return [[ans.steno], {...state, case: ans.case === 'carry_capitalize' ? state.case : ans.case}];
      }
    }

    // check static case
    if(this.reverseDictionary.glueFixed.hasOwnProperty(word)) {
      let ans = this.reverseDictionary.glueFixed[word];
      return [[ans.steno], {...state, case: false}];
    }

    // recurssive methods:
    let solutions = [];

    for(let length = word.length - 1; length > 0; length--) {
      // look for suffix solutions
      {
        let i =  word.length - length;
        let desiredPrefix = word.slice(0, i);
        let desiredSuffix = lowerWord.slice(i);
        if(desiredSuffix[0] === ' ') continue;
        if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
        if(this.reverseDictionary.attachStart.hasOwnProperty(desiredSuffix)) {
          let rec = this.searchPhrase(desiredPrefix, state, {right: '^', left});
          if(rec[0]) {
            let ans = this.reverseDictionary.attachStart[desiredSuffix];
            solutions.push([
              [
                ...rec[0],
                ans.steno,
              ],
              {
                ...rec[1],
                case: ans.case === 'carry_capitalize' ? rec[1].case : ans.case
              }
            ]);
          }
        }
      }

      // look for prefix solutions
      {
        let i = length;
        let desiredPrefix = lowerWord.slice(0, i);
        let desiredSuffix = word.slice(i);
        if(desiredSuffix[0] === ' ') continue;
        if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
        if(this.reverseDictionary.attachEnd.hasOwnProperty(desiredPrefix)) {
          let ans = this.reverseDictionary.attachEnd[desiredPrefix];
          let rec = this.searchPhrase(desiredSuffix, {
            ...state,
            case: ans.case === 'carry_capitalize' ? state.case : ans.case
          }, {left: '^', right});
          if(rec[0]) {
            solutions.push([
              [
                ans.steno,
                ...rec[0]
              ],
              rec[1]
            ]);
          }
        }
      }

      // look for inffix solutions
      if(length <= word.length - 2) {
        let i = length;
        for(let j = 1; j < word.length - i; j++) {
          let desiredPrefix = word.slice(0, j);
          let desiredInffix = lowerWord.slice(j, j + i);
          let desiredSuffix = word.slice(j + i);
          if(desiredSuffix[0] === ' ') continue;
          if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
          if(desiredInffix[0] === ' ') continue;
          if(desiredInffix[desiredInffix.length - 1] === ' ') continue;

          if(this.reverseDictionary.attachBothEnds.hasOwnProperty(desiredInffix)) {
            let recPre = this.searchPhrase(desiredPrefix, state, {right: '^', left});
            if(recPre[0]) {
              let ans = this.reverseDictionary.attachBothEnds[desiredInffix];
              let recSuf = this.searchPhrase(desiredSuffix, {
                ...recPre[1],
                case: ans.case === 'carry_capitalize' ? recPre[1].case : ans.case
              }, {left: '^', right});
              if(recSuf[0]) {
                solutions.push([
                  [
                    ...recPre[0],
                    ans.steno,
                    ...recSuf[0],
                  ],
                  recSuf[1]
                ]);
              }
            }
          }
        }
      }
      else if(/[^\w\s\d]/.test(word)) {
        for(let i = word.length - 2; i > 1; i--) {
          for(let j = 1; j < word.length - i; j++) {
            let desiredPrefix = word.slice(0, j);
            let desiredInffix = lowerWord.slice(j, j + i);
            let desiredSuffix = word.slice(j + i);
            if(!/[^\w\s\d]/.test(desiredInffix)) continue;
            if(desiredSuffix[0] === ' ') continue;
            if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
            if(desiredInffix[0] === ' ') continue;
            if(desiredInffix[desiredInffix.length - 1] === ' ') continue;

            if(this.reverseDictionary.attachBothEnds.hasOwnProperty(desiredInffix)) {
              let recPre = this.searchPhrase(desiredPrefix, state, {right: '^', left});
              if(recPre[0]) {
                let ans = this.reverseDictionary.attachBothEnds[desiredInffix];
                let recSuf = this.searchPhrase(desiredSuffix, {
                  ...recPre[1],
                  case: ans.case === 'carry_capitalize' ? recPre[1].case : ans.case
                }, {left: '^', right});
                if(recSuf[0]) {
                  solutions.push([
                    [
                      ...recPre[0],
                      ans.steno,
                      ...recSuf[0],
                    ],
                    recSuf[1]
                  ]);
                }
              }
            }
          }
        }
      }

      // look for glue prefix solutions
      {
        let i = length;
        let desiredPrefix = lowerWord.slice(0, i);
        let desiredSuffix = word.slice(i);
        if(desiredSuffix[0] === ' ') continue;
        if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
        if(this.reverseDictionary.glue.hasOwnProperty(desiredPrefix)) {
          let ans = this.reverseDictionary.glue[desiredPrefix];
          let rec = this.searchPhrase(desiredSuffix, {
            ...state,
            case: ans.case === 'carry_capitalize' ? state.case : ans.case
          }, {left: '&', right});
          if(rec[0]) {
            solutions.push([
              [
                ans.steno,
                ...rec[0]
              ],
              rec[1]
            ]);
          }
        }
      }

      // look for starting-glue suffix solutions
      {
        let i =  word.length - length;
        let desiredPrefix = lowerWord.slice(0, i);
        let desiredSuffix = word.slice(i);
        if(desiredSuffix[0] === ' ') continue;
        if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
        if(this.reverseDictionary.glueStart.hasOwnProperty(desiredSuffix)) {
          let ans = this.reverseDictionary.glueStart[desiredSuffix];
          let rec = this.searchPhrase(desiredPrefix, state, {left, right: '&'});
          if(rec[0]) {
            solutions.push([
              [
                ...rec[0],
                ans.steno
              ],
              {
                ...rec[1],
                case: ans.case === 'carry_capitalize' ? rec[1].case : ans.case
              }
            ]);
          }
        }
      }
    }

    // look for combinations of briefs (avoiding affix-bias)
    if(solutions.length > 0 && word.split(' ').length > 1) {
      let words = word.split(' ');
      for(let i = 1; i < words.length; i++) {
        let ans = this.searchPhrase(words.slice(0, i).join(' '), state, {left});
        if(ans[0]) {
          let ans2 = this.searchPhrase(words.slice(i).join(' '), ans[1], {right});
          if(ans2[0]) {
            solutions.push([[...ans[0], ...ans2[0]], ans2[1]]);
          }
        }
      }
    }

    if(/^[0-9]*$/.test(word)) {
      solutions.push([stenoNumber(word), {...oldState, case: false}]);
    }

    // look for currencies
    if(/[0-9]/.test(word)) {
      for(let currency in this.reverseDictionary.currency) {
        let format = this.reverseDictionary.currency[currency];
        if(RegExp(`^${escapeRegExp(format[0])}[0-9][0-9]?[0-9]?(\,[0-9][0-9][0-9])*${escapeRegExp(format[1])}$`).test(word)) {
          solutions.push([
            [
              ...this.searchPhrase(word.replace(format[0],'').replace(format[1],'').replace(/\,/g,''))[0],
              currency
            ],
            {...oldState, case: false}
          ]);
        }
        if(RegExp(`^${escapeRegExp(format[0])}[0-9][0-9]?[0-9]?(\,[0-9][0-9][0-9])*\.[0-9]?[0-9]?${escapeRegExp(format[1])}$`, ).test(word)) {
          let txt = word.replace(format[0],'').replace(format[1],'').replace(/\,/g,'');
          while(txt[txt.length - 1] === '0') {
            txt = txt.slice(0, txt.length - 1);
          }
          solutions.push([
            [
              ...this.searchPhrase(txt)[0],
              currency
            ],
            {...oldState, case: false}
          ]);
        }
      }
    }

    // look for conditionals
    if(left !== '&' && right !== '&') {
      for(let steno in this.reverseDictionary.conditional) {
        let condition = this.reverseDictionary.conditional[steno];

        for(let searchWord of [lowerWord, word, upperWord]) {
          if(searchWord.indexOf(condition[1]) === 0 &&
            searchWord[condition[1].length] === ' ') {
            let carried = word.slice(condition[1].length + 1);
            if(RegExp('^'+condition[0]).test(carried)) {
              let ans = this.searchPhrase(carried, {
                ...state,
                case: false
              }, {right});
              if(ans[0]) {
                solutions.push([[steno, ...ans[0]], ans[1]]);
              }
            }
          }
          if(searchWord.indexOf(condition[2]) === 0 &&
            searchWord[condition[2].length] === ' ') {
            let carried = word.slice(condition[2].length + 1);
            if(!RegExp('^'+condition[0]).test(carried)) {
              let ans = this.searchPhrase(carried, {
                ...state,
                case: false
              }, {right});
              if(ans[0]) {
                solutions.push([[steno, ...ans[0]], ans[1]]);
              }
            }
          }
        }
      }
    }

    // return if a solution has been found
    if(solutions.length > 0) {
      solutions.sort(shortestStroke);
      return solutions[0];
    }

    // look for number prefix solutions
    for(let i = word.length - 1; i > 0; i--) {
      let desiredPrefix = lowerWord.slice(0, i);
      let desiredSuffix = word.slice(i);
      if(desiredSuffix[0] === ' ') continue;
      if(desiredPrefix[desiredPrefix.length - 1] === ' ') continue;
      if(/^[0-9]*$/.test(desiredPrefix)) {
        let rec = this.searchPhrase(desiredSuffix, {
          ...state,
          case: false
        }, {left: '&', right});
        if(rec[0]) {
          solutions.push([
            [
              ...stenoNumber(desiredPrefix),
              ...rec[0]
            ],
            rec[1]
          ]);
        }
      }
    }

    if(this.reverseDictionary.other.hasOwnProperty('{*-|}') &&
      word[0].toLowerCase() !== word[0] &&
      state.case !== Case.CAP_FIRST_WORD) {
      let rec = this.searchPhrase(word, {...state, case: Case.CAP_FIRST_WORD}, options);
      if(rec[0]) {
        solutions.push([
          [
            rec[0][0],
            this.reverseDictionary.other['{*-|}'],
            ...rec[0].slice(1)
          ],
          rec[1]
        ]);
      }
    }

    else if(this.reverseDictionary.other.hasOwnProperty('{-|}') &&
      word[0].toLowerCase() !== word[0] &&
      state.case !== Case.CAP_FIRST_WORD) {
      let rec = this.searchPhrase(word, {...state, case: Case.CAP_FIRST_WORD}, options);
      if(rec[0]) {
        solutions.push([
          [
            this.reverseDictionary.other['{-|}'],
            ...rec[0]
          ],
          rec[1]
        ]);
      }
    }

    if(this.reverseDictionary.other.hasOwnProperty('{*>}') &&
      word[0].toUpperCase() !== word[0] &&
      state.case !== Case.LOWER_FIRST_CHAR) {
      let rec = this.searchPhrase(word, {...state, case: Case.LOWER_FIRST_CHAR}, options);
      if(rec[0]) {
        solutions.push([
          [
            rec[0][0],
            this.reverseDictionary.other['{*>}'],
            ...rec[0].slice(1)
          ],
          rec[1]
        ]);
      }
    }

    else if(this.reverseDictionary.other.hasOwnProperty('{>}') &&
      word[0].toUpperCase() !== word[0] &&
      state.case !== Case.LOWER_FIRST_CHAR) {
      let rec = this.searchPhrase(word, {...state, case: Case.LOWER_FIRST_CHAR}, options);
      if(rec[0]) {
        solutions.push([
          [
            this.reverseDictionary.other['{>}'],
            ...rec[0]
          ],
          rec[1]
        ]);
      }
    }

    // return if a solution has been found
    if(solutions.length > 0) {
      solutions.sort(shortestStroke);
      return solutions[0];
    }

    return [false, state];
  }

  // toStenoGrouped - input: text or steno tape array
  toStenoCodeGrouped(txt) {
    if(Array.isArray(txt)) {
      return this.toTextCodeGrouped(txt);
    }

    let words = txt.split(' ');
    let ans = [];

    let state = JSON.parse(JSON.stringify(startingState));
    state.startAttached = false;

    mainLoop:
    for(let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      let strokes;
      // search long phrases
      for(let longPhrase in this.longDictionary) {
        let wordCount = longPhrase.split(' ').length;
        let fitPhrase = words.slice(wordIndex, wordIndex + wordCount).join(' ');

        if(fitPhrase.toLowerCase().indexOf(longPhrase.toLowerCase()) >= 0) {
          [strokes, state] = this.searchPhrase(fitPhrase, state);
          if(strokes) {
            wordIndex += wordCount - 1;
            ans.push(...this.toTextCodeGrouped(strokes.join(' ')));
            continue mainLoop;
          }
        }
      }

      // search for phrase
      for(let phraseLength = Math.min(this.maxLookAhead, words.length - wordIndex); phraseLength > 0; phraseLength--) {
        [strokes, state] = this.searchPhrase(words.slice(wordIndex, wordIndex + phraseLength).join(' '), state);
        if(strokes) {
          wordIndex += phraseLength - 1;
          ans.push(...this.toTextCodeGrouped(strokes.join(' ')));
          continue mainLoop;
        }
      }

      for(let phraseLength = this.maxLookAhead + 1; phraseLength <= Math.min(words.length - wordIndex, 12); phraseLength++) {
        [strokes, state] = this.searchPhrase(words.slice(wordIndex, wordIndex + phraseLength).join(' '), state);
        if(strokes) {
          wordIndex += phraseLength - 1;
          ans.push(...this.toTextCodeGrouped(strokes.join(' ')));
          continue mainLoop;
        }
      }

      throw `\x1b[31mNo dictionary match for "${words[wordIndex]}"\n` +
      `${ans.map(a=>a[0]).join(' ').slice(-32)} ${words.slice(wordIndex, wordIndex + 6).join(' ')}\n` +
      `${''.padStart(ans.map(a=>a[0]).join(' ').slice(-32).length, ' ')} ^\x1b[0m`;
    }

    return ans;
  }

  // toStenoGrouped - input: text or steno tape array
  toStenoGrouped(txt) {
    if(Array.isArray(txt)) {
      return this.toTextGrouped(txt);
    }

    return this.toGrouped(this.toStenoCodeGrouped(txt));
  }

  // toSteno - input: text or steno tape array
  toSteno(txt) {
    return this.toStenoGrouped(txt).map(a=>a[1]).join(' ');
  }

  // toStenoTape - input: text
  toStenoTape(txt) {
    return stenoToStenoTape(this.toStenoGrouped(steno).map(a => a[1]).join(' '));
  }

  addDictionary(dictionary, callback = () => {}) {
    let resolver;
    let prom = new Promise((resolv) => resolver = resolv);
    if(typeof dictionary === 'object') {
      Object.assign(this.dictionary, dictionary);
      for(let key in dictionary) {
        this.addReverseEntry(dictionary[key], key);
      }
      resolver();
      callback();
      return prom;
    }

    let err = new Error('dictionary not readable');

    resolver(err);
    callback(err);
    return prom;
  }
}
