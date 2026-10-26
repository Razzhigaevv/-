/* ============================================================
   app.js — интерактивная логика демо «Особый досуг»
   Возраст на играх · только подходящие · карточки где нужны ·
   отчёт специалисту · супер-герой · творчество (сказка+аватарка)
   ============================================================ */
'use strict';

/* ---------- профиль ребёнка ---------- */
const P = {
  child:'Мия', childDat:'Мие', parent:'Анна', avatar:'👧', avatarImg:null, avatarCls:'av-lav',
  age:3, time:10, special:true,
  dx:['РАС'], trig:['loud','switch'],
  ints:['animals','music'],
  mats:['grain','ball','blocks','paper','clay'],
  skills:{mot:2, sen:2, spe:1, cog:2, soc:1, att:2, cre:3}
};

const SKILLS = [
  {k:'mot', l:'Мелкая моторика'},
  {k:'sen', l:'Сенсорное восприятие'},
  {k:'spe', l:'Речь'},
  {k:'cog', l:'Мышление и память'},
  {k:'soc', l:'Социальные навыки'},
  {k:'att', l:'Внимание'}
];
const LEVELS = ['пока не сформирован','начинает формироваться','формируется','в основном сформирован','уверенно владеет'];

const DX_GROUPS = [
  {label:'Развитие и поведение', items:[
    {v:'РАС',l:'РАС'},{v:'ЗПР',l:'ЗПР'},{v:'СДВГ',l:'СДВГ'},{v:'Дауна',l:'Синдром Дауна'},
    {v:'УО',l:'Интеллект. особенности'},{v:'Пов',l:'Поведение'},{v:'Эм',l:'Эмоции и тревожность'}]},
  {label:'Речь', items:[
    {v:'НР',l:'Нарушения речи'},{v:'Заик',l:'Заикание'},{v:'Дислекс',l:'Дислексия и письмо'}]},
  {label:'Движение', items:[
    {v:'ДЦП',l:'ДЦП'},{v:'Двиг',l:'Двигательные особенности'}]},
  {label:'Слух и зрение', items:[
    {v:'Слух',l:'Нарушения слуха'},{v:'Зрение',l:'Нарушения зрения'}]}
];
const DX_ALL = [];
DX_GROUPS.forEach(gr=>gr.items.forEach(it=>DX_ALL.push(it)));
const SETS = {
  dx: DX_ALL,
  trig:[{v:'loud',l:'🔊 Громкие звуки'},{v:'bright',l:'💡 Яркий свет'},{v:'touch',l:'✋ Тактильная чувств.'},{v:'tired',l:'😴 Быстрая утомляемость'},{v:'switch',l:'🔄 Трудно менять деятельность'},{v:'small',l:'⚠️ Тянет мелкое в рот'},{v:'crowd',l:'👥 Шумные компании'}],
  ints:[{v:'animals',l:'🐱 Животные'},{v:'cars',l:'🚗 Машинки'},{v:'music',l:'🎵 Музыка'},{v:'art',l:'🎨 Рисование'},{v:'tales',l:'📖 Сказки'},{v:'blocks',l:'🧱 Кубики'},{v:'water',l:'💧 Вода'},{v:'nature',l:'🌿 Природа'},{v:'ball',l:'⚽ Мяч'},{v:'clay',l:'🟠 Лепка'}],
  mats:[{v:'grain',l:'🍚 Крупа'},{v:'ball',l:'⚽ Мяч'},{v:'blocks',l:'🧱 Кубики'},{v:'paper',l:'📄 Бумага и карточки'},{v:'clay',l:'🟠 Пластилин'},{v:'pins',l:'👕 Прищепки'},{v:'buttons',l:'🔘 Пуговицы'},{v:'bubbles',l:'🫧 Пузыри'},{v:'books',l:'📚 Книги'},{v:'paints',l:'🎨 Краски'},{v:'water',l:'💧 Вода'},{v:'toys',l:'🧸 Игрушки'},{v:'pillows',l:'🛏 Подушки'},{v:'box',l:'📦 Коробки и ёмкости'},{v:'spoons',l:'🥄 Посуда'},{v:'music',l:'🎵 Музыка и шумелки'},{v:'socks',l:'🧦 Ленты и ткани'}]
};
const MATS_LABEL = {}; SETS.mats.forEach(m=>MATS_LABEL[m.v]=m.l);
const SK_LABEL = {mot:'мелкую моторику', sen:'сенсорику', spe:'речь', cog:'мышление и память', soc:'социальные навыки', att:'внимание', cre:'воображение'};

/* суперсилы — особенность превращается в силу героя */
const POWERS = {
  'РАС':'🔍 Супер-внимание к деталям','ЗПР':'🐢 Сила своего темпа','СДВГ':'⚡ Энергия молнии',
  'Дауна':'🌞 Солнечное сердце','УО':'🧩 Свой способ решения','Пов':'🛡 Сила спокойствия',
  'Эм':'💖 Владение эмоциями','НР':'🗣 Магия слов','Заик':'🎶 Ритм-магия',
  'Дислекс':'📖 Видит скрытые буквы','ДЦП':'🚀 Сила духа','Двиг':'🤸 Гибкость мастера',
  'Слух':'👋 Читает по рукам','Зрение':'🦅 Супер-зрение'
};

const MUSIC = {
  calm:  {e:'🎹', t:'Спокойная фортепианная музыка', m:'тихо · 10 мин'},
  nature:{e:'🌧', t:'Шум дождя', m:'звуки природы · тихо · 10 мин'},
  rhythm:{e:'🥁', t:'Лёгкий ритм', m:'для движений · средне · 5 мин'},
  fun:   {e:'🎈', t:'Весёлая мелодия', m:'бодро · 7 мин'},
  lull:  {e:'🌙', t:'Колыбельная', m:'очень тихо · 10 мин'},
  songs: {e:'🎤', t:'Весёлые песенки', m:'с подпеванием · 8 мин'},
  classic:{e:'🎻', t:'Моцарт для малышей', m:'классика · тихо · 12 мин'},
  none:  {e:'🔇', t:'Без музыки', m:'тишина помогает сосредоточиться'}
};
const MUSIC_BY_CAT = {sensor:'nature', motor:'rhythm', speech:'songs', cog:'classic', social:'fun', relax:'lull', creative:'calm'};

/* карточки — только для игр, где нужны карточки */
const CARD_INFO = {
  pair:    ['cards/pair-cards.png','🃏 Понадобятся парные карточки','Распечатайте или нарисуйте пары сами — подойдут даже картинки из журналов.'],
  loto:    ['cards/loto-cards.png','🎲 Понадобится лото','Большая карта с картинками и фишки. Лото легко нарисовать на бумаге.'],
  symbol:  ['cards/symbol-cards.png','🚦 Понадобятся карточки-символы','Зелёная — «иди», красная — «стоп». Символ вместо голосового сигнала — тише и понятнее.'],
  rhythm:  ['cards/rhythm.png','🎵 Понадобятся ритм-карточки','Карточки со знаками: хлопок, топот, пауза. Выкладывайте схему на стол.'],
  emotion: ['cards/emotion-cards.png','😊 Понадобятся карточки эмоций','Лица с эмоциями: радость, грусть, спокойствие. Можно распечатать или рисовать по очереди.'],
  word:    ['cards/word-cards.png','🔤 Понадобятся карточки со словами','Крупные буквы и короткие слова — на карточках или половинках альбомного листа.'],
  task:    ['cards/task-cards.png','🃏 Понадобятся карточки заданий','Простые задания на карточках: покажи, повтори, найди. 4–6 карточек достаточно.']
};

const state = {
  lib:{cat:'all', q:'', limit:30},
  current:null, from:'s-games', run:null, adapted:null,
  mood:'calm', taleDur:5,
  favs:[],
  catStats:{sensor:{good:2,hard:0}, social:{good:1,hard:0}, motor:{good:1,hard:0}, creative:{good:1,hard:0}, cog:{good:0,hard:2}},
  taleAudio:[], taleAudioIdx:0, taleAudioEl:null, taleTimer:null,
  diary:{ sessions:8, mins:96, likedN:6,
    bars:[33,0,23,42,0,29,12],
    labels:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    history:[
      {e:'❤️', t:'Сенсорная коробка с крупами', when:'Сегодня', mins:12, fb:'good', cat:'sensor', need:['крупа','игрушки','коробки / посуда']},
      {e:'❤️', t:'Ладушки', when:'Сегодня', mins:5, fb:'good', cat:'social', need:[]},
      {e:'😐', t:'Чего не хватает?', when:'Вчера', mins:8, fb:'hard', cat:'cog', need:['игрушки']},
      {e:'❤️', t:'Полоса препятствий', when:'Вчера', mins:15, fb:'good', cat:'motor', need:['подушки / пледы','мяч','стулья']},
      {e:'❤️', t:'Лепим угощение для куклы', when:'Ср', mins:10, fb:'good', cat:'creative', need:['пластилин / тесто']},
      {e:'😐', t:'Найди отличие', when:'Вт', mins:7, fb:'hard', cat:'cog', need:['карточки']}
    ]}
};

