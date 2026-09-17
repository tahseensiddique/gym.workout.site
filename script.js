const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(window.toast);window.toast=setTimeout(()=>t.classList.remove('show'),2400)};
let mode='stopwatch',seconds=0,running=false,interval;
const format=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
function render(){ $('#time').textContent=format(seconds);$('#timerStatus').textContent=mode==='rest'?(running?'RESTING':'REST TIMER'):(running?'IN PROGRESS':'READY WHEN YOU ARE');$('#timerStart').firstChild.textContent=running?'Pause timer ':'Start timer '; }
function stop(){clearInterval(interval);running=false;render()}
function start(){if(running)return; if(mode==='rest'&&!seconds)seconds=60;running=true;interval=setInterval(()=>{if(mode==='rest'){if(seconds<=0){stop();toast('Rest complete — next set!');return}seconds--}else seconds++;render()},1000);render()}
function reset(){stop();seconds=0;render()}
$('#timerStart').onclick=()=>running?stop():start();$('#timerReset').onclick=reset;$('#reset').onclick=reset;
$$('.timer-switch button').forEach(b=>b.onclick=()=>{stop();mode=b.dataset.mode;seconds=0;$$('.timer-switch button').forEach(x=>x.classList.toggle('selected',x===b));render()});
$$('.presets button').forEach(b=>b.onclick=()=>{mode='rest';seconds=+b.dataset.seconds;$$('.timer-switch button').forEach(x=>x.classList.toggle('selected',x.dataset.mode==='rest'));start()});
$('#begin').onclick=()=>{location.hash='workout';document.querySelector('.timer-card').scrollIntoView({behavior:'smooth',block:'center'});start();toast('Session started. Make it count!')};
$$('.complete').forEach(b=>b.onclick=()=>{b.classList.toggle('done');b.textContent=b.classList.contains('done')?'✓':'○';toast(b.classList.contains('done')?'Exercise completed!':'Exercise unchecked')});
const groups=['ALL MUSCLES','CHEST','BACK','SHOULDERS','ARMS'];let group=0;$('#filter').onclick=()=>{group=(group+1)%groups.length;$('#filter').textContent=groups[group]+'⌄';$$('.exercise-grid article').forEach(a=>a.style.display=group===0||a.dataset.group===groups[group]?'flex':'none')};
$('#log').onclick=()=>toast('Workout logged — consistency is strength.');$('#userButton').onclick=()=>toast('Profile settings coming soon.');$('#menu').onclick=()=>{$('nav').style.display=$('nav').style.display==='flex'?'none':'flex'};render();
