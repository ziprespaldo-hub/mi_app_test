let estadosDB = null;
let lugaresDetalladosDB = null;

// Cargar base de datos de estados desde ESTADOS_DATA.json
async function loadEstados() {
    if (estadosDB) return estadosDB;
    
    try {
        // Para demo, usar datos de ejemplo
        estadosDB = {
            'Ciudad de Mexico': {
                geografia: 'Valle lacustre, zona metropolitana, volcanes circundantes',
                elementos: ['barrios antiguos', 'edificios virreinales', 'metro subterraneo'],
                atmosfera: 'Ruido urbano constante, smog, bullicio que contrasta con soledad',
                experiencia_sensorial: {
                    olores: 'Gases de combustion, comida callejera, humedad de los tuneles',
                    colores: 'Gris de la ciudad, colores brillantes de los murales',
                    sonidos: 'El chirrido del metro, los claxons, el pregon de los vendedores'
                },
                historia_dominante: 'Tenochtitlan, Capital Virreinal y Gran Metropoli',
                leyendas_y_mitos: ['La Llorona en los canales de Xochimilco', 'El fantasma de la Dama de Rojo']
            },
            'Veracruz': {
                geografia: 'Costa del Golfo, montañas, selva, rios',
                elementos: ['haciendas cafetaleras', 'pueblos costeros', 'zonas arqueologicas'],
                atmosfera: 'Humedad tropical, vientos del norte, oleaje constante',
                experiencia_sensorial: {
                    olores: 'Cafe tostado, salitre, caña de azucar, humedad de selva',
                    colores: 'Verde intenso en la montaña, azul oscuro en el Golfo',
                    sonidos: 'El Norte (viento fuerte), el sonido de los barcos en el puerto'
                },
                historia_dominante: 'Puerta de Mexico, Cafe y Cultura Totonaca',
                leyendas_y_mitos: ['La Mulata de Cordoba', 'La Llorona en el Malecon']
            }
        };
        
        console.log('Estados cargados:', Object.keys(estadosDB).length);
        return estadosDB;
    } catch (error) {
        console.warn('Error cargando estados:', error);
        return {};
    }
}

// Cargar base de datos detallada de lugares
async function loadLugaresDetallados() {
    if (lugaresDetalladosDB) return lugaresDetalladosDB;
    
    try {
        // Para demo, usar datos de ejemplo
        lugaresDetalladosDB = {
            'hospital_abandonado': {
                nombre: 'Hospital General Santa Misericordia',
                tipo: 'medico_abandonado',
                descripcion: 'Hospital de 5 pisos cerrado hace 15 años por reestructuracion',
                caracteristicas: [
                    'Quirofanos con equipo aun conectado que se enciende solo',
                    'Morgue en sotano con gavetas que se abren desde dentro',
                    'Pasillos que cambian de configuracion entre visitas'
                ],
                atmosfera: 'Formaldehido mezclado con desinfectante viejo, silencio interrumpido por pitidos',
                historia: 'Cerrado subitamente en 2009 tras epidemia nunca confirmada oficialmente',
                elementos_terror: [
                    'Pacientes en camas que desaparecen al ser examinados',
                    'Llamadas de emergencia desde habitaciones especificas'
                ],
                contextos: ['gotico', 'gore', 'paranormal'],
                horario_peligroso: 'Cambio de turno fantasma: 3 AM'
            },
            'fabrica_textil': {
                nombre: 'Antigua Fabrica Textil La Hilandera',
                tipo: 'industrial_abandonado',
                descripcion: 'Fabrica textil cerrada desde 2003, tres pisos de maquinaria oxidada',
                caracteristicas: [
                    'Maquinas de coser que aun funcionan sin electricidad',
                    'Carretes de hilo que se desenrollan solos',
                    'Patrones de costura clavados en paredes con mensajes ocultos'
                ],
                atmosfera: 'Polvo textil suspendido en aire, crujidos de metal, olor a aceite rancio',
                historia: 'Cerrada tras accidente que mato a 7 trabajadoras, nunca investigado apropiadamente',
                elementos_terror: [
                    'Sonido de maquinas operando en turnos nocturnos',
                    'Hilos que forman patrones en el suelo cada mañana'
                ],
                contextos: ['urbano', 'folk horror', 'sobrenatural'],
                horario_peligroso: 'Durante la madrugada, especialmente luna llena'
            }
        };
        
        console.log('Lugares detallados cargados:', Object.keys(lugaresDetalladosDB).length);
        return lugaresDetalladosDB;
    } catch (error) {
        console.warn('Error cargando lugares detallados:', error);
        return {};
    }
}

