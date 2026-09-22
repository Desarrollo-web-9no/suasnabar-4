const canvas = document.getElementById("ruleta");
const contexto = canvas.getContext("2d");

const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");

const textareaElementos = document.getElementById("elementos");
const listaElementos = document.getElementById("listaElementos");

const resultado = document.getElementById("resultado");
const mensajeRuleta = document.getElementById("mensajeRuleta");

const panelEdicion = document.getElementById("panelEdicion");

const titulo = document.getElementById("titulo");
const tituloPrincipal = document.getElementById("tituloPrincipal");
const btnEditarTitulo = document.getElementById("btnEditarTitulo");

let elementosOriginales = [];
let elementosDisponibles = [];

let girando = false;

let rotacionActual = 0;

const colores = ["#4267d5", "#f87670", "#8df28b", "#f6dda9", "#d997dc"];

function cargarDatos() {
  const datosGuardados = localStorage.getItem("elementosRuleta");

  if (datosGuardados) {
    try {
      elementosOriginales = JSON.parse(datosGuardados);
    } catch (error) {
      elementosOriginales = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ];
    }
  } else {
    elementosOriginales = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
  }

  elementosDisponibles = [...elementosOriginales];

  textareaElementos.value = elementosOriginales.join("\n");

  actualizarLista();

  dibujarRuleta();
}

function dibujarRuleta() {
  const ancho = canvas.width;
  const alto = canvas.height;

  const centroX = ancho / 2;
  const centroY = alto / 2;

  const radio = 245;

  contexto.clearRect(0, 0, ancho, alto);

  const cantidad = elementosDisponibles.length;

  if (cantidad === 0) {
    contexto.beginPath();

    contexto.arc(centroX, centroY, radio, 0, Math.PI * 2);

    contexto.fillStyle = "#dddddd";
    contexto.fill();

    contexto.strokeStyle = "#666";
    contexto.lineWidth = 2;
    contexto.stroke();

    contexto.fillStyle = "#333";

    contexto.font = "bold 22px Arial";

    contexto.textAlign = "center";
    contexto.textBaseline = "middle";

    contexto.fillText("Sin elementos", centroX, centroY);

    return;
  }

  const anguloSector = (Math.PI * 2) / cantidad;

  for (let i = 0; i < cantidad; i++) {
    const inicio = -Math.PI / 2 + i * anguloSector;

    const fin = inicio + anguloSector;

    contexto.beginPath();

    contexto.moveTo(centroX, centroY);

    contexto.arc(centroX, centroY, radio, inicio, fin);

    contexto.closePath();

    contexto.fillStyle = colores[i % 5];

    contexto.fill();

    contexto.strokeStyle = "#ffffff";

    contexto.lineWidth = 2;

    contexto.stroke();

    const anguloTexto = inicio + anguloSector / 2;

    const distanciaTexto = cantidad <= 8 ? 150 : 175;

    const textoX = centroX + Math.cos(anguloTexto) * distanciaTexto;

    const textoY = centroY + Math.sin(anguloTexto) * distanciaTexto;

    contexto.save();

    contexto.translate(textoX, textoY);

    contexto.rotate(anguloTexto + Math.PI / 2);

    contexto.fillStyle = "#111";

    contexto.font = cantidad > 20 ? "bold 14px Arial" : "bold 22px Arial";

    contexto.textAlign = "center";

    contexto.textBaseline = "middle";

    contexto.fillText(elementosDisponibles[i], 0, 0);

    contexto.restore();
  }

  contexto.beginPath();

  contexto.arc(centroX, centroY, radio, 0, Math.PI * 2);

  contexto.strokeStyle = "#555";
  contexto.lineWidth = 2;

  contexto.stroke();

  contexto.beginPath();

  contexto.arc(centroX, centroY, 20, 0, Math.PI * 2);

  contexto.fillStyle = "#ffffff";
  contexto.fill();

  contexto.strokeStyle = "#555";
  contexto.stroke();
}

function actualizarLista() {
  listaElementos.innerHTML = "";

  elementosDisponibles.forEach(function (elemento, indice) {
    const fila = document.createElement("div");

    fila.className = "elemento-lista";

    fila.textContent = `${indice + 1}. ${elemento}`;

    listaElementos.appendChild(fila);
  });
}

