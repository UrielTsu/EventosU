// Carga inicial de datos [cite: 41]
let eventos = JSON.parse(localStorage.getItem('eventos')) || [
    { id: 1, titulo: 'Taller de Ciberseguridad', fecha: '2025-09-18', sede: 'Aula Magna FCC', tipo: 'taller', cupoRestante: 5 },
    { id: 2, titulo: 'Congreso de IA', fecha: '2025-10-20', sede: 'Auditorio Central', tipo: 'congreso', cupoRestante: 10 },
    { id: 3, titulo: 'Seminario de Energías Renovables', fecha: '2025-11-15', sede: 'Sala de Conferencias', tipo: 'seminario', cupoRestante: 10 },
    { id: 4, titulo: 'Taller de Robótica', fecha: '2025-12-05', sede: 'Laboratorio de Robótica', tipo: 'taller', cupoRestante: 3 },
    { id: 5, titulo: 'Congreso de Innovación Tecnológica', fecha: '2026-01-10', sede: 'Centro de Convenciones', tipo: 'congreso', cupoRestante: 8 }
];

const contenedor = document.getElementById('contenedorEventos');
const modalElement = document.getElementById('modalInscripcion');
const instanciaModal = new bootstrap.Modal(modalElement);

function renderizarCards(lista) {
    contenedor.innerHTML = '';
    lista.forEach(ev => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${ev.titulo}</h5>
                        <p class="card-text"><strong>Sede:</strong> ${ev.sede}</p>
                        <p class="card-text"><strong>Tipo:</strong> <span class="badge bg-info text-dark">${ev.tipo}</span></p>
                        <p class="card-text"><strong>Fecha:</strong> ${ev.fecha}</p>
                        <p class="card-text"><strong>Cupo restante:</strong> ${ev.cupoRestante}</p>
                        <button class="btn btn-primary w-100" 
                            ${ev.cupoRestante === 0 ? 'disabled' : ''} 
                            onclick="abrirInscripcion(${ev.id})">
                            ${ev.cupoRestante === 0 ? 'Cupo Lleno' : 'Inscribirme'}
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

// Abrir el modal globalmente
window.abrirInscripcion = function(id) {
    const ev = eventos.find(e => e.id === id);
    document.getElementById('idEventoSeleccionado').value = id;
    document.getElementById('tituloEventoModal').innerText = `Inscripción: ${ev.titulo}`;
    instanciaModal.show();
};

// Filtros dinámicos
function filtrar() {
    const texto = document.getElementById('busquedaTexto').value.toLowerCase();
    const tipo = document.getElementById('filtroTipo').value;
    const fecha = document.getElementById('filtroFecha').value;

    const filtrados = eventos.filter(ev => {
        const matchT = ev.titulo.toLowerCase().includes(texto) || ev.sede.toLowerCase().includes(texto);
        const matchTipo = tipo === "" || ev.tipo === tipo;
        const matchF = fecha === "" || ev.fecha === fecha;
        return matchT && matchTipo && matchF;
    });
    renderizarCards(filtrados);
}

document.getElementById('busquedaTexto').addEventListener('input', filtrar);
document.getElementById('filtroTipo').addEventListener('change', filtrar);
document.getElementById('filtroFecha').addEventListener('change', filtrar);

// Guardar Inscripción
document.getElementById('formInscripcion').addEventListener('submit', function(e) {
    e.preventDefault();
    const idEv = parseInt(document.getElementById('idEventoSeleccionado').value);
    const email = document.getElementById('emailAsistente').value;
    let asistentes = JSON.parse(localStorage.getItem('asistentes')) || [];

    if (asistentes.some(a => a.idEvento === idEv && a.email === email)) {
        alert("Este correo ya está registrado en este evento."); []
        return;
    }

    asistentes.push({
        id: Date.now(),
        idEvento: idEv,
        nombre: document.getElementById('nombreAsistente').value,
        email: email,
        telefono: document.getElementById('telefonoAsistente').value,
        estado: 'Pendiente'
    });

    localStorage.setItem('asistentes', JSON.stringify(asistentes));

    const idx = eventos.findIndex(ev => ev.id === idEv);
    eventos[idx].cupoRestante -= 1;
    localStorage.setItem('eventos', JSON.stringify(eventos));

    alert("¡Inscripción exitosa!");
    instanciaModal.hide();
    renderizarCards(eventos);
});

renderizarCards(eventos);