/* ---------- утилиты ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

let toastTimer = null;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}
function openM(id){ $('#'+id).classList.add('open'); }
function closeM(id){ $('#'+id).classList.remove('open'); }

function ageWord(n){
  const n10=n%10, n100=n%100;
  if(n10===1 && n100!==11) return n+' год';
  if(n10>=2 && n10<=4 && (n100<12||n100>14)) return n+' года';
  return n+' лет';
}
function ageLabel(a){
  return a[0]+'–'+a[1]+' '+(a[1]===1?'год':(a[1]%10>=2&&a[1]%10<=4&&(a[1]%100<12||a[1]%100>14)?'года':'лет'));
}
function dative(n){
  if(/[ая]$/.test(n)) return n.slice(0,-1)+'е';
  if(/[йы]$/.test(n)) return n.slice(0,-1)+'ю';
  return n+'е';
}
function needStr(g){
  if(g.need && g.need.length) return g.need.join(', ');
  return 'ничего не нужно — играем с тем, что под рукой';
}
function tagHtml(g){
  return `<span class="tag">${CATS[g.cat]}</span><span class="tag age">🎂 ${ageLabel(g.age)}</span><span class="tag m">${g.mins} мин</span>${g.cardType?'<span class="tag" style="background:#FBF0FF;color:#8a4fa8">🃏 карточки</span>':''}`;
}

/* ---------- соответствие: только подходящие игры ---------- */
function ageFit(g){
  return P.age >= g.age[0]-0.5 && P.age <= g.age[1]+1;
}
function trigFit(g){
  return !(g.risk||[]).some(r=>P.trig.includes(r));
}
function suitableList(){
  return GAMES.filter(g=>ageFit(g) && trigFit(g));
}
function hiddenCount(){
  return GAMES.length - suitableList().length;
}

/* ---------- скоринг соответствия ---------- */
const SKK = ['mot','sen','spe','cog','soc','att','cre'];
function score(g){
  let s = 8;
  const a0=g.age[0], a1=g.age[1], pa=P.age;
  if(pa>=a0 && pa<=a1) s+=25;
  else if(pa>=a0-0.5 && pa<=a1+1) s+=16;
  const pd = P.dx.length ? P.dx : ['норма'];
  s += (g.dxs||ALLDX).some(d=>pd.includes(d)) ? 14 : -10;
  if(!g.mats.length) s+=14;
  else {
    const have = g.mats.filter(m=>P.mats.includes(m)).length;
    s += Math.round(14*have/g.mats.length);
  }
  const ii = (g.ints||[]).filter(i=>P.ints.includes(i)).length;
  s += Math.min(14, ii*7);
  if(g.mins<=P.time) s+=9;
  else if(g.mins<=P.time*1.6) s+=4;
  else s-=5;
  let boost=0, maxB=0;
  SKK.forEach(k=>{
    const lvl = (P.skills[k]!=null)?P.skills[k]:3;
    const need = (5-lvl)/4;
    const w = g.sk[k]||0;
    boost += w*need; maxB += 3*need;
  });
  s += Math.round(14*(maxB ? boost/maxB : .6));
  if((g.risk||[]).some(r=>P.trig.includes(r))) s-=24;
  return Math.max(4, Math.min(99, Math.round(s)));
}
function ranked(){
  return suitableList().slice().sort((a,b)=>score(b)-score(a));
}

/* ---------- навигация ---------- */
const TABMAP = {
  's-home':'tab-home','s-quick1':'tab-home','s-quick2':'tab-home','s-aiload':'tab-home',
  's-hero-load':'tab-home','s-hero-done':'tab-home',
  's-games':'tab-games','s-game':'tab-games','s-run':'tab-games',
  's-tales':'tab-create','s-tale-new':'tab-create','s-tale':'tab-create','s-avatar2':'tab-create',
  's-chat':'tab-chat',
  's-profile':'tab-profile','s-child':'tab-profile','s-mygames':'tab-profile','s-diary':'tab-profile',
  's-report':'tab-profile','s-audio':'tab-profile','s-sub':'tab-profile'
};
const NONAV = ['s-welcome','s-question','s-ob1','s-ob2','s-ob3','s-aiload','s-hero-load'];

function go(id){
  if(id!=='s-tale' && window.speechSynthesis){ try{ speechSynthesis.cancel(); }catch(e){}
    state.speaking = false;
    const tp = $('#tale-player'); if(tp) tp.classList.remove('playing');
    const tb = $('#tale-play-btn'); if(tb) tb.textContent = '▶';
  }
  $$('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  const sc = $('#'+id); if(sc) sc.scrollTop = 0;
  $$('.tab').forEach(t=>t.classList.remove('on'));
  const tab = TABMAP[id]; if(tab && $('#'+tab)) $('#'+tab).classList.add('on');
  $('#phone').classList.toggle('has-nav', !NONAV.includes(id));
  if(id==='s-home') renderHome();
  if(id==='s-games') renderLib();
  if(id==='s-diary') renderDiary();
  if(id==='s-report') renderReport();
  if(id==='s-profile') renderCabinet();
  if(id==='s-child') renderChild();
  if(id==='s-mygames') renderMy();
  if(id==='s-avatar2') renderAvChips();
  if(id==='s-game' && !state.current){ const s0=suitableList(); if(s0.length) openGame(ranked()[0].id, 's-games'); }
}
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-goto]');
  if(el) go(el.getAttribute('data-goto'));
});

/* ---------- чипы (одиночный / мультивыбор) ---------- */
document.addEventListener('click', e=>{
  const chip = e.target.closest('.chip');
  if(!chip) return;
  const box = chip.parentElement;
  if(!box) return;
  if(box.classList.contains('single')){
    box.querySelectorAll('.chip').forEach(c=>c.classList.remove('sel'));
    chip.classList.add('sel');
  } else if(box.classList.contains('multi')){
    chip.classList.toggle('sel');
  }
  if(box.id==='cat-chips'){ state.lib.cat = chip.getAttribute('data-cat')||'all'; state.lib.limit = 30; renderLib(); }
  if(box.id==='tale-dur'){ state.taleDur = +chip.getAttribute('data-v')||5; }
  if(box.closest('#s-quick2') && chip.hasAttribute('data-v')) state.mood = chip.getAttribute('data-v');
});

function updateNames(){
  const set = (sel,val)=>{ const el=document.querySelector(sel); if(el) el.textContent=val; };
  set('#suit-name', P.childDat);
  set('#tales-name', P.childDat);
  set('#avatar-name', P.childDat);
  set('#name-input', P.child);
}

/* ---------- личный кабинет: ребёнок под фоткой ---------- */
function renderCabinet(){
  $('#name-label').textContent = P.child;
  const av = $('#profile-avatar');
  av.className = 'avatar-xl ' + P.avatarCls;
  av.innerHTML = P.avatarImg ? `<img src="${P.avatarImg}" alt="${P.child}" style="width:100%;height:100%;border-radius:38px;object-fit:cover">` : P.avatar;
  /* мини-список любимых игр */
  const favs = state.favs.map(id=>GAMES.find(g=>g.id===id)).filter(Boolean);
  $('#my-count').textContent = favs.length ? favs.length+' ›' : '›';
  $('#mymini').innerHTML = favs.length
    ? favs.slice(0,2).map(g=>gcardHtml(g)).join('')
    : '<p class="sub" style="font-size:12.5px;margin:2px 2px 8px">Пока пусто — поиграйте и нажмите «Понравилось» ❤️</p>';
}
function renderChild(){
  $('#child-name').textContent = P.child;
  $('#child-avatar').className = 'avatar-big ' + P.avatarCls;
  $('#child-avatar').innerHTML = P.avatarImg ? `<img src="${P.avatarImg}" alt="${P.child}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">` : P.avatar;
  $('#child-sub').textContent = ageWord(P.age) + (P.dx.length ? ' · ' + P.dx.join(', ') : ' · особенности не выбраны');
  const sl = $('#age-slider'); sl.value = P.age;
  $('#age-val').textContent = ageWord(P.age);
  const tc = $('#time-chips');
  tc.querySelectorAll('.chip').forEach(c=>c.classList.toggle('sel', +c.getAttribute('data-v')===P.time));
  renderDxChips(P.dx);
  renderChips('trig-chips','trig',P.trig);
  renderChips('int-chips','ints',P.ints);
  renderChips('mat-chips','mats',P.mats);
  const ss = $('#skill-sliders');
  ss.innerHTML = SKILLS.map(sk=>{
    const v = P.skills[sk.k];
    return `<div class="card skill">
      <div class="sk-top"><b>${sk.l}</b><span class="sl-val" id="slv-${sk.k}">${v}/5</span></div>
      <input type="range" min="1" max="5" step="1" value="${v}" oninput="setSkill('${sk.k}', this.value)">
      <p class="sl-label" id="sll-${sk.k}">${LEVELS[v-1]}</p>
    </div>`;
  }).join('');
}
function renderDxChips(arr){
  const box = $('#dx-chips');
  box.innerHTML = DX_GROUPS.map(gr=>
    `<div class="dxgroup">${gr.label}</div><div class="chips multi">` +
    gr.items.map(o=>`<button class="chip ${arr.includes(o.v)?'sel':''}" onclick="toggleSet('dx','${o.v}')">${o.l}</button>`).join('') +
    `</div>`
  ).join('');
}
function setSkill(k, v){
  P.skills[k] = +v;
  $('#slv-'+k).textContent = v+'/5';
  $('#sll-'+k).textContent = LEVELS[v-1];
  renderHome(); renderLib();
}
function renderChips(id, setKey, arr){
  const box = $('#'+id);
  box.classList.add('multi');
  box.innerHTML = SETS[setKey].map(o=>
    `<button class="chip ${arr.includes(o.v)?'sel':''}" data-v="${o.v}" onclick="toggleSet('${setKey}','${o.v}')">${o.l}</button>`
  ).join('');
}
function toggleSet(setKey, v){
  const arr = P[setKey];
  const i = arr.indexOf(v);
  if(i>=0) arr.splice(i,1); else arr.push(v);
  if(['trig','ints','mats'].includes(setKey)) renderChild(); else renderChild();
  renderHome(); renderLib();
}

