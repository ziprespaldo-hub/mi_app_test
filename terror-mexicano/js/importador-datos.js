let datosImportados = {
    protagonistas: [],
    antagonistas: [],
    lugares: [],
    elementos: []
};

// Convertir texto estructurado a JSON
function parsearDatosEstructurados(texto) {
    const lineas = texto.split('\n');
    const secciones = {};
    let seccionActual = '';
    
    lineas.forEach(linea => {
        linea = linea.trim();
        
        // Detectar nuevas secciones
        if (linea.includes('PROTAGONISTAS')) {
            seccionActual = 'protagonistas';
            secciones[seccionActual] = [];
            return;
        }
        if (linea.includes('ANTAGOSNISTAS') || linea.includes('ANTAGONISTAS')) {
            seccionActual = 'antagonistas';
            secciones[seccionActual] = [];
            return;
        }
        if (linea.includes('Personajes Secundarios') || linea.includes('ARRQUETIPOS')) {
            seccionActual = 'secundarios';
            secciones[seccionActual] = [];
            return;
        }
        if (linea.includes('------') || linea === '') {
            return; // Saltar separadores
        }
        
        // Procesar datos segun la seccion
        if (seccionActual && linea) {
            if (seccionActual === 'protagonistas') {
                const partes = linea.split('\t').filter(p => p.trim());
                if (partes.length >= 4) {
                    secciones[seccionActual].push({
                        nombre: partes[0].trim(),
                        genero: partes[1].trim(),
                        edad: parseInt(partes[2]) || 0,
                        caracteristicas: partes[3].trim(),
                        tipo: 'protagonista',
                        id: generarId(partes[0].trim())
                    });
                }
            }
            else if (seccionActual === 'antagonistas') {
                const partes = linea.split('\t').filter(p => p.trim());
                if (partes.length >= 3) {
                    secciones[seccionActual].push({
                        nombre: partes[0].trim(),
                        genero: partes[1].trim(),
                        edad: partes[2].trim(),
                        descripcion: partes[3] ? partes[3].trim() : 'Sin descripcion',
                        tipo: 'antagonista',
                        id: generarId(partes[0].trim())
                    });
                }
            }
        }
    });
    
    return secciones;
}

