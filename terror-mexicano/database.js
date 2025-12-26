let personajesDB = null;
let antagonistasDB = null;
let lugaresDB = null;
let epocasDB = null;

// Cargar base de datos de personajes desde modulos
async function loadPersonajes() {
    if (personajesDB) return personajesDB;
    
    try {
        // Usar los modulos ya cargados en window
        if (window.MODULOS_PERSONAJES && window.MODULOS_PERSONAJES.length > 0) {
            personajesDB = window.MODULOS_PERSONAJES;
            return personajesDB;
        } else {
            console.warn('Modulos de personajes no disponibles');
            return [];
        }
    } catch (error) {
        console.warn('Error cargando personajes:', error);
        return [];
    }
}

// Cargar base de datos de antagonistas desde modulos
async function loadAntagonistas() {
    if (antagonistasDB) return antagonistasDB;
    
    try {
        if (window.MODULOS_ANTAGONISTAS && window.MODULOS_ANTAGONISTAS.length > 0) {
            antagonistasDB = window.MODULOS_ANTAGONISTAS;
            return antagonistasDB;
        } else {
            console.warn('Modulos de antagonistas no disponibles');
            return [];
        }
    } catch (error) {
        console.warn('Error cargando antagonistas:', error);
        return [];
    }
}

// Cargar base de datos de lugares desde modulos
async function loadLugares() {
    if (lugaresDB) return lugaresDB;
    
    try {
        if (window.MODULOS_LUGARES && window.MODULOS_LUGARES.length > 0) {
            lugaresDB = window.MODULOS_LUGARES;
            return lugaresDB;
        } else {
            console.warn('Modulos de lugares no disponibles');
            return [];
        }
    } catch (error) {
        console.warn('Error cargando lugares:', error);
        return [];
    }
}

// Cargar base de datos de epocas desde modulos
async function loadEpocas() {
    if (epocasDB) return epocasDB;
    
    try {
        if (window.MODULOS_EPOCAS && window.MODULOS_EPOCAS.length > 0) {
            epocasDB = window.MODULOS_EPOCAS;
            return epocasDB;
        } else {
            console.warn('Modulos de epocas no disponibles');
            return [];
        }
    } catch (error) {
        console.warn('Error cargando epocas:', error);
        return [];
    }
}

// Buscar personajes por contexto de terror
function buscarPersonajesPorContexto(terrorTypes, cantidad = 3) {
    if (!personajesDB || personajesDB.length === 0) return [];
    
    const compatibles = personajesDB.filter(p => {
        return p.contextos && p.contextos.some(ctx => 
            terrorTypes.some(tipo => ctx.includes(tipo))
        );
    });
    
    // Si no hay suficientes, agregar personajes generales
    if (compatibles.length < cantidad) {
        const otros = personajesDB.filter(p => !compatibles.includes(p));
        compatibles.push(...otros.slice(0, cantidad - compatibles.length));
    }
    
    // Mezclar y tomar cantidad solicitada
    return shuffleArray(compatibles).slice(0, cantidad);
}

// Buscar antagonistas por contexto de terror
function buscarAntagonistasPorContexto(terrorTypes, cantidad = 2) {
    if (!antagonistasDB || antagonistasDB.length === 0) return [];
    
    const compatibles = antagonistasDB.filter(a => {
        return a.contextos && a.contextos.some(ctx => 
            terrorTypes.some(tipo => ctx.includes(tipo))
        );
    });
    
    if (compatibles.length < cantidad) {
        const otros = antagonistasDB.filter(a => !compatibles.includes(a));
        compatibles.push(...otros.slice(0, cantidad - compatibles.length));
    }
    
    return shuffleArray(compatibles).slice(0, cantidad);
}

// Buscar lugares por contexto de terror
function buscarLugaresPorContexto(terrorTypes, cantidad = 2) {
    if (!lugaresDB || lugaresDB.length === 0) return [];
    
    const compatibles = lugaresDB.filter(l => {
        return l.contextos && l.contextos.some(ctx => 
            terrorTypes.some(tipo => ctx.includes(tipo))
        );
    });
    
    if (compatibles.length < cantidad) {
        const otros = lugaresDB.filter(l => !compatibles.includes(l));
        compatibles.push(...otros.slice(0, cantidad - compatibles.length));
    }
    
    return shuffleArray(compatibles).slice(0, cantidad);
}

// Obtener epoca por ID
function obtenerEpocaPorId(epocaId) {
    if (!epocasDB || epocasDB.length === 0) return null;
    return epocasDB.find(e => e.id === epocaId) || null;
}

// Obtener personaje por ID
function obtenerPersonajePorId(personajeId) {
    if (!personajesDB || personajesDB.length === 0) return null;
    return personajesDB.find(p => p.id === personajeId) || null;
}

