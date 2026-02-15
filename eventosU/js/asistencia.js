// ========= EventosU - Administración de Asistentes =========

const CLAVE_EVENTOS = "eventos";
const CLAVE_ASISTENTES = "asistentes";

const selectorEvento = document.getElementById("evento");
const tablaBody = document.querySelector("#tablaAsistentes tbody");
const btnExportar = document.getElementById("btnExportar");

// ===== Utilidades =====
function obtenerEventos() {
    return JSON.parse(localStorage.getItem(CLAVE_EVENTOS)) || [];
}

function obtenerAsistentes() {
    return JSON.parse(localStorage.getItem(CLAVE_ASISTENTES)) || [];
}

function guardarAsistentes(lista) {
    localStorage.setItem(CLAVE_ASISTENTES, JSON.stringify(lista));
}

// ===== Cargar eventos en select =====
function cargarEventos() {
    const eventos = obtenerEventos();
    selectorEvento.innerHTML = "";

    if (eventos.length === 0) {
        const opt = document.createElement("option");
        opt.textContent = "No hay eventos";
        selectorEvento.appendChild(opt);
        return;
    }

    eventos.forEach(ev => {
        const option = document.createElement("option");
        option.value = ev.id;
        option.textContent = `${ev.titulo} (${ev.fecha})`;
        selectorEvento.appendChild(option);
    });
}

// ===== Renderizar tabla =====
function cargarTabla() {
    const idEvento = Number(selectorEvento.value);
    const asistentes = obtenerAsistentes().filter(a => a.idEvento === idEvento);

    tablaBody.innerHTML = "";

    if (asistentes.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="5">No hay asistentes registrados.</td>
            </tr>
        `;
        return;
    }

    asistentes.forEach(asistente => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${asistente.id}</td>
            <td>${asistente.nombre}</td>
            <td>${asistente.email}</td>
            <td>${asistente.estado}</td>
            <td>
                <button class="btn-accion confirmar">Confirmar</button>
                <button class="btn-accion eliminar">Eliminar</button>
            </td>
        `;

        fila.querySelector(".confirmar").addEventListener("click", () => {
            actualizarEstado(asistente.id, "Confirmado");
        });

        fila.querySelector(".eliminar").addEventListener("click", () => {
            if (confirm("¿Eliminar este asistente?")) {
                eliminarAsistente(asistente.id);
            }
        });

        tablaBody.appendChild(fila);
    });
}

// ===== Acciones =====
function actualizarEstado(id, nuevoEstado) {
    const lista = obtenerAsistentes();
    const asistente = lista.find(a => a.id === id);
    if (asistente) {
        asistente.estado = nuevoEstado;
        guardarAsistentes(lista);
        cargarTabla();
    }
}

function eliminarAsistente(id) {
    let lista = obtenerAsistentes();
    lista = lista.filter(a => a.id !== id);
    guardarAsistentes(lista);
    cargarTabla();
}

// ===== Exportar TXT =====
function exportarTXT() {
    const idEvento = Number(selectorEvento.value);
    const asistentes = obtenerAsistentes().filter(a => a.idEvento === idEvento);

    let contenido = "ID\tNombre\tEmail\tEstado\n";
    asistentes.forEach(a => {
        contenido += `${a.id}\t${a.nombre}\t${a.email}\t${a.estado}\n`;
    });

    const blob = new Blob([contenido], { type: "text/plain" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "asistentes_evento.txt";
    enlace.click();
}

// ===== Eventos =====
selectorEvento.addEventListener("change", cargarTabla);
btnExportar.addEventListener("click", exportarTXT);

// ===== Inicializar =====
cargarEventos();
cargarTabla();
