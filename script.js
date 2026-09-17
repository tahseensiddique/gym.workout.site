const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const toast = (message) => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600); };

// Mobile navigation
$('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$$('.nav-link').forEach(link => link.addEventListener('click', () => $('#sidebar').classList.remove('open')));

// Workout completion controls
$$('.check-button').forEach(button => button.addEventListener('click', () => {
  button.classList.toggle('done');
  const title = $('.exercise-details h3', button.closest('.routine-item')).textContent;
  toast(button.classList.contains('done') ? `${title} marked complete` : `${title} marked incomplete`);
}));

$('#startWorkout').addEventListener('click', () => { document.querySelector('#timer').scrollIntoView({ behavior: 'smooth', block: 'center' }); startTimer(); toast('Workout started — let’s get to work!'); });
$('#viewPlan').addEventListener('click', () => { document.querySelector('#exercises').scrollIntoView({ behavior: 'smooth' }); });
$('#logWorkout').addEventListener('click', () => toast('Workout logged! Your monthly goal is updated.'));
$('#profileButton').addEventListener('click', () => toast('Profile settings are coming soon.'));
$('#todayButton').addEventListener('click', () => toast('You are viewing today’s plan.'));

// Timer supports stopwatch and countdown rest modes.
let timerId = null, seconds = 0, mode = 'stopwatch', running = false;
const timerValue = $('#timerValue'), timerLabel = $('#timerLabel');
const formatTime = total => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
const renderTimer = () => { timerValue.textContent = formatTime(seconds); timerLabel.textContent = mode === 'rest' ? (running ? 'RESTING' : 'REST TIMER') : (running ? 'IN PROGRESS' : 'READY?'); };
const stopTimer = () => { clearInterval(timerId); timerId = null; running = false; renderTimer(); };
const tick = () => { if (mode === 'rest') { if (seconds <= 0) { stopTimer(); toast('Rest complete — next set!'); return; } seconds--; } else seconds++; renderTimer(); };
function startTimer() { if (running) return; if (mode === 'rest' && seconds === 0) seconds = 60; running = true; timerId = setInterval(tick, 1000); renderTimer(); }
const resetTimer = () => { stopTimer(); seconds = 0; renderTimer(); };
$('#timerStart').addEventListener('click', () => running ? stopTimer() : startTimer());
$('#timerReset').addEventListener('click', resetTimer); $('#timerReset2').addEventListener('click', resetTimer);
$$('.timer-tab').forEach(tab => tab.addEventListener('click', () => { stopTimer(); mode = tab.dataset.mode; seconds = 0; $$('.timer-tab').forEach(item => item.classList.toggle('active', item === tab)); renderTimer(); }));
$$('.quick-rests button').forEach(button => button.addEventListener('click', () => { mode = 'rest'; seconds = Number(button.dataset.seconds); $$('.timer-tab').forEach(item => item.classList.toggle('active', item.dataset.mode === 'rest')); startTimer(); }));

// Simple muscle group filter.
$('#filterButton').addEventListener('click', () => {
  const groups = ['All muscle groups', 'Chest', 'Back', 'Shoulders', 'Arms'];
  const current = $('#filterButton').dataset.group || groups[0];
  const next = groups[(groups.indexOf(current) + 1) % groups.length];
  $('#filterButton').dataset.group = next; $('#filterButton').firstChild.textContent = next + ' ';
  $$('.routine-item').forEach(item => item.style.display = next === groups[0] || item.dataset.muscle === next ? 'flex' : 'none');
});
renderTimer();
