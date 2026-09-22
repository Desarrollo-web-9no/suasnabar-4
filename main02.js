(() => {
  'use strict';

  const STORAGE_KEY = 'sorteo_equipos:participantes';
  const MAX_PARTICIPANTS = 100;
  const MAX_CHARS_PER_NAME = 50;
  const input = document.getElementById('participantsInput');
  const count = document.getElementById('participantsCount');
  const error = document.getElementById('participantsError');
  const clearButton = document.getElementById('clearBtn');

  function limitInput() {
    let lines = input.value.split('\n').map((line) => line.slice(0, MAX_CHARS_PER_NAME));
    const exceeded = lines.length > MAX_PARTICIPANTS;
    input.value = lines.slice(0, MAX_PARTICIPANTS).join('\n');
    return exceeded;
  }

  function update() {
    const exceeded = limitInput();
    const total = input.value.split('\n').filter((line) => line.trim()).length;
    count.textContent = total;
    error.textContent = exceeded
      ? `Solo se permiten ${MAX_PARTICIPANTS} participantes.`
      : '';
    localStorage.setItem(STORAGE_KEY, input.value);
  }

  input.value = localStorage.getItem(STORAGE_KEY) || '';
  input.addEventListener('input', update);
  clearButton.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
  });
  update();
})();
