(() => {
  'use strict';

  /* Constantes */
  const STORAGE_KEY = 'sorteo_equipos:participantes';
  const MAX_PARTICIPANTS = 100;
  const MAX_CHARS_PER_NAME = 50;
  const DEFAULT_TITLE = 'Resultado del sorteo';

  /* Referencias DOM */
  const $ = (id) => document.getElementById(id);

  const configScreen = $('configScreen');
  const resultsScreen = $('resultsScreen');

  const participantsInput = $('participantsInput');
  const participantsCount = $('participantsCount');
  const participantsError = $('participantsError');

  const modeEquipos = $('modeEquipos');
  const modeParticipantes = $('modeParticipantes');
  const divideSelect = $('divideSelect');
  const titleInput = $('titleInput');

  const clearBtn = $('clearBtn');
  const generateBtn = $('generateBtn');
  const backBtn = $('backBtn');

  const resultsTitle = $('resultsTitle');
  const teamsContainer = $('teamsContainer');

  const downloadBtn = $('downloadBtn');
  const copyImageBtn = $('copyImageBtn');
  const copyColumnsBtn = $('copyColumnsBtn');
  const copyFeedback = $('copyFeedback');

  const renderCanvas = $('renderCanvas');

  let lastTeams = [];
  let lastTitle = DEFAULT_TITLE;

  function getRawLines() {
    return participantsInput.value.split('\n');
  }

  function getParticipantNames() {
    return getRawLines()
      .map(l => l.trim())
      .filter(l => l.length > 0);
  }

  function loadParticipants() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) participantsInput.value = saved;
    updateParticipantsUI();
  }

  function saveParticipants() {
    try {
      localStorage.setItem(STORAGE_KEY, participantsInput.value);
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }

  function enforceInputLimits() {
    let lines = getRawLines();

    // Máximo 50 caracteres por participante
    lines = lines.map(l => l.length > MAX_CHARS_PER_NAME ? l.slice(0, MAX_CHARS_PER_NAME) : l);

    // Máximo 100 participantes
    let trimmedNote = false;
    if (lines.length > MAX_PARTICIPANTS) {
      lines = lines.slice(0, MAX_PARTICIPANTS);
      trimmedNote = true;
    }

    const rebuilt = lines.join('\n');
    if (rebuilt !== participantsInput.value) {
      const pos = participantsInput.selectionStart;
      participantsInput.value = rebuilt;
      participantsInput.selectionStart = participantsInput.selectionEnd = Math.min(pos, rebuilt.length);
    }

    return trimmedNote;
  }

  function updateParticipantsUI() {
    const trimmedNote = enforceInputLimits();
    const names = getParticipantNames();
    const lineCount = getRawLines().filter(l => l.trim().length > 0).length;

    participantsCount.textContent = String(lineCount);
    participantsCount.classList.toggle('counter-warn', lineCount >= MAX_PARTICIPANTS);

    if (trimmedNote) {
      participantsError.textContent = `Se alcanzó el máximo de ${MAX_PARTICIPANTS} participantes.`;
    } else if (names.some(n => n.length >= MAX_CHARS_PER_NAME)) {
      participantsError.textContent = `Cada participante admite hasta ${MAX_CHARS_PER_NAME} caracteres.`;
    } else {
      participantsError.textContent = '';
    }
  }

  participantsInput.addEventListener('input', () => {
    updateParticipantsUI();
    saveParticipants();
  });

  clearBtn.addEventListener('click', () => {
    participantsInput.value = '';
    updateParticipantsUI();
    saveParticipants();
    participantsInput.focus();
  });

  function currentMode() {
    return modeEquipos.checked ? 'equipos' : 'participantes';
  }

  function populateSelect() {
    const mode = currentMode();
    const names = getParticipantNames();
    const total = Math.max(names.length, 2);

    divideSelect.innerHTML = '';

    if (mode === 'equipos') {
      const max = Math.max(2, Math.min(total, 20));
      for (let i = 2; i <= max; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = `${i} equipos`;
        divideSelect.appendChild(opt);
      }
    } else {
      const max = Math.max(2, Math.min(total, 20));
      for (let i = 1; i <= max; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = `${i} participante${i > 1 ? 's' : ''} por equipo`;
        divideSelect.appendChild(opt);
      }
    }
  }

  modeEquipos.addEventListener('change', populateSelect);
  modeParticipantes.addEventListener('change', populateSelect);
  participantsInput.addEventListener('input', populateSelect);

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function parseParticipant(raw) {
    const isLeader = raw.startsWith('*');
    const name = isLeader ? raw.slice(1).trim() : raw;
    return { name: name || raw, isLeader };
  }

  function buildTeams(names, mode, selectValue) {
    const parsed = shuffle(names.map(parseParticipant));
    const leaders = parsed.filter(p => p.isLeader);
    const rest = shuffle(parsed.filter(p => !p.isLeader));

    let teamCount;
    if (mode === 'equipos') {
      teamCount = Math.max(1, Math.min(selectValue, parsed.length));
    } else {
      const perTeam = Math.max(1, selectValue);
      teamCount = Math.max(1, Math.ceil(parsed.length / perTeam));
    }

    const teams = Array.from({ length: teamCount }, () => []);

    const shuffledLeaders = shuffle(leaders);
    shuffledLeaders.forEach((leader, idx) => {
      teams[idx % teamCount].push(leader);
    });

    const leaderOverflow = shuffledLeaders.slice(teamCount);
    const pool = shuffle(rest.concat(leaderOverflow));

    let t = 0;
    pool.forEach((p) => {
      let target = 0;
      for (let i = 1; i < teamCount; i++) {
        if (teams[i].length < teams[target].length) target = i;
      }
      teams[target].push(p);
      t++;
    });

    return teams;
  }

  function validateBeforeGenerate(names) {
    if (names.length < 2) {
      return 'Ingresa al menos 2 participantes para sortear.';
    }
    const mode = currentMode();
    const value = parseInt(divideSelect.value, 10);
    if (!value) return 'Selecciona una opción válida de división.';
    if (mode === 'equipos' && value > names.length) {
      return 'La cantidad de equipos no puede superar la cantidad de participantes.';
    }
    return '';
  }

  function renderTeams(teams, title) {
    resultsTitle.textContent = title || DEFAULT_TITLE;
    teamsContainer.innerHTML = '';

    teams.forEach((team, idx) => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.style.animationDelay = `${idx * 90}ms`;

      const h3 = document.createElement('h3');
      h3.textContent = `Equipo ${idx + 1}`;
      const sub = document.createElement('p');
      sub.className = 'team-sub';
      sub.textContent = `${team.length} integrante${team.length !== 1 ? 's' : ''}`;

      const ul = document.createElement('ul');
      ul.className = 'team-members';

      card.appendChild(h3);
      card.appendChild(sub);
      card.appendChild(ul);
      teamsContainer.appendChild(card);
      team.forEach((member, mIdx) => {
        const li = document.createElement('li');
        li.style.animationDelay = `${idx * 90 + mIdx * 180}ms`;
        if (member.isLeader) {
          const badge = document.createElement('span');
          badge.className = 'leader-badge';
          badge.textContent = '★';
          li.appendChild(badge);
        }
        const span = document.createElement('span');
        span.textContent = member.name;
        li.appendChild(span);
        ul.appendChild(li);
      });
    });
  }

  function goToResults() {
    configScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToConfig() {
    resultsScreen.classList.add('hidden');
    configScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  generateBtn.addEventListener('click', () => {
    const names = getParticipantNames();
    const errorMsg = validateBeforeGenerate(names);
    if (errorMsg) {
      participantsError.textContent = errorMsg;
      return;
    }
    participantsError.textContent = '';

    const mode = currentMode();
    const value = parseInt(divideSelect.value, 10);
    const title = titleInput.value.trim() || DEFAULT_TITLE;

    lastTeams = buildTeams(names, mode, value);
    lastTitle = title;

    renderTeams(lastTeams, title);
    goToResults();
    copyFeedback.textContent = '';
  });

  backBtn.addEventListener('click', goToConfig);

  function drawResultsToCanvas() {
    const ctx = renderCanvas.getContext('2d');
    const scale = 2; // nitidez (retina)

    const padding = 40;
    const cols = Math.min(3, Math.max(1, lastTeams.length));
    const colWidth = 300;
    const rowGap = 24;
    const headerHeight = 90;
    const teamHeaderHeight = 56;
    const memberHeight = 36;
    const teamPadding = 20;

    const rows = Math.ceil(lastTeams.length / cols);
    const teamHeights = lastTeams.map(t => teamHeaderHeight + t.length * memberHeight + teamPadding * 2);
    let totalHeight = headerHeight + padding;
    for (let r = 0; r < rows; r++) {
      const rowTeams = teamHeights.slice(r * cols, r * cols + cols);
      totalHeight += Math.max(...rowTeams, 0) + rowGap;
    }
    totalHeight += padding;

    const width = padding * 2 + cols * colWidth + (cols - 1) * rowGap;

    renderCanvas.width = width * scale;
    renderCanvas.height = totalHeight * scale;
    ctx.scale(scale, scale);

    // fondo
    const grad = ctx.createLinearGradient(0, 0, width, totalHeight);
    grad.addColorStop(0, '#fdf2f8');
    grad.addColorStop(1, '#f4f1fa');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, totalHeight);

    ctx.fillStyle = '#201c2b';
    ctx.font = '700 26px Outfit, Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(lastTitle, padding, padding * 0.6);

    ctx.fillStyle = '#756e85';
    ctx.font = '400 14px Inter, sans-serif';
    ctx.fillText(`${lastTeams.length} equipos · generado con Sorteo de Equipos`, padding, padding * 0.6 + 34);

    let y = headerHeight + padding;
    for (let r = 0; r < rows; r++) {
      let x = padding;
      const rowTeams = lastTeams.slice(r * cols, r * cols + cols);
      const rowHeights = teamHeights.slice(r * cols, r * cols + cols);
      const rowMaxHeight = Math.max(...rowHeights);

      rowTeams.forEach((team, i) => {
        const h = rowHeights[i];
        drawTeamBox(ctx, x, y, colWidth, h, r * cols + i, team);
        x += colWidth + rowGap;
      });

      y += rowMaxHeight + rowGap;
    }

    return { width, height: totalHeight };
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawTeamBox(ctx, x, y, w, h, idx, team) {
    ctx.save();
    ctx.shadowColor = 'rgba(122,13,74,0.18)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x, y, w, h, 16);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#e8e3f2';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, 16);
    ctx.stroke();

    ctx.fillStyle = '#7a0d4a';
    ctx.font = '700 17px Outfit, Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(`Equipo ${idx + 1}`, x + 20, y + 18);

    ctx.fillStyle = '#756e85';
    ctx.font = '400 12px Inter, sans-serif';
    ctx.fillText(`${team.length} integrante${team.length !== 1 ? 's' : ''}`, x + 20, y + 42);
    let my = y + 56 + 12;
    team.forEach((member) => {
      ctx.fillStyle = '#fdf2f8';
      roundRect(ctx, x + 16, my, w - 32, 28, 8);
      ctx.fill();

      ctx.fillStyle = '#201c2b';
      ctx.font = '500 13.5px Inter, sans-serif';
      const label = (member.isLeader ? '★ ' : '') + member.name;
      ctx.fillText(truncateToWidth(ctx, label, w - 32 - 20), x + 26, my + 7);

      my += 36;
    });
  }

  function truncateToWidth(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) {
      t = t.slice(0, -1);
    }
    return t + '…';
  }

  function showCopyFeedback(msg) {
    copyFeedback.textContent = msg;
    setTimeout(() => {
      if (copyFeedback.textContent === msg) copyFeedback.textContent = '';
    }, 3000);
  }

  downloadBtn.addEventListener('click', () => {
    if (!lastTeams.length) return;
    drawResultsToCanvas();
    renderCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = lastTitle.replace(/[^\w\-]+/g, '_').slice(0, 40) || 'equipos';
      a.download = `${safeTitle}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showCopyFeedback('Imagen descargada ✔');
    }, 'image/jpeg', 0.95);
  });

  copyImageBtn.addEventListener('click', async () => {
    if (!lastTeams.length) return;
    drawResultsToCanvas();
    renderCanvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          showCopyFeedback('Imagen copiada al portapapeles ✔');
        } else {
          throw new Error('Clipboard API no disponible');
        }
      } catch (e) {
        console.warn(e);
        showCopyFeedback('No se pudo copiar la imagen en este navegador.');
      }
    }, 'image/png');
  });

  copyColumnsBtn.addEventListener('click', async () => {
    if (!lastTeams.length) return;
    const maxRows = Math.max(...lastTeams.map(t => t.length));
    const header = lastTeams.map((_, i) => `Equipo ${i + 1}`).join('\t');
    const rows = [header];
    for (let r = 0; r < maxRows; r++) {
      const row = lastTeams.map(team => {
        const member = team[r];
        if (!member) return '';
        return (member.isLeader ? '*' : '') + member.name;
      }).join('\t');
      rows.push(row);
    }
    const text = rows.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showCopyFeedback('Equipos copiados en columnas ✔ (pégalos en una hoja de cálculo)');
    } catch (e) {
      console.warn(e);
      showCopyFeedback('No se pudo copiar el texto en este navegador.');
    }
  });

  function init() {
    loadParticipants();
    populateSelect();
  }

  init();
})();