/* ---------- главная ---------- */
function renderHome(){
  $('#home-child').textContent = P.child;
  const av = $('#home-avatar');
  av.className = 'avatar-sm ' + P.avatarCls;
  av.innerHTML = P.avatarImg ? `<img src="${P.avatarImg}" alt="${P.child}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">` : P.avatar;
  const top = ranked().slice(0,3);
  $('#home-recs').innerHTML = top.map(g=>gcardHtml(g)).join('');
}
function gcardHtml(g){
  return `<div class="card gcard" onclick="openGame('${g.id}')">
    <div class="mini-cover ${COV[g.cat]}">${g.e}</div>
    <div style="flex:1;min-width:0">
      <b style="font-size:14px">${g.t}</b>
      <p class="sub" style="font-size:11.5px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g.goal}</p>
      <div class="tagrow" style="margin:6px 0 0">${tagHtml(g)}</div>
    </div>
    <div style="text-align:center;flex-shrink:0">
      <b style="color:var(--coral);font-size:15px">${score(g)}%</b>
      <span class="sub" style="display:block;font-size:9.5px;font-weight:700">подходит</span>
    </div>
  </div>`;
}

/* ---------- база игр: только подходящие ---------- */
function renderLib(){
  const list = ranked().filter(g=>{
    if(state.lib.cat!=='all' && g.cat!==state.lib.cat) return false;
    if(state.lib.q && !g.t.toLowerCase().includes(state.lib.q)) return false;
    return true;
  });
  const shown = list.slice(0, state.lib.limit);
  const hid = hiddenCount();
  $('#lib-count').textContent = `Подходящих: ${list.length} из ${GAMES.length}${hid?` · скрыто ${hid} по возрасту и особенностям`:''}`;
  $('#lib-list').innerHTML = shown.length
    ? shown.map(g=>gcardHtml(g)).join('')
    : '<div class="card" style="text-align:center;padding:24px"><p class="sub">Под этот возраст игр не нашлось 😔 Попробуйте сдвинуть возраст в характеристиках ребёнка.</p></div>';
  const more = $('#lib-more');
  if(more) more.style.display = list.length > state.lib.limit ? 'flex' : 'none';
}
$('#lib-search').addEventListener('input', e=>{
  state.lib.q = e.target.value.trim().toLowerCase();
  state.lib.limit = 30;
  renderLib();
});
const libMore = document.getElementById('lib-more');
if(libMore) libMore.addEventListener('click', ()=>{ state.lib.limit += 30; renderLib(); });

/* ---------- карточки: только карточным играм ---------- */
function openDemoCardGame(){
  const withCards = ranked().filter(g=>g.cardType);
  if(withCards.length){ openGame(withCards[0].id, 's-games'); }
  else { toast('Карточные игры появятся в подборке 🎴'); go('s-games'); }
}

/* ---------- карточка игры ---------- */
function openGame(id, from){
  const g = GAMES.find(x=>x.id===id);
  if(!g) return;
  state.current = g;
  if(from) state.from = from;
  const fav = isFav(g.id);
  const cardBlock = g.cardType && CARD_INFO[g.cardType] ? (()=>{
    const [img,cap,note] = CARD_INFO[g.cardType];
    return `<div class="cardblock">
      <b>${cap}</b>
      <img loading="lazy" src="${img}" alt="${cap}">
      <p class="sub" style="font-size:12.5px">${note}</p>
    </div>`;
  })() : '';
  const sks = Object.keys(g.sk).filter(k=>g.sk[k]>=2).map(k=>SK_LABEL[k]).slice(0,3);
  const skillsLine = sks.length ? `<p style="font-size:13px;margin-top:6px;color:var(--mut)"><b>Развивает:</b> ${sks.join(', ')}</p>` : '';
  const adaptedTag = state.adapted===g.id ? '<span class="tag m">✨ Адаптировано под профиль</span>' : '';
  $('#game-body').innerHTML = `
    <button class="back" data-goto="${state.from}">← Назад</button>
    <div class="cover ${COV[g.cat]}">${g.e}<small>🎂 ${ageLabel(g.age)}</small></div>
    <div class="h1" style="font-size:23px;margin-top:12px">${g.t}</div>
    <div class="tagrow">
      <span class="tag">${CATS[g.cat]}</span>
      <span class="tag age">🎂 ${ageLabel(g.age)}</span>
      <span class="tag m">${g.mins} мин</span>
      <span class="tag">${score(g)}% подходит</span>
      ${adaptedTag}
    </div>
    <div class="card" style="margin-top:8px">
      <b style="font-size:14px">🎯 Цель игры</b>
      <p class="sub" style="font-size:13px;margin-top:4px">${g.goal}</p>
      <p style="font-size:13.5px;margin-top:10px"><b>🧺 Понадобится:</b> ${needStr(g)}</p>
      ${skillsLine}
    </div>
    ${cardBlock}
    <div class="sect">Как играть — ${g.steps.length} шагов</div>
    ${g.steps.map((s,i)=>
      `<div class="step"><div class="step-img" style="background:${['#EFE9FF','#EAF9F3','#FFF4E4','#FFEDEA'][i%4]}">${i+1}</div><div style="flex:1;min-width:0"><p>${s}</p></div></div>`
    ).join('')}
    <button class="btn btn-primary" onclick="startRun()">▶ Начать занятие</button>
    <button class="btn ${fav?'btn-fav':'btn-ghost'} btn-sm" style="margin-top:10px" onclick="toggleFav()">${fav?'❤️ В «Моих играх» — убрать':'🤍 Добавить в «Мои игры»'}</button>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="btn btn-mint btn-sm" onclick="openMusic()">🎵 Музыка к игре</button>
      <button class="btn btn-lav btn-sm" onclick="openAdapt()">🔄 Переработка под возраст</button>
    </div>`;
  go('s-game');
}

/* ---------- модалка: музыка ---------- */
function openMusic(){
  const g = state.current; if(!g) return;
  const key = (g.music && g.music!=='none') ? g.music : (MUSIC_BY_CAT[g.cat]||'calm');
  const tr = MUSIC[key];
  $('#mm-emoji').textContent = tr.e;
  $('#mm-track').textContent = tr.t;
  $('#mm-meta').textContent = tr.m;
  $('#mm-note').textContent = P.trig.includes('loud')
    ? 'Учтена чувствительность к звукам: трек тихий, без резких эффектов. Музыку можно отключить в любой момент.'
    : 'Подобрано под категорию игры. Если ребёнку комфортнее в тишине — отключите музыку.';
  openM('m-music');
}

