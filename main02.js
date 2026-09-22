(() => {
  'use strict';
  const key = 'sorteo_equipos:participantes';
  const input = document.getElementById('participantsInput');
  const count = document.getElementById('participantsCount');
  const select = document.getElementById('divideSelect');
  const title = document.getElementById('titleInput');
  const message = document.getElementById('message');
  const modeEquipos = document.getElementById('modeEquipos');
  const modeParticipantes = document.getElementById('modeParticipantes');
  const names = () => input.value.split('\n').map((name) => name.trim()).filter(Boolean);

  function refresh() {
    input.value = input.value.split('\n').slice(0, 100).map((name) => name.slice(0, 50)).join('\n');
    const total = names().length;
    count.textContent = total;
    select.innerHTML = '';
    const max = Math.max(2, Math.min(total || 2, 20));
    for (let value = modeEquipos.checked ? 2 : 1; value <= max; value += 1) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = modeEquipos.checked
        ? `${value} equipos`
        : `${value} participante${value > 1 ? 's' : ''} por equipo`;
      select.appendChild(option);
    }
    localStorage.setItem(key, input.value);
  }

  input.value = localStorage.getItem(key) || '';
  input.addEventListener('input', refresh);
  modeEquipos.addEventListener('change', refresh);
  modeParticipantes.addEventListener('change', refresh);
  document.getElementById('generateBtn').addEventListener('click', () => {
    if (names().length < 2) {
      message.textContent = 'Ingresa al menos 2 participantes.';
      return;
    }
    const criterion = modeEquipos.checked ? `${select.value} equipos` : `${select.value} participantes por equipo`;
    message.textContent = `Configurado: ${title.value.trim() || 'Resultado del sorteo'} | ${criterion}`;
  });
  refresh();
})();