function actualizarDesdeTextarea() {
  const nuevosElementos = textareaElementos.value
    .split("\n")
    .map(function (elemento) {
      return elemento.trim();
    })
    .filter(function (elemento) {
      return elemento !== "";
    });

  elementosOriginales = [...nuevosElementos];

  elementosDisponibles = [...nuevosElementos];

  localStorage.setItem("elementosRuleta", JSON.stringify(elementosOriginales));

  rotacionActual = 0;

  canvas.style.transform = "rotate(0deg)";

  resultado.textContent = "-";

  mensajeRuleta.textContent = "haz clic para girarlo";

  dibujarRuleta();

  actualizarLista();
}

function normalizarAngulo(angulo) {
  let resultado = angulo % 360;

  if (resultado < 0) {
    resultado += 360;
  }

  return resultado;
}

function girarRuleta() {
  if (girando) {
    return;
  }

  if (elementosDisponibles.length === 0) {
    alert("No quedan elementos. Presiona Reiniciar.");

    return;
  }

  girando = true;

  mensajeRuleta.textContent = "Girando...";

  const cantidad = elementosDisponibles.length;

  const indiceSeleccionado = Math.floor(Math.random() * cantidad);

  const elementoSeleccionado = elementosDisponibles[indiceSeleccionado];

  const gradosPorSector = 360 / cantidad;

  const centroSector =
    -90 + indiceSeleccionado * gradosPorSector + gradosPorSector / 2;

  const posicionSector = normalizarAngulo(centroSector);

  const posicionActual = normalizarAngulo(rotacionActual);

  const rotacionObjetivo = normalizarAngulo(-posicionSector);

  let giroNecesario = rotacionObjetivo - posicionActual;

  if (giroNecesario < 0) {
    giroNecesario += 360;
  }

  if (giroNecesario < 1) {
    giroNecesario += 360;
  }

  const vueltasExtra = 5;

  const gradosExtra = vueltasExtra * 360;

  const nuevaRotacion = rotacionActual + gradosExtra + giroNecesario;

  rotacionActual = nuevaRotacion;

  canvas.style.transform = `rotate(${nuevaRotacion}deg)`;

  setTimeout(function () {
    resultado.textContent = elementoSeleccionado;

    mensajeRuleta.textContent = "Elemento seleccionado";

    const indiceEliminar = elementosDisponibles.indexOf(elementoSeleccionado);

    if (indiceEliminar !== -1) {
      elementosDisponibles.splice(indiceEliminar, 1);
    }

    dibujarRuleta();

    actualizarLista();

    girando = false;
  }, 4200);
}

function reiniciarRuleta() {
  if (girando) {
    return;
  }

  elementosDisponibles = [...elementosOriginales];

  rotacionActual = 0;

  canvas.style.transform = "rotate(0deg)";

  resultado.textContent = "-";

  mensajeRuleta.textContent = "haz clic para girarlo";

  dibujarRuleta();

  actualizarLista();
}

btnEditarTitulo.addEventListener("click", function () {
  const nuevoTitulo = titulo.value.trim();

  if (nuevoTitulo === "") {
    return;
  }

  tituloPrincipal.textContent = nuevoTitulo;

  localStorage.setItem("tituloRuleta", nuevoTitulo);
});

function cargarTitulo() {
  const tituloGuardado = localStorage.getItem("tituloRuleta");

  if (tituloGuardado) {
    titulo.value = tituloGuardado;

    tituloPrincipal.textContent = tituloGuardado;
  }
}

textareaElementos.addEventListener("input", function () {
  if (girando) {
    return;
  }

  actualizarDesdeTextarea();
});

btnIniciar.addEventListener("click", function () {
  girarRuleta();
});

btnReiniciar.addEventListener("click", function () {
  reiniciarRuleta();
});

document.addEventListener("keydown", function (evento) {
  const escribiendo =
    document.activeElement.tagName === "TEXTAREA" ||
    document.activeElement.tagName === "INPUT";

  if (evento.code === "Space" && !escribiendo) {
    evento.preventDefault();

    girarRuleta();

    return;
  }

  if (evento.key.toLowerCase() === "r" && !escribiendo) {
    reiniciarRuleta();

    return;
  }

  if (evento.key.toLowerCase() === "e" && !escribiendo) {
    panelEdicion.classList.toggle("oculto");

    return;
  }

  if (evento.key.toLowerCase() === "f" && !escribiendo) {
    activarPantallaCompleta();

    return;
  }
});

function activarPantallaCompleta() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function () {
      console.log("No se pudo activar pantalla completa.");
    });
  } else {
    document.exitFullscreen();
  }
}

cargarDatos();

cargarTitulo();