/* ---------- модалка: адаптация ---------- */
function openAdapt(){
  const g = state.current; if(!g) return;
  const a = P.age;
  const bucket = a<3 ? '1–2 года' : (a<5 ? '3–4 года' : (a<7 ? '5–6 лет' : '7+ лет'));
  const generic = {
    '1–2 года':'Показываем каждый шаг руками, говорим коротко: одно слово — одно действие. Все шаги — совместные со взрослым.',
    '3–4 года':'Инструкция из 1–2 слов + образец. Половина шагов — совместные, половина — самостоятельные по подражанию.',
    '5–6 лет':'Полная словесная инструкция, ребёнок действует сам, взрослый — рядом и подбадривает.',
    '7+ лет':'Добавляем элемент соревнования, счёт и самопроверку результата.'
  };
  const shortN = Math.max(2, Math.round(g.steps.length * (P.time/g.mins)));
  const rows = [
    {e:'🎂', t:`Возраст: ${bucket}`, d: generic[bucket]},
    {e:'⏱', t:`Время: ${P.time} мин`, d: g.mins>P.time ? `Шаги сокращены с ${g.steps.length} до ${shortN}, паузы между ними — по самочувствию.` : `Полный вариант укладывается в отведённое время.`}
  ];
  const TRIG_ADAPT = {
    loud:'🔇 Музыку делаем тихой или отключаем, без резких звуковых эффектов.',
    bright:'🔅 Свет приглушаем, убираем яркие блики и мерцание.',
    touch:'🧤 Не настаиваем на тактильном контакте: сначала даём материал посмотреть, потом потрогать.',
    tired:'⏸ Сокращаем занятие до 2 шагов, добавляем отдых между ними.',
    switch:'🔔 Предупреждаем об окончании за минуту, завершаем любимым ритуалом.',
    small:'🔴 Мелкие детали заменяем крупными, следим за безопасностью.',
    crowd:'👥 Играем один на один со взрослым, без группы детей.'
  };
  P.trig.slice(0,3).forEach(t=>{
    if(TRIG_ADAPT[t]) rows.push({e:'🛡', t:'Триггер профиля', d:TRIG_ADAPT[t]});
  });
  $('#adapt-sub').textContent = `«${g.t}» перерабатывается под ${ageWord(P.age)} и особенности профиля`;
  $('#adapt-rows').innerHTML = rows.map(r=>
    `<div class="step" style="margin-bottom:10px"><div class="step-img" style="background:#EFE9FF">${r.e}</div><div><b style="font-size:13.5px">${r.t}</b><p class="sub" style="font-size:12.5px">${r.d}</p></div></div>`
  ).join('');
  openM('m-adapt');
}
function applyAdapt(){
  state.adapted = state.current ? state.current.id : null;
  closeM('m-adapt');
  if(state.current) openGame(state.current.id, state.from);
  toast('Игра переработана под профиль ✨');
}

/* ---------- выполнение занятия ---------- */
function startRun(){
  const g = state.current; if(!g) return;
  state.run = {g, done:g.steps.map(()=>false)};
  $('#run-title').textContent = g.t;
  const fb = $('#fbrow'); if(fb) fb.remove();
  const btn = $('#fin-btn'); btn.disabled = false; btn.textContent = 'Завершить занятие';
  renderRun();
  go('s-run');
}
function renderRun(){
  const r = state.run; if(!r) return;
  const doneN = r.done.filter(Boolean).length;
  $('#run-count').textContent = `${doneN} / ${r.done.length}`;
  $('#run-bar').style.width = (doneN/r.done.length*100)+'%';
  $('#run-body').innerHTML = r.g.steps.map((s,i)=>
    `<div class="rstep ${r.done[i]?'done':''}" onclick="toggleStep(${i})">
      <div class="circ">${r.done[i]?'✓':i+1}</div>
      <div style="flex:1"><b>Шаг ${i+1}</b><p>${s}</p></div>
    </div>`).join('');
}
function toggleStep(i){
  const r = state.run; if(!r) return;
  r.done[i] = !r.done[i];
  renderRun();
}
function showFeedback(){
  if($('#fbrow')) return;
  const btn = $('#fin-btn'); btn.textContent = 'Как прошло занятие? 👇'; btn.disabled = true;
  $('#run-body').insertAdjacentHTML('beforeend',
    `<div class="fb-row" id="fbrow">
      <button class="fb" onclick="finishRun('good')">❤️ Понравилось</button>
      <button class="fb" onclick="finishRun('hard')">😐 Было трудно</button>
    </div>`);
}
function finishRun(fb){
  const r = state.run; if(!r) return;
  const d = state.diary;
  d.sessions++; d.mins += r.g.mins;
  if(fb==='good') d.likedN++;
  d.history.unshift({e: fb==='good'?'❤️':'😐', t:r.g.t, when:'Сегодня', mins:r.g.mins, fb, cat:r.g.cat, need:r.g.need||[]});
  d.history = d.history.slice(0,8);
  const today = 6;
  d.bars[today] = Math.min(100, d.bars[today] + Math.round(r.g.mins*1.4));
  const cs = state.catStats[r.g.cat] || (state.catStats[r.g.cat]={good:0,hard:0});
  if(fb==='good') cs.good++; else cs.hard++;
  renderDiary();
  if(fb==='good'){
    if(!isFav(r.g.id)) state.favs.unshift(r.g.id);
    renderMy();
    go('s-mygames');
    toast('Игра сохранилась в «Мои игры» (в личном кабинете) ❤️');
  } else {
    go('s-diary');
    toast('Записали в дневник. Следующий раз ИИ упростит игру 🤝');
  }
}

/* ---------- дневник ---------- */
function renderDiary(){
  const d = state.diary;
  $('#stat-sessions').textContent = d.sessions;
  $('#stat-mins').textContent = d.mins;
  $('#stat-liked').textContent = Math.round(d.likedN/d.sessions*100)+'%';
  $('#diary-bars').innerHTML = d.bars.map((v,i)=>
    `<div class="bcol"><i class="${v?'':'zero'}" style="height:${Math.max(6,v)}%"></i><span>${d.labels[i]}</span></div>`).join('');
  $('#diary-history').innerHTML = d.history.map(h=>
    `<div class="card dentry"><span class="em">${h.e}</span>
      <div style="flex:1"><b style="font-size:14px">${h.t}</b>
      <p class="sub" style="font-size:12px">${h.when} · ${h.mins} мин · ${h.fb==='good'?'понравилось':'было трудно'}</p></div>
    </div>`).join('');
}

/* ---------- отчёт для специалиста ---------- */
function renderReport(){
  const d = state.diary;
  $('#rep-sessions').textContent = d.sessions;
  $('#rep-mins').textContent = d.mins;
  $('#rep-rate').textContent = Math.round(d.likedN/d.sessions*100)+'%';
  $$('.rep-child').forEach(el=>el.textContent = P.childDat);
  $$('.rep-age').forEach(el=>el.textContent = ageWord(P.age));
  $$('.rep-dx').forEach(el=>el.textContent = P.dx.length?P.dx.join(', '):'—');
  const rows = [];
  Object.keys(state.catStats).forEach(c=>{
    const st = state.catStats[c];
    const n = st.good+st.hard;
    if(!n) return;
    rows.push({cat:c, pct:Math.round(st.good/n*100), n});
  });
  const bar = (r, good) => {
    const col = good ? 'linear-gradient(90deg,#8FD9C4,#5cbf9e)' : 'linear-gradient(90deg,#FFB55C,#FF8A7A)';
    return `<div class="rline"><b>${CATS[r.cat]||r.cat}</b><div class="rbar"><i style="width:${Math.max(8,r.pct)}%;background:${col}"></i></div><span class="pct">${r.pct}%</span></div>`;
  };
  const yes = rows.filter(r=>r.pct>=60).sort((a,b)=>b.pct-a.pct);
  const no  = rows.filter(r=>r.pct<60).sort((a,b)=>a.pct-b.pct);
  $('#rep-yes').innerHTML = yes.length ? yes.map(r=>bar(r,true)).join('') : '<p class="sub" style="font-size:12.5px">Данных пока мало — поиграйте пару дней ❤️</p>';
  $('#rep-no').innerHTML = no.length ? no.map(r=>bar(r,false)).join('') : '<p class="sub" style="font-size:12.5px">Пока нет типов игр, которые «не заходят» — отличный результат 🎉</p>';
  /* любимые материалы */
  const matCount = {};
  const addMats = (need)=>(need||[]).forEach(m=>{ matCount[m]=(matCount[m]||0)+1; });
  state.favs.forEach(id=>{ const g=GAMES.find(x=>x.id===id); if(g) addMats(g.need); });
  d.history.filter(h=>h.fb==='good').forEach(h=>addMats(h.need));
  const topMats = Object.keys(matCount).sort((a,b)=>matCount[b]-matCount[a]).slice(0,5);
  $('#rep-mats').textContent = topMats.length
    ? 'Чаще всего с удовольствием играли с: ' + topMats.join(', ') + '. Эти материалы стоит держать под рукой.'
    : 'Отметится, когда появятся любимые игры.';
  /* наблюдения */
  const notes = [];
  if(P.dx.includes('РАС')||P.trig.includes('switch')) notes.push('Дети с РАС лучше вовлекаются в игры с чёткой структурой, повторяющимися шагами и визуальными карточками-символами.');
  if(P.trig.includes('loud')) notes.push('Громкие звуки — триггер: соревновательные и шумные игры давать дозированно, сигнал — карточкой, а не свистком.');
  if(P.dx.includes('СДВГ')) notes.push('Чередовать активные и спокойные блоки по 5–7 минут; правило «стоп» отрабатывать до игры.');
  if(P.age<=3) notes.push('Возраст 1–3 года: инструкция из 1–2 слов, образец показывает взрослый, совместные действия «рука в руке».');
  if(P.age>=6) notes.push('Возраст 6+: добавлять элемент соревнования, счёт и самопроверку результата.');
  if(yes.length) notes.push(`Заходят категории: ${yes.slice(0,2).map(r=>CATS[r.cat]).join(', ')} — опираться на них в коррекционных занятиях.`);
  if(no.length) notes.push(`Трудности: ${no.slice(0,2).map(r=>CATS[r.cat]).join(', ')} — упрощать шаги, сокращать длительность, вводить постепенно.`);
  $('#rep-notes').innerHTML = notes.map(n=>`<p style="font-size:13px;line-height:1.5;margin:0 0 8px">• ${n}</p>`).join('');
}