// Generar ID unico
function generarId(nombre) {
    return nombre.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

// Cargar datos desde archivo local
async function cargarDatosDesdeArchivo(archivo) {
    try {
        const respuesta = await fetch(archivo);
        const texto = await respuesta.text();
        return parsearDatosEstructurados(texto);
    } catch (error) {
        console.error('Error cargando archivo:', error);
        return null;
    }
}

// Importar datos manualmente (pegando texto)
function importarDatosManual(texto) {
    const datos = parsearDatosEstructurados(texto);
    if (datos) {
        datosImportados = { ...datosImportados, ...datos };
        actualizarSelectores();
        guardarEnLocalStorage();
        return true;
    }
    return false;
}

// Guardar datos en localStorage
function guardarEnLocalStorage() {
    try {
        localStorage.setItem('terrorMexicano_datosImportados', JSON.stringify(datosImportados));
        console.log('Datos guardados en localStorage');
    } catch (error) {
        console.warn('No se pudo guardar en localStorage:', error);
    }
}

// Cargar datos desde localStorage
function cargarDesdeLocalStorage() {
    try {
        const guardados = localStorage.getItem('terrorMexicano_datosImportados');
        if (guardados) {
            datosImportados = JSON.parse(guardados);
            console.log('Datos cargados desde localStorage');
            return true;
        }
    } catch (error) {
        console.warn('Error cargando desde localStorage:', error);
    }
    return false;
}

// Actualizar todos los selectores del formulario
function actualizarSelectores() {
    actualizarSelectorPersonajes();
    actualizarSelectorAntagonistas();
    actualizarSelectorLugares();
    actualizarSelectorElementos();
}

// Actualizar selector de personajes
function actualizarSelectorPersonajes() {
    const selector = document.getElementById('personajes-predefinidos');
    if (!selector) return;
    
    // Limpiar opciones existentes
    selector.innerHTML = '';
    
    // Agregar personajes de data-modulos.js
    if (window.MODULOS_PERSONAJES) {
        window.MODULOS_PERSONAJES.forEach(personaje => {
            const option = document.createElement('option');
            option.value = personaje.id;
            option.textContent = `${personaje.nombre} (${personaje.edad} años) - ${personaje.descripcion.substring(0, 60)}...`;
            option.dataset.tipo = 'modulo';
            selector.appendChild(option);
        });
    }
    
    // Agregar personajes importados
    if (datosImportados.protagonistas && datosImportados.protagonistas.length > 0) {
        const grupo = document.createElement('optgroup');
        grupo.label = 'Personajes Importados';
        
        datosImportados.protagonistas.forEach(personaje => {
            const option = document.createElement('option');
            option.value = personaje.id;
            option.textContent = `${personaje.nombre} (${personaje.edad} años) - ${personaje.caracteristicas.substring(0, 60)}...`;
            option.dataset.tipo = 'importado';
            grupo.appendChild(option);
        });
        
        selector.appendChild(grupo);
    }
}

// Actualizar selector de antagonistas
function actualizarSelectorAntagonistas() {
    const selector = document.getElementById('antagonista');
    if (!selector) return;
    
    // Limpiar opciones existentes
    selector.innerHTML = '<option value="">Selecciona un antagonista...</option>';
    
    // Agregar antagonistas de data-modulos.js
    if (window.MODULOS_ANTAGONISTAS) {
        window.MODULOS_ANTAGONISTAS.forEach(antagonista => {
            const option = document.createElement('option');
            option.value = antagonista.id;
            option.textContent = `${antagonista.nombre} - ${antagonista.descripcion.substring(0, 80)}...`;
            option.dataset.tipo = 'modulo';
            selector.appendChild(option);
        });
    }
    
    // Agregar antagonistas importados
    if (datosImportados.antagonistas && datosImportados.antagonistas.length > 0) {
        const grupo = document.createElement('optgroup');
        grupo.label = 'Antagonistas Importados';
        
        datosImportados.antagonistas.forEach(antagonista => {
            const option = document.createElement('option');
            option.value = antagonista.id;
            option.textContent = `${antagonista.nombre} - ${antagonista.descripcion.substring(0, 80)}...`;
            option.dataset.tipo = 'importado';
            grupo.appendChild(option);
        });
        
        selector.appendChild(grupo);
    }
}

// Actualizar selector de lugares
function actualizarSelectorLugares() {
    const selector = document.getElementById('lugar-predefinido');
    if (!selector) return;
    
    // Limpiar opciones existentes
    selector.innerHTML = '<option value="">Ninguno (escribire mi propio lugar)</option>';
    
    // Agregar lugares de data-modulos.js
    if (window.MODULOS_LUGARES) {
        window.MODULOS_LUGARES.forEach(lugar => {
            const option = document.createElement('option');
            option.value = lugar.id;
            option.textContent = `${lugar.nombre} - ${lugar.descripcion.substring(0, 80)}...`;
            option.dataset.tipo = 'modulo';
            selector.appendChild(option);
        });
    }
}

// Actualizar selector de elementos
function actualizarSelectorElementos() {
    const selector = document.getElementById('elementos-predefinidos');
    if (!selector) return;
    
    // Limpiar opciones existentes
    selector.innerHTML = '';
    
    // Agregar elementos de data-modulos.js (si existen)
    if (window.MODULOS_ELEMENTOS) {
        window.MODULOS_ELEMENTOS.forEach(elemento => {
            const option = document.createElement('option');
            option.value = elemento.id;
            option.textContent = `${elemento.nombre} - ${elemento.descripcion.substring(0, 60)}...`;
            option.dataset.tipo = 'modulo';
            selector.appendChild(option);
        });
    }
}

// Obtener datos completos de un personaje seleccionado
function obtenerPersonajePorId(id) {
    // Buscar en modulos
    if (window.MODULOS_PERSONAJES) {
        const modulo = window.MODULOS_PERSONAJES.find(p => p.id === id);
        if (modulo) return modulo;
    }
    
    // Buscar en importados
    if (datosImportados.protagonistas) {
        const importado = datosImportados.protagonistas.find(p => p.id === id);
        if (importado) return importado;
    }
    
    return null;
}

// Obtener datos completos de un antagonista seleccionado
function obtenerAntagonistaPorId(id) {
    // Buscar en modulos
    if (window.MODULOS_ANTAGONISTAS) {
        const modulo = window.MODULOS_ANTAGONISTAS.find(a => a.id === id);
        if (modulo) return modulo;
    }
    
    // Buscar en importados
    if (datosImportados.antagonistas) {
        const importado = datosImportados.antagonistas.find(a => a.id === id);
        if (importado) return importado;
    }
    
    return null;
}

// Auto-completar formulario con seleccion multiple
function autocompletarDesdeSeleccion() {
    // Personajes seleccionados
    const selectorPersonajes = document.getElementById('personajes-predefinidos');
    const personajesSeleccionados = Array.from(selectorPersonajes.selectedOptions)
        .map(option => obtenerPersonajePorId(option.value))
        .filter(p => p !== null);
    
    if (personajesSeleccionados.length > 0) {
        const textoPersonajes = personajesSeleccionados.map(p => 
            `${p.nombre}, ${p.genero}, ${p.edad} años: ${p.descripcion || p.caracteristicas}`
        ).join('\n');
        
        document.getElementById('personajes-custom').value = textoPersonajes;
    }
    
    // Antagonista seleccionado
    const selectorAntagonista = document.getElementById('antagonista');
    const antagonistaSeleccionado = obtenerAntagonistaPorId(selectorAntagonista.value);
    
    if (antagonistaSeleccionado) {
        // Podrias auto-completar algun campo relacionado con el antagonista
        console.log('Antagonista seleccionado:', antagonistaSeleccionado);
    }
}

// Agregar interfaz de importacion al formulario
function agregarInterfazImportacion() {
    const formPanel = document.getElementById('form-panel');
    if (!formPanel) return;
    
    const importSection = document.createElement('div');
    importSection.className = 'form-group';
    importSection.innerHTML = `
        <label>Importar Datos desde Texto</label>
        <p class="small-hint" style="font-size: 0.9em; color: #8b4513; margin-bottom: 10px;">
            Pega tu texto estructurado (como BASE_DATOS_CUENTOS.TXT) para cargar personajes y antagonistas
        </p>
        <textarea id="import-textarea" placeholder="Pega aqui tu texto estructurado..." 
style="width: 100%; height: 120px; margin-bottom: 10px; font-family: monospace; font-size: 0.9em;"></textarea>
        
        <div style="display: flex; gap: 10px;">
            <button type="button" class="btn btn-secondary" onclick="importarDesdeTexto()" style="padding: 8px 15px;">
                Importar Datos
            </button>
            <button type="button" class="btn btn-secondary" onclick="exportarDatos()" style="padding: 8px 15px;">
                Exportar Datos
            </button>
            <button type="button" class="btn btn-secondary" onclick="limpiarDatosImportados()" style="padding: 8px 15px;">
                Limpiar Importados
            </button>
        </div>
        
        <div id="import-status" style="margin-top: 10px; font-size: 0.9em;"></div>
    `;
    
    formPanel.insertBefore(importSection, formPanel.querySelector('.button-group'));
}

// Importar datos desde el textarea
function importarDesdeTexto() {
    const textarea = document.getElementById('import-textarea');
    const status = document.getElementById('import-status');
    
    if (!textarea || !textarea.value.trim()) {
        mostrarEstadoImportacion('No hay texto para importar', 'error');
        return;
    }
    
    const exito = importarDatosManual(textarea.value);
    
    if (exito) {
        const stats = obtenerEstadisticasImportacion();
        mostrarEstadoImportacion(
            `Importacion exitosa: ${stats.protagonistas} personajes, ${stats.antagonistas} antagonistas cargados`,
            'success'
        );
        textarea.value = ''; // Limpiar despues de importar
    } else {
        mostrarEstadoImportacion('Error en el formato del texto', 'error');
    }
}

// Mostrar estado de importacion
function mostrarEstadoImportacion(mensaje, tipo) {
    const status = document.getElementById('import-status');
    if (!status) return;
    
    status.textContent = mensaje;
    status.style.color = tipo === 'success' ? '#00ff00' : '#ff4444';
    status.style.fontWeight = 'bold';
    
    setTimeout(() => {
        status.textContent = '';
    }, 5000);
}

// Obtener estadisticas de datos importados
function obtenerEstadisticasImportacion() {
    return {
        protagonistas: datosImportados.protagonistas ? datosImportados.protagonistas.length : 0,
        antagonistas: datosImportados.antagonistas ? datosImportados.antagonistas.length : 0,
        lugares: datosImportados.lugares ? datosImportados.lugares.length : 0,
        elementos: datosImportados.elementos ? datosImportados.elementos.length : 0
    };
}

// Exportar datos a JSON
function exportarDatos() {
    const datos = {
        protagonistas: datosImportados.protagonistas,
        antagonistas: datosImportados.antagonistas,
        lugares: datosImportados.lugares,
        elementos: datosImportados.elementos,
        metadata: {
            exportado: new Date().toISOString(),
            total: obtenerEstadisticasImportacion()
        }
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terror-mexicano-datos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Limpiar datos importados
function limpiarDatosImportados() {
    if (confirm('¿Estas seguro de que quieres eliminar todos los datos importados?')) {
        datosImportados = { protagonistas: [], antagonistas: [], lugares: [], elementos: [] };
        localStorage.removeItem('terrorMexicano_datosImportados');
        actualizarSelectores();
        mostrarEstadoImportacion('Datos importados eliminados', 'success');
    }
}

// Inicializar sistema de importacion
function inicializarSistemaImportacion() {
    // Cargar datos guardados
    cargarDesdeLocalStorage();
    
    // Agregar interfaz
    agregarInterfazImportacion();
    
    // Actualizar selectores despues de que carguen los modulos
    setTimeout(() => {
        actualizarSelectores();
        
        // Agregar evento para auto-completar
        const selectorPersonajes = document.getElementById('personajes-predefinidos');
        const selectorAntagonista = document.getElementById('antagonista');
        
        if (selectorPersonajes) {
            selectorPersonajes.addEventListener('change', autocompletarDesdeSeleccion);
        }
        if (selectorAntagonista) {
            selectorAntagonista.addEventListener('change', autocompletarDesdeSeleccion);
        }
    }, 1000);
}

// Hacer funciones disponibles globalmente
window.importarDesdeTexto = importarDesdeTexto;
window.exportarDatos = exportarDatos;
window.limpiarDatosImportados = limpiarDatosImportados;
window.autocompletarDesdeSeleccion = autocompletarDesdeSeleccion;
window.obtenerEstadisticasImportacion = obtenerEstadisticasImportacion;

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', inicializarSistemaImportacion);