// Obtener estado por nombre
function obtenerEstado(estadoNombre) {
    if (!estadosDB) return null;
    return estadosDB[estadoNombre] || null;
}

// Obtener lugar detallado por ID
function obtenerLugarDetallado(lugarId) {
    if (!lugaresDetalladosDB) return null;
    return lugaresDetalladosDB[lugarId] || null;
}

// Buscar estados compatibles con tipos de terror
function buscarEstadosPorTerror(terrorTypes) {
    if (!estadosDB) return [];
    
    const estadosCompatibles = [];
    
    Object.entries(estadosDB).forEach(([nombre, estado]) => {
        // Buscar compatibilidad en elementos, atmosfera y contexto general
        const elementosTexto = estado.elementos ? estado.elementos.join(' ').toLowerCase() : '';
        const atmosferaTexto = estado.atmosfera ? estado.atmosfera.toLowerCase() : '';
        const contextoCompleto = elementosTexto + ' ' + atmosferaTexto;
        
        const esCompatible = terrorTypes.some(tipo => {
            const tipoLower = tipo.toLowerCase();
            
            // Buscar en elementos especificos del estado
            if (contextoCompleto.includes(tipoLower)) return true;
            
            // Buscar en leyendas y mitos
            if (estado.leyendas_y_mitos) {
                const leyendasTexto = estado.leyendas_y_mitos.join(' ').toLowerCase();
                if (leyendasTexto.includes(tipoLower)) return true;
            }
            
            return false;
        });
        
        if (esCompatible) {
            estadosCompatibles.push({
                nombre: nombre,
                data: estado,
                compatibilidad: terrorTypes.length
            });
        }
    });
    
    return estadosCompatibles.sort((a, b) => b.compatibilidad - a.compatibilidad);
}

// Buscar lugares detallados por contexto y estado
function buscarLugaresDetallados(terrorTypes, estadoNombre = null) {
    if (!lugaresDetalladosDB) return [];
    
    const lugaresCompatibles = [];
    
    Object.entries(lugaresDetalladosDB).forEach(([id, lugar]) => {
        const esCompatible = terrorTypes.some(tipo => 
            lugar.contextos && lugar.contextos.includes(tipo)
        );
        
        if (esCompatible) {
            lugaresCompatibles.push({
                id: id,
                data: lugar,
                compatibilidad: terrorTypes.length
            });
        }
    });
    
    return lugaresCompatibles.sort((a, b) => b.compatibilidad - a.compatibilidad);
}

// Generar descripcion enriquecida de un estado
function generarDescripcionEstado(estado) {
    if (!estado) return '';
    
    const descripcion = `
📍 ${estado.nombre}
${estado.geografia ? `🗺️ ${estado.geografia}` : ''}

${estado.atmosfera ? `🌫️ Atmosfera: ${estado.atmosfera}` : ''}

${estado.historia_dominante ? `📜 Historia Dominante: ${estado.historia_dominante}` : ''}

${estado.elementos ? `🏛️ Elementos caracteristicos: ${estado.elementos.join(', ')}` : ''}

${estado.experiencia_sensorial ? `👃 Experiencia sensorial:` : ''}
${estado.experiencia_sensorial?.olores ? `   Olores: ${estado.experiencia_sensorial.olores}` : ''}
${estado.experiencia_sensorial?.colores ? `   Colores: ${estado.experiencia_sensorial.colores}` : ''}
${estado.experiencia_sensorial?.sonidos ? `   Sonidos: ${estado.experiencia_sensorial.sonidos}` : ''}

${estado.leyendas_y_mitos ? `👻 Leyendas y mitos: ${estado.leyendas_y_mitos.join('; ')}` : ''}
    `.trim();
    
    return descripcion;
}

