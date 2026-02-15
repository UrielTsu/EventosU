// Datos simulados por evento
const eventos = {
    evento1: [
        { id: 1, nombre: "Juan Pérez", email: "juan@mail.com", estado: "Pendiente" },
        { id: 2, nombre: "Ana López", email: "ana@mail.com", estado: "Pendiente" }
    ],
    evento2: [
        { id: 3, nombre: "Carlos Ruiz", email: "carlos@mail.com", estado: "Pendiente" }
    ],
    evento3: []
};

const selectorEvento = document.getElementById("evento");
const tablaBody = document.querySelector("#tablaAsistentes tbody");
const btnExportar = document.getElementById("btnExportar");

function cargarTabla() {
    const eventoSeleccionado = selectorEvento.value;
    const asistentes = eventos[eventoSeleccionado];

    tablaBody.innerHTML = "";

    asistentes.forEach((asistente, index) => {
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

        // Confirmar asistencia
        fila.querySelector(".confirmar").addEventListener("click", () => {
            asistente.estado = "Confirmado";
            cargarTabla();
        });

        // Eliminar registro
        fila.querySelector(".eliminar").addEventListener("click", () => {
            asistentes.splice(index, 1);
            cargarTabla();
        });

        tablaBody.appendChild(fila);
    });
}

function exportarTXT() {
    const eventoSeleccionado = selectorEvento.value;
    const asistentes = eventos[eventoSeleccionado];

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

selectorEvento.addEventListener("change", cargarTabla);
btnExportar.addEventListener("click", exportarTXT);

cargarTabla();