// Obtener antagonista por ID
function obtenerAntagonistaPorId(antagonistaId) {
    if (!antagonistasDB || antagonistasDB.length === 0) return null;
    return antagonistasDB.find(a => a.id === antagonistaId) || null;
}

// Obtener lugar por ID
function obtenerLugarPorId(lugarId) {
    if (!lugaresDB || lugaresDB.length === 0) return null;
    return lugaresDB.find(l => l.id === lugarId) || null;
}

// Sugerir personajes aleatorios de la base de datos
function sugerirPersonajes(cantidad = 3) {
    if (!personajesDB || personajesDB.length === 0) return [];
    return shuffleArray(personajesDB).slice(0, cantidad);
}

// Obtener sugerencias de personajes formateadas para el textarea
function formatearPersonajesSugeridos(personajes) {
    return personajes.map(p => {
        return `${p.nombre}, ${p.genero}, ${p.edad} años: ${p.descripcion.split('.')[0]}.`;
    }).join('\n');
}

// Obtener sugerencias de antagonistas formateadas
function formatearAntagonistasSugeridos(antagonistas) {
    return antagonistas.map(a => {
        return `${a.nombre}: ${a.descripcion.split('.')[0]}. Manifestacion: ${a.manifestacion || 'Variable'}.`;
    }).join('\n');
}

// Obtener sugerencias de lugares formateadas
function formatearLugaresSugeridos(lugares) {
    return lugares.map(l => {
        return `${l.nombre}: ${l.descripcion.split('.')[0]}. Atmosfera: ${l.atmosfera}.`;
    }).join('\n');
}

// Autocompletar elementos en el formulario
async function autocompletarElementos(terrorTypes) {
    await loadPersonajes();
    await loadAntagonistas();
    await loadLugares();
    
    const resultado = {
        personajes: null,
        antagonistas: null,
        lugares: null
    };
    
    // Personajes
    const personajesSugeridos = buscarPersonajesPorContexto(terrorTypes, 2);
    if (personajesSugeridos.length > 0) {
        resultado.personajes = formatearPersonajesSugeridos(personajesSugeridos);
    }
    
    // Antagonistas
    const antagonistasSugeridos = buscarAntagonistasPorContexto(terrorTypes, 1);
    if (antagonistasSugeridos.length > 0) {
        resultado.antagonistas = formatearAntagonistasSugeridos(antagonistasSugeridos);
    }
    
    // Lugares
    const lugaresSugeridos = buscarLugaresPorContexto(terrorTypes, 1);
    if (lugaresSugeridos.length > 0) {
        resultado.lugares = formatearLugaresSugeridos(lugaresSugeridos);
    }
    
    return resultado;
}

// Mejorar prompt con elementos de la base de datos
async function enrichPromptWithDatabase(formData) {
    await loadPersonajes();
    await loadAntagonistas();
    await loadLugares();
    await loadEpocas();
    
    // Si el usuario no especifico personajes, sugerir de la DB
    if (!formData.personajes || formData.personajes.trim().length < 20) {
        const sugeridos = buscarPersonajesPorContexto(formData.terrorTypes, 2);
        if (sugeridos.length > 0) {
            formData.personajes = formatearPersonajesSugeridos(sugeridos);
        }
    }
    
    // Agregar contexto de elementos disponibles al prompt
    const contextoDB = {
        personajes: personajesDB ? personajesDB.slice(0, 3).map(p => 
            `${p.nombre} (${p.tipo}): ${p.descripcion.slice(0, 100)}...`
        ).join('\n') : 'No disponible',
        antagonistas: antagonistasDB ? antagonistasDB.slice(0, 2).map(a => 
            `${a.nombre}: ${a.descripcion.slice(0, 100)}...`
        ).join('\n') : 'No disponible',
        lugares: lugaresDB ? lugaresDB.slice(0, 2).map(l => 
            `${l.nombre}: ${l.descripcion.slice(0, 100)}...`
        ).join('\n') : 'No disponible'
    };
    
    formData.contextoDB = contextoDB;
    
    return formData;
}

// Generar combinacion aleatoria de elementos para historia rapida
async function generarCombinacionRapida() {
    await loadPersonajes();
    await loadAntagonistas();
    await loadLugares();
    await loadEpocas();
    
    const terrorTypes = ['paranormal', 'psicologico', 'folk horror', 'urbano', 'gotico'];
    const terrorAleatorio = [terrorTypes[Math.floor(Math.random() * terrorTypes.length)]];
    
    const combinacion = {
        terrorTypes: terrorAleatorio,
        personajes: shuffleArray(personajesDB).slice(0, 1)[0],
        antagonistas: shuffleArray(antagonistasDB).slice(0, 1)[0],
        lugares: shuffleArray(lugaresDB).slice(0, 1)[0],
        epocas: shuffleArray(epocasDB).slice(0, 1)[0]
    };
    
    return combinacion;
}