/* ---------- мои игры (избранное — в кабинете) ---------- */
function isFav(id){ return state.favs.includes(id); }
function toggleFav(){
  const g = state.current; if(!g) return;
  const i = state.favs.indexOf(g.id);
  if(i>=0){
    state.favs.splice(i,1);
    toast('Убрано из «Моих игр»');
  } else {
    state.favs.unshift(g.id);
    const cs = state.catStats[g.cat] || (state.catStats[g.cat]={good:0,hard:0});
    cs.good++;
    toast('Добавлено в «Мои игры» ❤️');
  }
  renderMy(); renderCabinet();
  openGame(g.id, state.from);
}
function renderMy(){
  const favs = state.favs.map(id=>GAMES.find(g=>g.id===id)).filter(Boolean);
  $('#myempty').style.display = favs.length ? 'none' : 'block';
  $('#mylist').innerHTML = favs.map(g=>gcardHtml(g)).join('');
}

/* ---------- аудио ---------- */
function togglePlay(btn){
  const p = btn.closest('.player');
  const was = p.classList.contains('playing');
  $$('.player.playing').forEach(x=>{ x.classList.remove('playing'); const b=x.querySelector('.playbtn'); if(b) b.textContent='▶'; });
  if(!was){ p.classList.add('playing'); btn.textContent='⏸'; }
}