// Generar descripcion enriquecida de un lugar
function generarDescripcionLugar(lugar) {
    if (!lugar) return '';
    
    const descripcion = `
🏚️ ${lugar.nombre}
${lugar.descripcion ? `📝 ${lugar.descripcion}` : ''}

${lugar.tipo ? `🏷️ Tipo: ${lugar.tipo}` : ''}
${lugar.atmosfera ? `🌫️ Atmosfera: ${lugar.atmosfera}` : ''}
${lugar.historia ? `📜 Historia: ${lugar.historia}` : ''}
${lugar.horario_peligroso ? `⏰ Horario peligroso: ${lugar.horario_peligroso}` : ''}

${lugar.caracteristicas ? `🔍 Caracteristicas:` : ''}
${lugar.caracteristicas ? lugar.caracteristicas.map(c => `   • ${c}`).join('\n') : ''}

${lugar.elementos_terror ? `👻 Elementos de terror:` : ''}
${lugar.elementos_terror ? lugar.elementos_terror.map(e => `   • ${e}`).join('\n') : ''}

${lugar.contextos ? `🎭 Contextos: ${lugar.contextos.join(', ')}` : ''}
    `.trim();
    
    return descripcion;
}

// Combinar estado y lugar para crear escenario unico
function crearEscenarioCompleto(estadoNombre, lugarId) {
    const estado = obtenerEstado(estadoNombre);
    const lugar = obtenerLugarDetallado(lugarId);
    
    if (!estado || !lugar) return null;
    
    const escenario = {
        estado: estadoNombre,
        lugar: lugar.nombre,
        descripcion_completa: `
🌎 ESCENARIO: ${lugar.nombre} en ${estadoNombre}

📍 Contexto Geografico
${estado.geografia}

🌫️ Atmosfera Regional
${estado.atmosfera}

🏚️ El Lugar: ${lugar.nombre}
${lugar.descripcion}

📜 Historia del Lugar
${lugar.historia || 'Historia no documentada'}

🔍 Caracteristicas unicas
${lugar.caracteristicas ? lugar.caracteristicas.map(c => `• ${c}`).join('\n') : 'Ninguna documentada'}

👻 Elementos de Terror
${lugar.elementos_terror ? lugar.elementos_terror.map(e => `• ${e}`).join('\n') : 'Ninguno documentado'}

🎭 Leyendas Locales
${estado.leyendas_y_mitos ? estado.leyendas_y_mitos.map(l => `• ${l}`).join('\n') : 'Ninguna documentada'}

👃 Experiencia Sensorial
Olores: ${estado.experiencia_sensorial?.olores || 'No especificado'}
Colores: ${estado.experiencia_sensorial?.colores || 'No especificado'}
Sonidos: ${estado.experiencia_sensorial?.sonidos || 'No especificado'}

⏰ Horario de Mayor Peligro
${lugar.horario_peligroso || 'No especificado'}
        `.trim()
    };
    
    return escenario;
}

// Sugerir combinaciones estado-lugar basadas en tipos de terror
async function sugerirCombinacionesEstadoLugar(terrorTypes, cantidad = 3) {
    await loadEstados();
    await loadLugaresDetallados();
    
    if (!estadosDB || !lugaresDetalladosDB) return [];
    
    const estadosCompatibles = buscarEstadosPorTerror(terrorTypes);
    const lugaresCompatibles = buscarLugaresDetallados(terrorTypes);
    
    const combinaciones = [];
    
    // Crear combinaciones aleatorias pero compatibles
    for (let i = 0; i < cantidad && i < estadosCompatibles.length && i < lugaresCompatibles.length; i++) {
        const estado = estadosCompatibles[i];
        const lugar = lugaresCompatibles[i];
        
        const combinacion = crearEscenarioCompleto(estado.nombre, lugar.id);
        if (combinacion) {
            combinaciones.push(combinacion);
        }
    }
    
    return combinaciones;
}

// Enriquecer prompt con datos geograficos y de lugares
async function enrichPromptWithGeografia(formData) {
    await loadEstados();
    await loadLugaresDetallados();
    
    if (!estadosDB || Object.keys(estadosDB).length === 0) {
        return formData;
    }
    
    // Si no hay estado especificado, sugerir uno compatible
    if (!formData.estado || formData.estado.trim() === '') {
        const estadosSugeridos = buscarEstadosPorTerror(formData.terrorTypes);
        if (estadosSugeridos.length > 0) {
            formData.estado = estadosSugeridos[0].nombre;
            formData.contextoEstado = generarDescripcionEstado(estadosSugeridos[0].data);
        }
    } else {
        // Enriquecer el estado especificado
        const estado = obtenerEstado(formData.estado);
        if (estado) {
            formData.contextoEstado = generarDescripcionEstado(estado);
        }
    }
    
    // Agregar contexto de lugares disponibles
    const lugaresContexto = Object.entries(lugaresDetalladosDB)
        .slice(0, 3)
        .map(([id, lugar]) => `${lugar.nombre} (${lugar.tipo}): ${lugar.descripcion.slice(0, 100)}...`)
        .join('\n');
    
    formData.contextoLugares = lugaresContexto;
    
    return formData;
}

