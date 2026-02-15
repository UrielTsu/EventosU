// ========= EventosU - eventos.js =========
// Usa la MISMA clave que tu index/inscripciones.js: "eventos"

function obtenerEventos() {
  return JSON.parse(localStorage.getItem("eventos")) || null;
}

function guardarEventos(lista) {
  localStorage.setItem("eventos", JSON.stringify(lista));
}

function seedDemo() {
  // OJO: ahora usamos fecha con hora (datetime-local)
  const demo = [
    { id: 1, titulo: "Taller de Ciberseguridad", fecha: "2026-03-10T10:00", sede: "Aula Magna FCC", tipo: "taller", cupoRestante: 5 },
    { id: 2, titulo: "Congreso de IA", fecha: "2026-03-20T09:30", sede: "Auditorio Central", tipo: "congreso", cupoRestante: 0 }
  ];
  guardarEventos(demo);
  return demo;
}

function tipoLabel(tipo) {
  const map = {
    conferencia: "Conferencia",
    taller: "Taller",
    curso: "Curso",
    congreso: "Congreso"
  };
  return map[tipo] || tipo;
}

function showAlert(msg, type = "success") {
  alerta.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

function esFechaHoraFutura(dtLocal) {
  // dtLocal: "YYYY-MM-DDTHH:mm"
  const f = new Date(dtLocal);
  return !Number.isNaN(f.getTime()) && f.getTime() > Date.now();
}

function formatDateTime(dtLocal) {
  // dtLocal "YYYY-MM-DDTHH:mm" -> bonito
  const d = new Date(dtLocal);
  return d.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Si no hay nada en LS, crea demo
let eventos = obtenerEventos();
if (!Array.isArray(eventos) || eventos.length === 0) {
  eventos = seedDemo();
}

const form = document.getElementById("formEvento");
const tabla = document.getElementById("tablaEventos");
const alerta = document.getElementById("alerta");
const estadoVacio = document.getElementById("estadoVacio");

const btnLimpiar = document.getElementById("btnLimpiar");
const btnResetDemo = document.getElementById("btnResetDemo");

function renderTabla() {
  tabla.innerHTML = "";

  if (!eventos || eventos.length === 0) {
    estadoVacio.classList.remove("d-none");
    return;
  }
  estadoVacio.classList.add("d-none");

  eventos
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .forEach(ev => {
      tabla.innerHTML += `
        <tr>
          <td>${escapeHtml(ev.titulo)}</td>
          <td><span class="badge text-bg-info">${escapeHtml(tipoLabel(ev.tipo))}</span></td>
          <td>${escapeHtml(formatDateTime(ev.fecha))}</td>
          <td>${Number(ev.cupoRestante)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarEvento(${ev.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });
}

// Para usarlo en onclick
window.eliminarEvento = function(id) {
  eventos = eventos.filter(e => e.id !== id);
  guardarEventos(eventos);
  renderTabla();
  showAlert("Evento eliminado.", "warning");
};

btnLimpiar.addEventListener("click", () => {
  form.reset();
  form.classList.remove("was-validated");
  alerta.innerHTML = "";
});

btnResetDemo.addEventListener("click", () => {
  eventos = seedDemo();
  renderTabla();
  showAlert("Se restauraron los eventos demo.", "info");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("was-validated");

  const titulo = document.getElementById("titulo").value.trim();
  const sede = document.getElementById("sede").value.trim();
  const tipo = document.getElementById("tipo").value;
  const cupo = Number(document.getElementById("cupo").value);
  const fecha = document.getElementById("fecha").value; // "YYYY-MM-DDTHH:mm"

  // Validaciones extra (además de Bootstrap)
  if (!esFechaHoraFutura(fecha)) {
    showAlert("La fecha y hora deben ser futuras (mayor a este momento).", "danger");
    return;
  }
  if (!(cupo > 0)) {
    showAlert("El cupo debe ser mayor a 0.", "danger");
    return;
  }
  if (!form.checkValidity()) return;

  // Generar ID: máximo + 1
  const nextId = eventos.length ? Math.max(...eventos.map(e => e.id)) + 1 : 1;

  const nuevo = {
    id: nextId,
    titulo,
    fecha,
    sede,
    tipo,
    cupoRestante: cupo
  };

  eventos.push(nuevo);
  guardarEventos(eventos);

  renderTabla();
  showAlert("Evento guardado correctamente. Ve a Inicio para verlo en el catálogo.", "success");

  form.reset();
  form.classList.remove("was-validated");
});

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderTabla();