/* ---------- сказка: сначала длительность ---------- */
const TALES = {
  '☁️ Дружба':  {t:'Как {N} нашла настоящего друга', s:'Жила-была {N}. Однажды во дворе она увидела облачко, которое потеряло свою тучку-маму. «Не грусти, — сказала {N}, — я помогу найти её!» Вместе они спросили дорогу у ветра, у солнца и у птиц. И вот за большой тучей они увидели маму. Облачко засияло от радости, а {N} поняла: помогать другим — приятно.'},
  '🌲 Природа': {t:'Прогулка {N} по волшебному лесу', s:'{N} пошла гулять в лес, где деревья умели шептать, а ручей — петь песенки. Ёжик показал ей тропинку, белка угостила орешком, а старый дуб рассказал сказку про заботу. Домой {N} вернулась с полными карманами шишек и добрым сердцем.'},
  '🚀 Космос':  {t:'Космическое путешествие {N}', s:'{N} построила ракету из стульев и подушек. Три, два, один — полетели! На звёздочке она встретила маленького кометёнка, который заблудился. {N} помогла ему вернуться домой, и с той поры каждая падающая звезда махала ей крылышком.'},
  '🦁 Смелость':{t:'Как {N} победила страх', s:'У {N} был маленький страх, который прятался под кроватью и шуршал по ночам. «Давай познакомимся», — сказала {N}. Оказалось, страх боялся темноты ещё больше неё! {N} оставила ему ночник, и с тех пор они стали друзьями.'},
  '🌅 Мечта':   {t:'Звезда желаний {N}', s:'{N} загадала желание на первую звезду — и звезда прилетела послушать! «Чтобы исполнилось, — сказала она, — каждый день делай один маленький шажок ко мне». {N} делала шаг за шагом — и однажды поняла, что мечта уже рядом.'},
  '🌊 Море':    {t:'Морское приключение {N}', s:'{N} плыла на кораблике и слушала, как дышит море. На дне она нашла жемчужинку, которая умела светиться. «Я светлю тем, кто добрый», — сказала жемчужинка и поселилась в кармашке {N} — на счастье.'},
  '✨ Волшебство':{t:'Волшебная кисточка {N}', s:'{N} нашла кисточку, которая оживляла рисунки. Нарисованный котёнок мяукнул, а солнце — улыбнулось. Но самое лучшее получилось, когда {N} нарисовала улыбку для грустного друга — она ожила на его лице сама.'},
  '💛 Доброта': {t:'Тёплое сердце {N}', s:'{N} несла бабушке пирожки и встретила по дороге всех, кому нужна была помощь: щенка, воробья и грустного медвежонка. Каждый получил по кусочку доброты — а пирожков почему-то всё ещё хватило бабушке. Доброта, как выяснилось, не заканчивается.'},
  '👨‍👩‍👧 Семья':{t:'Выходной {N} с семьёй', s:'{N} весь день провела с мамой: пекла блины, поливала цветы и строила домик для плюшевого мишки. Вечером {N} обняла маму и сказала: «Люблю тебя больше, чем блины». А это, мама знает, самая большая любовь на свете.'},
  '🗺 Приключение':{t:'Большое приключение {N}', s:'{N} нашла старую карту с крестиком. За диваном — река из одеяла, в коридоре — горы из подушек, а в шкафу — сундук с сокровищами! В сундуке лежала записка: «Настоящее сокровище — тот, кто смело шёл весь путь». {N} довольно улыбнулась.'}
};
const EXTRA_EPISODES = [
  'По дороге {N} встретила улитку, которая несла на спине крошечный домик, и помогла ей найти дорогу.',
  'Вдруг подул тёплый ветер и принёс с собой запах мандаринов — так приключения напоминают о себе.',
  '{N} присела отдохнуть на мягкий мох и услышала, как под землёй копают свои тоннели трудолюбивые кроты.',
  'Радуга спустилась пониже, и {N} скатилась по ней, как с горки, тихонько смеясь.',
  'Вечером над лесом зажглись первые звёзды, и каждая спела {N} свою коротенькую колыбельную.'
];
function localTale(minutes, role, theme, N){
  const tpl = TALES[theme] || TALES['☁️ Дружба'];
  const base = tpl.s.replace(/\{N\}/g, N);
  const extraN = Math.min(5, Math.max(0, Math.round((minutes-5)/3)));
  let story = base;
  for(let i=0;i<extraN;i++) story += ' ' + EXTRA_EPISODES[i % EXTRA_EPISODES.length].replace(/\{N\}/g, N);
  return { title: tpl.t.replace(/\{N\}/g, N), story, moral: 'Доброта и помощь другим возвращаются радостью.', pause: '«А теперь давай нарисуем, что увиделось в сказке!»' };
}
async function makeTale(){
  const roleBox = document.querySelector('#tale-role');
  const themeBox = document.querySelector('#tale-theme');
  const role  = roleBox ? roleBox.querySelector('.chip.sel').textContent.trim() : '🧭 Путешественник';
  const theme = themeBox ? themeBox.querySelector('.chip.sel').textContent.trim() : '☁️ Дружба';
  const minutes = state.taleDur;
  const N = P.child;
  $('#t-go').disabled = true; $('#t-go').textContent = '✍️ Сочиняю…';
  let tale = null, aiOk = false;
  try{
    const r = await fetch('/api/ai/tale', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({child:N, minutes, role, theme, dx:P.dx, ints:P.ints.map(i=>SETS.ints.find(s=>s.v===i)?.l||i)})});
    const j = await r.json();
    if(j.ok && j.story){ tale = {title:j.title, story:j.story, moral:j.moral, pause:j.pause}; aiOk = true; }
  }catch(e){}
  if(window.speechSynthesis){ try{ speechSynthesis.cancel(); }catch(e){} }
  state.speaking = false;
  if(!tale) tale = localTale(minutes, role, theme, N);
  $('#tale-title').textContent = tale.title;
  $('#tale-meta').textContent = `${role} · ${theme} · ${minutes} мин`;
  const aiTag = document.querySelector('#tale-ai'); if(aiTag) aiTag.textContent = aiOk ? 'Создано ИИ' : 'Демо-режим';
  $('#tale-text').textContent = tale.story;
  $('#tale-moral').innerHTML = `<b>Мораль:</b> ${tale.moral||'доброта всегда возвращается.'}`;
  $('#tale-pause').innerHTML = `<b>Пауза для игры:</b> ${tale.pause||'«Давай нарисуем героев сказки!»'}`;
  $('#tale-for').textContent = `Сказка на ${minutes} минут создана специально для ${N} с учётом профиля ✨`;
  /* озвучка */
  state.taleAudio = []; state.taleAudioIdx = 0;
  if(state.taleAudioEl){ state.taleAudioEl.pause(); state.taleAudioEl = null; }
  clearInterval(state.taleTimer);
  $('#tale-audio-label').textContent = 'Озвучиваю сказку…';
  $('#tale-play-btn').textContent = '▶';
  $('#tale-player').classList.remove('playing');
  try{
    const tr = await fetch('/api/ai/tts', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text: tale.story})});
    const tj = await tr.json();
    if(tj.ok && tj.audio && tj.audio.length){
      state.taleAudio = tj.audio.map(b=>'data:audio/wav;base64,'+b);
      $('#tale-audio-label').textContent = aiOk ? 'Слушать сказку · озвучка ИИ' : 'Слушать сказку';
    }
  }catch(e){}
  if(!state.taleAudio.length)
    $('#tale-audio-label').textContent = ('speechSynthesis' in window) ? 'Слушать сказку · голос браузера' : 'Слушать сказку';
  $('#t-go').disabled = false; $('#t-go').textContent = '🎧 Сочинить и озвучить';
  go('s-tale');
}
function playTale(){
  const btn = $('#tale-play-btn');
  if(state.taleAudio.length){
    if(state.taleAudioEl && !state.taleAudioEl.paused){
      state.taleAudioEl.pause();
      btn.textContent = '▶';
      $('#tale-player').classList.remove('playing');
      clearInterval(state.taleTimer);
      return;
    }
    playTaleChunk(0);
    btn.textContent = '⏸';
    $('#tale-player').classList.add('playing');
  } else if(window.speechSynthesis){
    /* нет серверной озвучки — читаем голосом браузера (повторный тап = стоп) */
    if(state.speaking || speechSynthesis.speaking){ stopSpeech(); }
    else { speakTale(); btn.textContent = '⏸'; $('#tale-player').classList.add('playing'); }
  } else {
    /* совсем без синтеза речи — имитация */
    const p = $('#tale-player');
    const was = p.classList.contains('playing');
    if(was){ p.classList.remove('playing'); btn.textContent='▶'; clearInterval(state.taleTimer); }
    else { p.classList.add('playing'); btn.textContent='⏸'; }
  }
}
/* озвучка без сервера — голос браузера (для статической сборки) */
function ttsChunks(text){
  const parts = text.match(/[^.!?…]+[.!?…]*\s*/g) || [text];
  const out = []; let cur = '';
  parts.forEach(p=>{ if((cur+p).length > 180){ if(cur.trim()) out.push(cur.trim()); cur = p; } else cur += p; });
  if(cur.trim()) out.push(cur.trim());
  return out;
}
function stopSpeech(){
  state.speaking = false;
  if(window.speechSynthesis){ try{ speechSynthesis.cancel(); }catch(e){} }
  $('#tale-play-btn').textContent = '▶';
  $('#tale-player').classList.remove('playing');
}
function speakTale(){
  if(!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const parts = ttsChunks($('#tale-text').textContent || '');
  let i = 0; state.speaking = true;
  (function next(){
    if(!state.speaking || i >= parts.length){ stopSpeech(); return; }
    const u = new SpeechSynthesisUtterance(parts[i++]);
    u.lang = 'ru-RU'; u.rate = .95; u.pitch = 1.05;
    u.onend = next; u.onerror = next;
    speechSynthesis.speak(u);
  })();
}
function playTaleChunk(i){
  if(i >= state.taleAudio.length){ $('#tale-play-btn').textContent='▶'; $('#tale-player').classList.remove('playing'); return; }
  state.taleAudioIdx = i;
  const el = new Audio(state.taleAudio[i]);
  state.taleAudioEl = el;
  el.play().catch(()=>{});
  el.onended = ()=>{ const nxt = i+1; if(nxt < state.taleAudio.length) playTaleChunk(nxt); else { $('#tale-play-btn').textContent='▶'; $('#tale-player').classList.remove('playing'); } };
}

/* ---------- супер-герой ---------- */
function canvasBase(draw){
  const c = document.createElement('canvas'); c.width = 768; c.height = 768;
  const x = c.getContext('2d');
  const gr = x.createLinearGradient(0,0,768,768);
  gr.addColorStop(0,'#B8A8E8'); gr.addColorStop(.5,'#8FD9C4'); gr.addColorStop(1,'#FFD3A8');
  x.fillStyle = gr; x.fillRect(0,0,768,768);
  x.fillStyle = 'rgba(255,255,255,.25)';
  for(let i=0;i<14;i++){ x.beginPath(); x.arc(Math.random()*768, Math.random()*768, 14+Math.random()*40, 0, 7); x.fill(); }
  draw(x);
  return c.toDataURL('image/png');
}
function heroFallback(){
  return canvasBase(x=>{
    x.font = '420px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('🦸', 384, 400);
    x.font = 'bold 54px Manrope, sans-serif'; x.fillStyle = '#fff';
    x.fillText('Супер-' + P.child, 384, 700);
  });
}
function avatarFallback(dx){
  return canvasBase(x=>{
    x.font = '360px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('🦸', 384, 340);
    x.font = 'bold 44px Manrope, sans-serif'; x.fillStyle = '#fff';
    x.fillText(P.child, 384, 640);
    x.font = 'bold 30px Manrope, sans-serif';
    x.fillText((dx&&dx.length?dx.slice(0,2):['суперсилы']).join(' · '), 384, 700);
  });
}
function heroPowersList(){
  const list = P.dx.map(d=>POWERS[d]).filter(Boolean);
  if(!list.length) list.push('🌟 Умение играть и дружить');
  return list.slice(0,3);
}
async function makeHero(){
  go('s-hero-load');
  const frames = ['Надеваю плащ…','Подбираю суперсилы…','Рисую героя…','Готово! ✨'];
  const st = $('#hero-status');
  let i = 0; const iv = setInterval(()=>{ if(i<frames.length-1){ st.textContent = frames[i++]; } }, 900);
  let b64 = null;
  try{
    const r = await fetch('/api/ai/image', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({kind:'hero', child:P.child, dx:P.dx, ints:P.ints})});
    const j = await r.json();
    if(j.ok && j.b64) b64 = 'data:image/png;base64,'+j.b64;
  }catch(e){}
  if(!b64) b64 = heroFallback();
  clearInterval(iv); st.textContent = 'Готово! ✨';
  $('#hero-visual').innerHTML = `<img class="genimg" src="${b64}" alt="Супер-герой ${P.child}">`;
  $('#hero-name').textContent = 'Супер-' + P.child;
  $('#hero-powers').innerHTML = heroPowersList().map(p=>`<div class="hero-badge">${p}</div>`).join('');
  $('#hero-download').href = b64;
  $('#hero-avatar-btn').onclick = ()=>{ P.avatarImg = b64; P.avatarCls = 'av-lav'; toast('Супер-герой стал аватаркой 🎉'); go('s-profile'); };
  go('s-hero-done');
}

/* ---------- аватарка: особенности → картинка → скачать ---------- */
function renderAvChips(){
  const box = $('#av-dx-chips');
  const sel = (state.avDx && state.avDx.length) ? state.avDx : P.dx;
  state.avDx = sel.slice();
  box.innerHTML = DX_ALL.map(o=>
    `<button class="chip ${sel.includes(o.v)?'sel':''}" onclick="toggleAvDx('${o.v}')">${o.l}</button>`).join('');
  $('#avatar-name').textContent = P.childDat;
}
function toggleAvDx(v){
  const arr = state.avDx;
  const i = arr.indexOf(v);
  if(i>=0) arr.splice(i,1); else arr.push(v);
  const box = $('#av-dx-chips');
  box.innerHTML = DX_ALL.map(o=>
    `<button class="chip ${arr.includes(o.v)?'sel':''}" onclick="toggleAvDx('${o.v}')">${o.l}</button>`).join('');
}
async function makeAvatar(){
  const dx = state.avDx.slice();
  const btn = $('#av-go');
  btn.disabled = true; btn.textContent = '🎨 Рисую аватарку…';
  let b64 = null;
  try{
    const r = await fetch('/api/ai/image', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({kind:'avatar', child:P.child, dx, ints:P.ints})});
    const j = await r.json();
    if(j.ok && j.b64) b64 = 'data:image/png;base64,'+j.b64;
  }catch(e){}
  if(!b64) b64 = avatarFallback(dx);
  $('#av-img').src = b64;
  $('#av-download').href = b64;
  $('#av-result').style.display = 'block';
  $('#av-apply').onclick = ()=>{ P.avatarImg = b64; P.avatarCls = 'av-lav'; toast('Аватарка применена 🎉'); go('s-profile'); };
  btn.disabled = false; btn.textContent = '✨ Сгенерировать аватарку';
}

