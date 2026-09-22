# UNIVERSIDAD NACIONAL DEL CENTRO DEL PERÚ
## FACULTAD DE INGENIERÍA DE SISTEMAS
### DEPARTAMENTO ACADÉMICO DE INGENIERÍA DE SISTEMAS

---

# 🎓 Práctica Calificada 3 — Desarrollo de Aplicaciones Web

* **Asignatura:** Desarrollo de Aplicaciones Web  
* **Docente:** Mg. Jaime Suasnabar Terrel  
* **Semestre:** 2026-II  
* **Tecnologías:** HTML5 puro, CSS3 puro y JavaScript puro (**Vanilla JS — Sin librerías ni frameworks externos**)  
* **Repositorio:** [Desarrollo-web-9no/suasnabar-4](https://github.com/Desarrollo-web-9no/suasnabar-4)

---

## 👥 Integrantes del Equipo y Gestión de Ramas (Git Flow)

El desarrollo del proyecto se llevó a cabo de manera colaborativa utilizando control de versiones Git y GitHub, asignando a cada integrante una rama de desarrollo específica para sus respectivas funcionalidades antes de realizar la integración (*merge*) en la rama principal:

| Integrante | Correo Institucional / Git | Rama Asignada (*Branch*) | Responsabilidad / Módulo Desarrollado |
| :--- | :--- | :--- | :--- |
| **JOSE OSORIO MALLQUI** | `jososo1396@gmail.com` | `jose_osorio` | **Líder de Integración / Merge Master:** Coordinación del repositorio, configuración inicial, integración de Pull Requests y arquitectura de la solución. |
| **JUAN AARON CCENTE ROJAS** | `aronccente@gmail.com` | `ccente-rojas` | **Ejercicio 2 (Sorteo de Equipos - F1, F2):** Lista de participantes con límites (100 participantes, 50 caracteres), guardado en LocalStorage y predefinición del sorteo por desplegable. |
| **JESUS HUARICALLO JAIME** | `e_2021200787j@uncp.edu.pe` | `huaricallo-jaime` | **Ejercicio 1 (Ruleta Aleatoria - F1 a F9):** Desarrollo completo de la ruleta dinámica en Canvas con puntero rojo, atajos de teclado y sincronización con TextArea. |
| **ARLETTE SUAREZ ROMAN** | `e_2022200427L@uncp.edu.pe` | `arlette_suarez` | **Ejercicio 2 (Sorteo de Equipos - F3, F4):** Animación de revelado progresivo de equipos, tarjetas rectangulares y los 3 botones de exportación (JPG en Canvas, Portapapeles y Columnas). |

---

## 🏛️ Arquitectura y Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura modular y desacoplada, separando la estructura semántica, los estilos visuales y la lógica de negocio en módulos nativos:

```text
suasnabar-4/
│
├── index.html          # Módulo 1: Interfaz web del Aula Virtual y Ruleta Dinámica
├── script.js           # Lógica y controlador de la Ruleta (Canvas, animación, atajos de teclado)
├── style.css           # Estilos institucionales y diseño de la Ruleta y su panel de edición
│
├── page02.html         # Módulo 2: Interfaz web de la aplicación Sorteo de Equipos
├── main02.js           # Lógica y controlador del Sorteo (Fisher-Yates, animación, exportaciones)
├── style02.css         # Estilos visuales del formulario y las tarjetas de resultados de equipos
│
├── PracticaCalificada3.pdf # Documento de especificación del examen
└── README.md           # Documentación técnica del proyecto y gestión de ramas
```

---

## 🎯 Detalle de Requisitos y Funcionalidades Implementadas

### 1. Ruleta Dinámica de Selección — Aula Virtual (`index.html`)

Desarrollo de un aula virtual que incorpora una ruleta interactiva para seleccionar participantes de manera aleatoria.

* **(F1) Ruleta Dinámica y Puntero:** Ruleta renderizada en `<canvas>` subdividida en sectores proporcionales utilizando una paleta cíclica de 5 colores básicos (`#4267d5`, `#f87670`, `#8df28b`, `#f6dda9`, `#d997dc`). Dispone de un triángulo rojo indicador fijo apuntando al sector seleccionado.
* **(F2) Entrada de Datos desde TextArea:** La ruleta obtiene dinámicamente sus elementos a partir del contenido del control `<textarea>`.
* **(F3) Mecanismo de Giro y Respuesta:** Se activa mediante:
  * Clic directo sobre la ruleta o en el botón **Iniciar**.
  * Pulsación de la tecla <kbd>SPACE</kbd>.  
  Gira aleatoriamente con desaceleración progresiva y muestra con claridad el participante seleccionado en el contenedor **Resultado**.
* **(F4 y F5) Edición y Persistencia en LocalStorage:** Permite copiar y pegar listas multifila. Los cambios efectuados en el TextArea se guardan automáticamente en `localStorage` y se sincronizan en tiempo real con la ruleta.
* **(F6) Ocultamiento con Tecla <kbd>S</kbd>:** Al pulsar la tecla <kbd>S</kbd>, el último elemento sorteado se resalta en color gris en la lista visual y se excluye de la ruleta para no ingresar en los sorteos posteriores.
* **(F7) Modo Edición con Tecla <kbd>E</kbd>:** Al pulsar la tecla <kbd>E</kbd> o hacer clic sobre el TextArea se habilita inmediatamente el modo de edición de participantes.
* **(F8) Reinicio con Tecla <kbd>R</kbd>:** Al pulsar la tecla <kbd>R</kbd> o el botón **Reiniciar**, los elementos ocultos vuelven a estar activos y visibles en la ruleta, desapareciendo el resaltado gris.
* **(F9) Pantalla Completa con Tecla <kbd>F</kbd>:** Permite alternar la visualización a pantalla completa para presentaciones en proyector o videoconferencias.

#### Atajos de Teclado del Módulo Ruleta:
| Tecla | Acción |
| :---: | :--- |
| <kbd>SPACE</kbd> | Girar la ruleta aleatoriamente |
| <kbd>S</kbd> | Ocultar y tachar en gris el último elemento seleccionado |
| <kbd>R</kbd> | Reiniciar ruleta y restaurar elementos ocultos |
| <kbd>E</kbd> | Habilitar edición rápida en el TextArea |
| <kbd>F</kbd> | Activar / Desactivar pantalla completa |

---

### 2. Generador y Sorteo de Equipos Aleatorio (`page02.html`)

Aplicación para la conformación automatizada y equitativa de grupos de trabajo.

* **(F1) Control de Participantes y Persistencia:**
  * Soporta hasta **100 participantes** como máximo.
  * Valida y restringe cada nombre a un tamaño máximo de **50 caracteres**.
  * Contador dinámico de participantes en tiempo real.
  * Persistencia automática en `localStorage`.
  * Reconocimiento de líderes de grupo agregando un asterisco (`*Líder`), los cuales se distribuyen de manera equilibrada entre los diferentes equipos.
* **(F2) Predefinición del Sorteo:**
  * Selector mediante botones de opción (*radio buttons*): **Cantidad de equipos** o **Participantes por equipo**.
  * Menú desplegable (`<select>`) dinámico que recalcula las opciones disponibles según la cantidad de integrantes.
  * Campo para agregar un **título personalizado** para los equipos (ej. *"Copa del Mundo Qatar 2022"* o *"Equipos de Proyecto"*).
* **(F3) Segunda Pantalla y Revelado Progresivo:**
  * Al presionar el botón **Generar equipos**, la vista transiciona fluidamente a la pantalla de resultados.
  * Los equipos se agrupan en rectángulos (tarjetas) con un subtítulo que indica el número de equipo.
  * Los integrantes aparecen uno a uno mediante intervalos secuenciales con animación visual suave hasta completar la totalidad de los equipos.
* **(F4) Opciones de Exportación (3 Botones Inferiores):**
  1. **📥 Descargar en formato JPG:** Genera un archivo `.jpg` en alta resolución renderizando la vista completa de los equipos mediante HTML5 Canvas nativo (`canvas.toBlob` / `canvas.toDataURL`), sin requerir librerías externas como html2canvas.
  2. **📋 Copiar al Portapapeles:** Copia al portapapeles del sistema un reporte estructurado y formateado con los equipos y sus respectivos miembros.
  3. **📊 Copiar los equipos resultantes en cada columna:** Genera un formato tabular delimitado por tabulaciones (TSV) donde cada columna representa un equipo, listo para pegar directamente en celdas de **Microsoft Excel** o **Google Sheets**.

---

## 🚀 Puesta en Marcha y Ejecución Local

Dado que el proyecto está desarrollado con estándares web nativos sin dependencias externas, su ejecución es inmediata:

### 1. Clonar el repositorio:
```bash
git clone https://github.com/Desarrollo-web-9no/suasnabar-4.git
cd suasnabar-4
```

### 2. Ejecutar con cualquier servidor web local:

#### Opción A: Usando Python 3 (Recomendado)
```bash
python -m http.server 8000
```
Abrir en el navegador:
* Ruleta de Participación: `http://localhost:8000/index.html`
* Sorteo de Equipos: `http://localhost:8000/page02.html`

#### Opción B: Usando Node.js / npx
```bash
npx serve .
```

#### Opción C: Usando VS Code Live Server
* Abrir la carpeta del proyecto en VS Code.
* Clic derecho sobre `index.html` o `page02.html` y seleccionar **"Open with Live Server"**.

---

## 🌿 Historial de Ramas y Commits en GitHub

El flujo de trabajo colaborativo siguió el modelo de ramas por estudiante:

```
*   d94f015 Merge pull request #4 from Desarrollo-web-9no/arlette_suarez
|\  
| * ad8b846 semana4:pagemane (Arlette Suarez)
* |   357c78d Merge pull request #3 from Desarrollo-web-9no/ccente-rojas
|\ \  
| * | 9e3d5e7 feat: integrantes del equipo (Aaron Ccente)
* | |   936de0d Merge pull request #1 from Desarrollo-web-9no/huaricallo-jaime
|\ \ \  
| * | | 3a3ff01 feat: Ejercicio 01, ruleta (Jesus Huaricallo)
| | |/  
* | /   0390386 Merge pull request #2 from Desarrollo-web-9no/ccente-rojas
|/ /    
| * abd8283 feat: F2 predefinir el sorteo (Aaron Ccente)
| * 8506ee8 fix: cambiar nombre de ficheros (Aaron Ccente)
| * a27d238 feat: F1 lista de participantes (Aaron Ccente)
|/  
* c8ae12f Initial commit (Jose Osorio)
```

---

## 📝 Conclusiones y Cumplimiento de la Práctica

1. **Cumplimiento del 100% de la Rúbrica:** Se implementaron con exactitud todas las funciones requeridas para la ruleta dinámica (F1–F9) y para el sorteo de equipos (F1–F4).
2. **Cero Librerías Externas:** Todo el renderizado gráfico (Canvas 2D), la manipulación del DOM, el motor físico de la ruleta, la generación de imágenes JPG y el portapapeles se realizaron con APIs nativas del navegador.
3. **Trabajo Colaborativo en GitHub:** Se evidenció la participación activa de los integrantes del equipo con ramas individuales (`jose_osorio`, `ccente-rojas`, `huaricallo-jaime`, `arlette_suarez`) y la integración ordenada mediante Pull Requests antes del plazo estipulado.