// Agregar select de estados al formulario
function addEstadoSelector() {
    const lugarInput = document.getElementById('lugares');
    if (!lugarInput) return;
    
    const formGroup = lugarInput.parentElement;
    
    // Crear contenedor para el selector
    const selectorContainer = document.createElement('div');
    selectorContainer.style.cssText = `
        margin-bottom: 15px;
        padding: 10px;
        background: #2a2a2a;
        border-radius: 5px;
        border-left: 4px solid #d4af37;
    `;
    
    selectorContainer.innerHTML = `
        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #d4af37;">
            🗺️ Seleccionar Estado Mexicano
        </label>
        <select id="estadoSelector" style="
            width: 100%;
            padding: 8px;
            background: #1a1a1a;
            color: white;
            border: 1px solid #444;
            border-radius: 3px;
            font-size: 0.9em;
        ">
            <option value="">-- Selecciona un estado --</option>
        </select>
        <div id="estadoInfo" style="margin-top: 10px; font-size: 0.85em; color: #ccc; display: none;"></div>
    `;
    
    formGroup.parentNode.insertBefore(selectorContainer, formGroup);
    
    // Cargar estados en el selector
    loadEstados().then(estados => {
        if (!estados || Object.keys(estados).length === 0) return;
        
        const selector = document.getElementById('estadoSelector');
        Object.keys(estados).sort().forEach(estadoNombre => {
            const option = document.createElement('option');
            option.value = estadoNombre;
            option.textContent = estadoNombre;
            selector.appendChild(option);
        });
        
        // Agregar evento de cambio
        selector.addEventListener('change', function() {
            const estadoInfo = document.getElementById('estadoInfo');
            if (this.value) {
                const estado = obtenerEstado(this.value);
                if (estado) {
                    estadoInfo.innerHTML = `
                        <strong>${estado.historia_dominante || 'Sin historia dominante'}</strong>
                        <br>${estado.leyendas_y_mitos ? estado.leyendas_y_mitos[0] : 'Sin leyendas documentadas'}
                    `;
                    estadoInfo.style.display = 'block';
                }
            } else {
                estadoInfo.style.display = 'none';
            }
        });
    });
}

// Mostrar estadisticas de estados y lugares
async function showGeografiaStats() {
    await loadEstados();
    await loadLugaresDetallados();
    
    if (!estadosDB || !lugaresDetalladosDB) {
        console.log('Datos geograficos no disponibles');
        return null;
    }
    
    const stats = {
        estados: {
            total: Object.keys(estadosDB).length,
            conLeyendas: 0,
            conElementos: 0
        },
        lugares: {
            total: Object.keys(lugaresDetalladosDB).length,
            porTipo: {}
        }
    };
    
    // Estadisticas de estados
    Object.values(estadosDB).forEach(estado => {
        if (estado.leyendas_y_mitos && estado.leyendas_y_mitos.length > 0) {
            stats.estados.conLeyendas++;
        }
        if (estado.elementos && estado.elementos.length > 0) {
            stats.estados.conElementos++;
        }
    });
    
    // Estadisticas de lugares
    Object.values(lugaresDetalladosDB).forEach(lugar => {
        stats.lugares.porTipo[lugar.tipo] = (stats.lugares.porTipo[lugar.tipo] || 0) + 1;
    });
    
    console.log('Estadisticas Geograficas:', stats);
    return stats;
}

// Obtener leyendas aleatorias de un estado
function obtenerLeyendasAleatorias(estadoNombre, cantidad = 2) {
    const estado = obtenerEstado(estadoNombre);
    if (!estado || !estado.leyendas_y_mitos) return [];
    
    const leyendas = [...estado.leyendas_y_mitos];
    return shuffleArray(leyendas).slice(0, cantidad);
}

// Obtener elementos sensoriales de un estado
function obtenerElementosSensoriales(estadoNombre) {
    const estado = obtenerEstado(estadoNombre);
    if (!estado || !estado.experiencia_sensorial) return null;
    
    return estado.experiencia_sensorial;
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

// Inicializar sistema geografico
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addEstadoSelector();
        showGeografiaStats();
    }, 1500);
});