/* ---------- чат с ИИ (LLM + локальный фолбэк) ---------- */
const ITEM_PATTERNS = [
  [/круп|греч|рис(унок)?[а-я]*\b|фасол|горох|макарон|манка|песок/i,'grain','крупа'],
  [/мяч/i,'ball','мяч'],
  [/кубик|блок|лего|конструктор/i,'blocks','кубики'],
  [/бумаг|картон|оригами/i,'paper','бумага'],
  [/пластилин|тесто|глина/i,'clay','пластилин'],
  [/прищепк/i,'pins','прищепки'],
  [/пуговиц|бусин/i,'buttons','пуговицы'],
  [/пузыр/i,'bubbles','мыльные пузыри'],
  [/книг|журнал/i,'books','книги'],
  [/краск|карандаш|флома/i,'paints','краски'],
  [/\bвод|таз|ванн/i,'water','вода'],
  [/подушк|плед|одеял/i,'pillows','подушки'],
  [/коробк|контейнер|бутылк|трубоч|чашк|стакан/i,'box','коробки и ёмкости'],
  [/ложк|вилк|тарелк|посуд/i,'spoons','посуда'],
  [/музык|бубен|барабан|погремушк|колокольч/i,'music','музыкальные инструменты'],
  [/лент|шнур|скакалк|верёвк|канат|ткан|нос(ок|ки)|платок|варежк/i,'socks','ленты и ткани'],
  [/игрушк|кукл|мишк|зайк|машинк|робот|фигурк/i,'toys','игрушки']
];
function parseItems(q){
  const found = [];
  ITEM_PATTERNS.forEach(p=>{
    if(p[0].test(q) && !found.some(f=>f.code===p[1])) found.push({code:p[1], label:p[2]});
  });
  return found;
}
function makeItemsGame(items){
  const codes = items.map(i=>i.code);
  const L = items.map(i=>i.label);
  const nameStr = L.slice(0,3).join(', ');
  let title, cat, goal, steps;
  if(codes.includes('ball') || codes.includes('pillows') || codes.includes('socks')){
    title = 'Полоса препятствий из ' + nameStr; cat = 'motor';
    goal = 'Активная игра из ваших вещей: сброс энергии и крупная моторика';
    steps = [
      'Разложите ' + L.join(', ') + ' по полу — это «станции» препятствий.',
      'Прыгайте между подушками, прокатывайте ' + (codes.includes('ball')?'мяч вокруг':'предметы мимо') + ' станций.',
      'Финиш: добежать до «дома» и громко хлопнуть: «Я сделал!»',
      '💡 Если трудно — проходите станции за руку, хвалите за каждую попытку.'
    ];
  } else if(codes.includes('grain') || codes.includes('box') || codes.includes('toys') || codes.includes('buttons') || codes.includes('pins')){
    title = 'Прятки в ' + (codes.includes('grain')?'крупе':'коробочке'); cat = 'sensor';
    goal = 'Игра из ваших вещей: тактильное исследование и внимание';
    steps = [
      'Насыпьте ' + (codes.includes('grain')?'крупу':'наполнитель') + ' в ' + (codes.includes('box')?'коробку':'миску') + ' и спрячьте внутри мелкие предметы: ' + (codes.includes('toys')?'игрушки':(codes.includes('buttons')?'пуговицы':'крупные бусины')) + '.',
      'Ребёнок ищет спрятанные предметы рукой или ложкой: «Что там спряталось?»',
      'Найденное раскладываем по стаканчикам и считаем: один, два, три!',
      '💡 Если текстура пугает — ищите сначала ложкой, не опуская руку.'
    ];
  } else if(codes.includes('paper') || codes.includes('clay') || codes.includes('paints')){
    title = 'Мастерская из ' + nameStr; cat = 'creative';
    goal = 'Творческая игра из ваших вещей: воображение и мелкая моторика';
    steps = [
      'Подготовьте рабочее место: ' + L.join(', ') + '.',
      'Смастерите вместе поделку для любимой игрушки: домик, угощение или лодочку из бумаги.',
      'Разыграйте сценку: игрушка «благодарит» за подарок и хвалит мастера.',
      '💡 Делайте по образцу «рука в руке», если ребёнку сложно начать.'
    ];
  } else if(codes.includes('bubbles') || codes.includes('water') || codes.includes('spoons')){
    title = 'Водная лаборатория'; cat = 'sensor';
    goal = 'Игра из ваших вещей: вода, выдох и спокойное исследование';
    steps = [
      'Наберите таз воды, приготовьте ' + L.join(', ') + '.',
      'Переливайте воду ложками, дуйте на воду и пускайте пузыри: «Буль-буль!»',
      'Тонет или плавает? Проверьте каждый предмет и назовите вслух.',
      '💡 Завершите игру тёплым полотенцем и спокойным выдохом.'
    ];
  } else {
    title = 'Игра из ' + nameStr; cat = 'cog';
    goal = 'Игра из ваших вещей: внимание, память и фантазия';
    steps = [
      'Разложите на столе: ' + L.join(', ') + '. Пусть ребёнок всё рассмотрит.',
      '«Что пропало?» — ребёнок закрывает глаза, вы убираете один предмет.',
      'Вариант: «Что изменилось?» — поменяйте два предмета местами.',
      '💡 Начинайте с 3 предметов и добавляйте по одному.'
    ];
  }
  return {
    id:'ai-'+Date.now(), t:title, e:'🎲', cat:cat, age:[Math.max(1,P.age-1), Math.min(12,P.age+4)], mins:8, src:'ai',
    goal:goal, mats:codes.filter(c=>SETS.mats.some(m=>m.v===c)), need:L, ints:[],
    sk: cat==='motor'?{mot:3,sen:1,att:1}:(cat==='sensor'?{sen:3,mot:1,att:1}:(cat==='creative'?{cre:3,mot:2}:{cog:3,att:2})),
    dxs:ALLDX.slice(), music:'none', steps:steps.slice(0,4)
  };
}
function addMsg(text, who){
  const box = $('#chat-box');
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.innerHTML = text;
  box.appendChild(div);
  const sc = $('#s-chat'); sc.scrollTop = sc.scrollHeight;
  div.scrollIntoView({block:'end'});
}
function gameMsgHtml(g){
  return `Придумала игру из ваших вещей 🎲
    <div class="mini"><b>${g.e} ${g.t}</b>${g.steps.map((s,i)=>`${i+1}. ${s}`).join('<br>')}</div>
    <button class="mbtn" onclick="openGame('${g.id}','s-chat')">📋 Открыть карточку игры</button>`;
}
function parseGameReply(text, items){
  const grab = (k)=>{ const m = text.match(new RegExp(k+':\\s*([\\s\\S]*?)(?=\\n[A-ZА-ЯЁ]{3,}:|$)')); return m?m[1].trim():''; };
  const title = grab('НАЗВАНИЕ');
  const stepsRaw = grab('ШАГИ');
  if(!title || !stepsRaw) return null;
  const steps = stepsRaw.split(/\s*;\s*|\n/).map(s=>s.replace(/^[-•\d.\s]+/,'').trim()).filter(Boolean).slice(0,5);
  const goal = grab('ЦЕЛЬ') || 'Игра из ваших вещей';
  const sovet = grab('СОВЕТ');
  if(sovet) steps.push('💡 ' + sovet);
  const codes = items.map(i=>i.code);
  const cat = /мотор|прыг|бег|полос|препят/i.test(goal+title) ? 'motor' : (/сенсор|круп|вод|тактил/i.test(goal) ? 'sensor' : (/творч|рис|лепк|мастер/i.test(goal) ? 'creative' : 'cog'));
  return {
    id:'ai-'+Date.now(), t:title, e:'🎲', cat, age:[Math.max(1,P.age-1), Math.min(12,P.age+4)], mins:8, src:'ai',
    goal, mats:codes.filter(c=>SETS.mats.some(m=>m.v===c)), need:items.map(i=>i.label), ints:[],
    sk: cat==='motor'?{mot:3,sen:1,att:1}:(cat==='sensor'?{sen:3,mot:1,att:1}:(cat==='creative'?{cre:3,mot:2}:{cog:3,att:2})),
    dxs:ALLDX.slice(), music:'none', steps
  };
}
function botReply(qraw){
  const q = qraw.toLowerCase();
  const top = ranked();
  if(/привет|здравств|добрый (день|вечер|утро)/.test(q))
    return `Здравствуйте! Напишите, какие вещи есть у вас дома — придумаю игру из них 🎲 Или спросите, чем заняться для ${P.childDat}.`;
  if(/спасибо|благодар/.test(q))
    return 'Всегда рада помочь! Если игра «не пойдёт» — напишите, я подскажу, как её упростить 🤍';
  const items = parseItems(q);
  if(items.length && (items.length>=2 || /есть|под рук|придума|дом|игру из|сдела/.test(q))){
    const g = makeItemsGame(items);
    GAMES.unshift(g);
    state.lib.limit = Math.min(state.lib.limit + 1, 60);
    $('#db-badge').textContent = `🗂 База: ${GAMES.length} игр`;
    const wc = $('#welcome-count'); if(wc) wc.textContent = GAMES.length;
    renderLib(); renderHome();
    return gameMsgHtml(g);
  }
  if(/не пошл|не получ|трудно|трудн|каприз|отказ|не хочет/.test(q)){
    const easy = top.filter(g=>g.mins<=P.time).sort((a,b)=>a.mins-b.mins)[0] || top[0];
    return `Бывает! Не настаивайте, смените деятельность и вернитесь к игре позже. Могу предложить спокойную короткую игру: <b>${easy.t}</b> — ${score(easy)}% подходит, ${ageLabel(easy.age)}, всего ${easy.mins} мин. Открыть: вкладка «Игры».`;
  }
  if(/сказк/.test(q))
    return 'А ещё можно сочинить аудио-сказку, где ' + P.child + ' — главный герой: вкладка «Творчество» в нижнем меню 📖';
  if(/подписк|цена|сколько стоит|платн/.test(q))
    return 'Подписка PRO — 400 ₽/мес, первые 7 дней бесплатно. Бесплатно доступны 20 игр и базовый дневник 💎';
  if(/глаз|зрен|устал|отдых/.test(q)){
    const rel = top.filter(g=>g.cat==='relax');
    if(rel.length) return `Для отдыха глаз и расслабления есть спокойные упражнения: <b>${rel[0].t}</b> — ${rel[0].goal.toLowerCase()}. Найдёте в категории «Релаксация».`;
  }
  if(/чем заняться|сейчас|подобра|что делать|играть|игру/.test(q)){
    const g = top[0];
    return `Прямо сейчас лучше всего: <b>${g.t}</b> — ${score(g)}% соответствия, ${ageLabel(g.age)}. ${g.goal}. Понадобится: ${needStr(g)}. Карточка игры — во вкладке «Игры», она первая в списке ✨`;
  }
  const byTitle = GAMES.find(g=>q.includes(g.t.toLowerCase().slice(0,8)));
  if(byTitle)
    return `<b>${byTitle.t}</b> (${ageLabel(byTitle.age)}): ${byTitle.goal}. Понадобится: ${needStr(byTitle)}. ${byTitle.mins} мин · ${CATS[byTitle.cat]} · ${score(byTitle)}% подходит.`;
  return `Я подобрала по профилю ${P.childDat}: <b>${top[0].t}</b> (${score(top[0])}%, ${ageLabel(top[0].age)}) и <b>${top[1].t}</b> (${score(top[1])}%, ${ageLabel(top[1].age)}). А если напишете, какие вещи есть дома — придумаю игру прямо из них 😊`;
}
async function sendChat(text){
  const q = (text||'').trim();
  if(!q) return;
  addMsg(q.replace(/</g,'&lt;'), 'me');
  $('#chat-in').value = '';
  addMsg('<span class="typing"><span></span><span></span><span></span></span>', 'bot');
  let reply = null;
  try{
    const r = await fetch('/api/ai/chat', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({message:q, child:P.child, age:P.age, dx:P.dx})});
    const j = await r.json();
    if(j.ok && j.text){
      const items = parseItems(q);
      const g = items.length ? parseGameReply(j.text, items) : null;
      if(g){
        GAMES.unshift(g);
        state.lib.limit = Math.min(state.lib.limit + 1, 60);
        $('#db-badge').textContent = `🗂 База: ${GAMES.length} игр`;
        renderLib(); renderHome();
        reply = gameMsgHtml(g);
      } else {
        reply = j.text.replace(/\n/g,'<br>');
      }
    }
  }catch(e){}
  setTimeout(()=>{
    $$('#chat-box .msg').forEach(m=>{ if(m.querySelector('.typing')) m.remove(); });
    addMsg(reply || botReply(q), 'bot');
  }, 400);
}