// Utilidad: mezclar array
function shuffleArray(array) {
    if (!array || array.length === 0) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Inicializar base de datos al cargar la pagina
async function initializeDatabase() {
    console.log('Inicializando base de datos modular...');
    await loadPersonajes();
    await loadAntagonistas();
    await loadLugares();
    await loadEpocas();
    
    console.log('Bases de datos cargadas:', {
        personajes: personajesDB ? personajesDB.length : 0,
        antagonistas: antagonistasDB ? antagonistasDB.length : 0,
        lugares: lugaresDB ? lugaresDB.length : 0,
        epocas: epocasDB ? epocasDB.length : 0
    });
}

// Agregar botones de sugerencia al formulario
function addSuggestionButtons() {
    const personajesTextarea = document.getElementById('personajes');
    const antagonistasTextarea = document.getElementById('antagonistas');
    const lugaresTextarea = document.getElementById('lugares');
    
    if (personajesTextarea) {
        addSuggestionButton(personajesTextarea, 'personajes', 'Sugerir Personajes');
    }
    if (antagonistasTextarea) {
        addSuggestionButton(antagonistasTextarea, 'antagonistas', 'Sugerir Antagonistas');
    }
    if (lugaresTextarea) {
        addSuggestionButton(lugaresTextarea, 'lugares', 'Sugerir Lugares');
    }
}

// Agregar boton de sugerencia individual
function addSuggestionButton(textarea, tipo, texto) {
    const formGroup = textarea.parentElement;
    
    const suggestionButton = document.createElement('button');
    suggestionButton.type = 'button';
    suggestionButton.className = 'btn-suggestion';
    suggestionButton.textContent = texto;
    suggestionButton.style.cssText = `
        margin-top: 10px;
        padding: 8px 15px;
        background: #d4af37;
        color: #2c2c2c;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
        font-weight: bold;
        transition: all 0.3s;
        display: inline-block;
        margin-right: 10px;
    `;
    
    suggestionButton.addEventListener('click', async () => {
        const terrorTypes = getSelectedTerrorTypes();
        if (terrorTypes.length === 0) {
            alert('Por favor selecciona al menos un tipo de terror primero');
            return;
        }
        
        suggestionButton.textContent = 'Cargando...';
        suggestionButton.disabled = true;
        
        const elementos = await autocompletarElementos(terrorTypes);
        const sugerido = elementos[tipo];
        
        if (sugerido) {
            const currentText = textarea.value.trim();
            textarea.value = currentText ? `${currentText}\n\n${sugerido}` : sugerido;
        } else {
            alert(`No se encontraron ${tipo} para los tipos de terror seleccionados`);
        }
        
        suggestionButton.textContent = texto;
        suggestionButton.disabled = false;
    });
    
    formGroup.appendChild(suggestionButton);
}

// Mostrar estadisticas de la base de datos
async function showDatabaseStats() {
    await loadPersonajes();
    await loadAntagonistas();
    await loadLugares();
    await loadEpocas();
    
    if (!personajesDB) {
        console.log('Base de datos no disponible');
        return null;
    }
    
    const stats = {
        personajes: {
            total: personajesDB ? personajesDB.length : 0,
            porGenero: { Masculino: 0, Femenino: 0 },
            porTipo: {}
        },
        antagonistas: {
            total: antagonistasDB ? antagonistasDB.length : 0,
            porTipo: {}
        },
        lugares: {
            total: lugaresDB ? lugaresDB.length : 0,
            porTipo: {}
        },
        epocas: {
            total: epocasDB ? epocasDB.length : 0
        }
    };
    
    // Estadisticas de personajes
    if (personajesDB) {
        personajesDB.forEach(p => {
            stats.personajes.porGenero[p.genero] = (stats.personajes.porGenero[p.genero] || 0) + 1;
            stats.personajes.porTipo[p.tipo] = (stats.personajes.porTipo[p.tipo] || 0) + 1;
        });
    }
    
    // Estadisticas de antagonistas
    if (antagonistasDB) {
        antagonistasDB.forEach(a => {
            stats.antagonistas.porTipo[a.tipo] = (stats.antagonistas.porTipo[a.tipo] || 0) + 1;
        });
    }
    
    // Estadisticas de lugares
    if (lugaresDB) {
        lugaresDB.forEach(l => {
            stats.lugares.porTipo[l.tipo] = (stats.lugares.porTipo[l.tipo] || 0) + 1;
        });
    }
    
    console.log('Estadisticas de Base de Datos Modular:', stats);
    return stats;
}

// Obtener tipos de terror seleccionados (funcion auxiliar)
function getSelectedTerrorTypes() {
    const checkboxes = document.querySelectorAll('input[name="terrorTypes"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Inicializar al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    initializeDatabase();
    setTimeout(() => {
        addSuggestionButtons();
        showDatabaseStats();
    }, 1000);
});