/* ---------- быстрый старт ---------- */
function quickPick(){
  const prefs = {calm:['sensor','relax','creative'], active:['motor','social','cog'], tired:['relax','sensor'], cranky:['sensor','relax','motor']}[state.mood] || [];
  const moodScore = g => score(g) + (prefs.includes(g.cat) ? 15 : 0) + (g.mins<=P.time ? 5 : 0);
  const best = suitableList().slice().sort((a,b)=>moodScore(b)-moodScore(a))[0];
  go('s-aiload');
  const st = $('#ai-status');
  const frames = ['Анализирую профиль…','Проверяю подходящие игры…','Считаю % соответствия…','Готово! ✨'];
  let i = 0;
  (function f(){
    if(i < frames.length){ st.textContent = frames[i++]; setTimeout(f, 620); }
    else openGame(best.id, 's-home');
  })();
}

/* ---------- анкета / пресеты ---------- */
function applyPreset(key){
  if(key==='mia'){
    Object.assign(P, {child:'Мия', childDat:'Мие', parent:'Анна', avatar:'👧', avatarImg:null, avatarCls:'av-lav', age:3, time:10,
      dx:['РАС'], trig:['loud','switch'], ints:['animals','music'],
      mats:['grain','ball','blocks','paper','clay'],
      skills:{mot:2, sen:2, spe:1, cog:2, soc:1, att:2, cre:3}});
    toast('Профиль Мии (РАС, 3 года) применён');
  } else {
    Object.assign(P, {child:'Тимофей', childDat:'Тимофею', parent:'Анна', avatar:'🧒', avatarImg:null, avatarCls:'av-mint', age:6, time:15,
      dx:['СДВГ'], trig:['loud','switch'], ints:['cars','blocks','ball'],
      mats:['ball','blocks','pillows','box','paper'],
      skills:{mot:3, sen:3, spe:3, cog:2, soc:2, att:1, cre:4}});
    toast('Профиль Тимофея (СДВГ, 6 лет) применён');
  }
  renderChild(); renderCabinet(); renderHome(); renderLib(); updateNames();
  if(state.current) openGame(state.current.id, state.from);
}
function obDone(){
  const n = $('#name-input').value.trim();
  if(n){ P.child = n; P.childDat = dative(n); }
  renderChild(); renderCabinet(); updateNames();
  go('s-home');
  toast('Профиль сохранён — подбор построен ✨');
}

/* ---------- init ---------- */
(function init(){
  $('#db-badge').textContent = `🗂 База: ${GAMES.length} игр`;
  const ac = document.getElementById('aside-count'); if(ac) ac.textContent = GAMES.length;
  $('#welcome-count').textContent = GAMES.length;
  $('#name-input').value = P.child;
  $('#avatar-name').textContent = P.childDat;
  $('#tales-name').textContent = P.childDat;
  $('#suit-name').textContent = P.childDat;
  $('#q-yes').addEventListener('click', ()=>{ P.special = true; go('s-ob1'); });
  $('#ob-done').addEventListener('click', obDone);
  $('#q-next2').addEventListener('click', quickPick);
  $('#fin-btn').addEventListener('click', showFeedback);
  $('#chat-send').addEventListener('click', ()=>sendChat($('#chat-in').value));
  $('#chat-in').addEventListener('keydown', e=>{ if(e.key==='Enter') sendChat($('#chat-in').value); });
  $('#t-go').addEventListener('click', makeTale);
  $('#tale-play-btn').addEventListener('click', playTale);
  $('#hero-btn').addEventListener('click', makeHero);
  $('#hero-again').addEventListener('click', makeHero);
  $('#av-go').addEventListener('click', makeAvatar);
  $('#av-again').addEventListener('click', makeAvatar);
  $('#age-slider').addEventListener('input', e=>{
    P.age = +e.target.value;
    $('#age-val').textContent = ageWord(P.age);
    $('#child-sub').textContent = ageWord(P.age) + (P.dx.length ? ' · ' + P.dx.join(', ') : ' · особенности не выбраны');
    renderHome(); renderLib();
  });
  $('#time-chips').addEventListener('click', e=>{
    const c = e.target.closest('.chip'); if(!c) return;
    P.time = +c.getAttribute('data-v');
    renderHome(); renderLib();
  });
  renderChild(); renderCabinet(); renderLib(); renderHome(); renderDiary(); renderReport(); renderMy();
  go('s-welcome');
})();
