
/**
 * TERROR MEXICANO - APP PRINCIPAL
 * Controlador principal de la aplicación
 */

// Estado global de la aplicación
const appState = {
    datosCargados: false,
    estadosCargados: false,
    historiasGeneradas: 0
};

/**
 * Inicializar la aplicación
 */
async function initializeApp() {
    console.log('🎭 Inicializando Generador de Terror Mexicano...');
    
    try {
        // Cargar estados en el selector
        await cargarEstadosSelector();
        
        // Inicializar selectores de módulos
        inicializarSelectoresModulares();
        
        // Configurar eventos
        configurarEventos();
        
        // Mostrar estadísticas iniciales
        actualizarEstadisticasGlobales();
        
        appState.datosCargados = true;
        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
    }
}

/**
 * Cargar estados en el selector
 */
async function cargarEstadosSelector() {
    const selector = document.getElementById('estado');
    if (!selector) return;
    
    try {
        // Cargar datos de estados
        await loadEstados();
        
        if (window.estadosDB) {
            Object.keys(window.estadosDB).sort().forEach(estado => {
                const option = document.createElement('option');
                option.value = estado;
                option.textContent = estado;
                selector.appendChild(option);
            });
            appState.estadosCargados = true;
        }
    } catch (error) {
        console.warn('No se pudieron cargar los estados:', error);
    }
}

/**
 * Inicializar selectores modulares
 */
function inicializarSelectoresModulares() {
    // Personajes predefinidos
    const selectorPersonajes = document.getElementById('personajes-predefinidos');
    if (selectorPersonajes && window.MODULOS_PERSONAJES) {
        selectorPersonajes.innerHTML = '';
        window.MODULOS_PERSONAJES.forEach(personaje => {
            const option = document.createElement('option');
            option.value = personaje.id;
            option.textContent = `${personaje.nombre} (${personaje.edad} años) - ${personaje.descripcion.substring(0, 80)}...`;
            selectorPersonajes.appendChild(option);
        });
    }
    
    // Antagonistas predefinidos
    const selectorAntagonistas = document.getElementById('antagonista');
    if (selectorAntagonistas && window.MODULOS_ANTAGONISTAS) {
        selectorAntagonistas.innerHTML = '<option value="">Selecciona un antagonista...</option>';
        window.MODULOS_ANTAGONISTAS.forEach(antagonista => {
            const option = document.createElement('option');
            option.value = antagonista.id;
            option.textContent = `${antagonista.nombre} - ${antagonista.descripcion.substring(0, 100)}...`;
            selectorAntagonistas.appendChild(option);
        });
    }
    
    // Lugares predefinidos
    const selectorLugares = document.getElementById('lugar-predefinido');
    if (selectorLugares && window.MODULOS_LUGARES) {
        selectorLugares.innerHTML = '<option value="">Ninguno (escribiré mi propio lugar)</option>';
        window.MODULOS_LUGARES.forEach(lugar => {
            const option = document.createElement('option');
            option.value = lugar.id;
            option.textContent = `${lugar.nombre} - ${lugar.descripcion.substring(0, 80)}...`;
            selectorLugares.appendChild(option);
        });
    }
    
    // Épocas predefinidas
    const selectorEpocas = document.getElementById('epoca-predefinida');
    if (selectorEpocas && window.MODULOS_EPOCAS) {
        selectorEpocas.innerHTML = '<option value="">Ninguna (escribiré mi propia época)</option>';
        window.MODULOS_EPOCAS.forEach(epoca => {
            const option = document.createElement('option');
            option.value = epoca.id;
            option.textContent = epoca.nombre;
            selectorEpocas.appendChild(option);
        });
    }
}

/**
 * Configurar eventos de la aplicación
 */
function configurarEventos() {
    // Evento para lugar predefinido
    const selectorLugar = document.getElementById('lugar-predefinido');
    if (selectorLugar) {
        selectorLugar.addEventListener('change', function() {
            const textareaLugar = document.getElementById('lugar');
            if (this.value && window.MODULOS_LUGARES) {
                const lugar = window.MODULOS_LUGARES.find(l => l.id === this.value);
                if (lugar) {
                    textareaLugar.value = `${lugar.nombre}: ${lugar.descripcion}\nAtmosfera: ${lugar.atmosfera}`;
                }
            }
        });
    }
    
    // Evento para época predefinida
    const selectorEpoca = document.getElementById('epoca-predefinida');
    if (selectorEpoca) {
        selectorEpoca.addEventListener('change', function() {
            const inputEpoca = document.getElementById('epoca');
            if (this.value && window.MODULOS_EPOCAS) {
                const epoca = window.MODULOS_EPOCAS.find(e => e.id === this.value);
                if (epoca) {
                    inputEpoca.value = epoca.nombre;
                }
            }
        });
    }
    
    // Evento para personajes predefinidos
    const selectorPersonajes = document.getElementById('personajes-predefinidos');
    if (selectorPersonajes) {
        selectorPersonajes.addEventListener('change', function() {
            const selectedOptions = Array.from(this.selectedOptions);
            const textareaPersonajes = document.getElementById('personajes-custom');
            
            if (selectedOptions.length > 0 && window.MODULOS_PERSONAJES) {
                const personajesTexto = selectedOptions.map(option => {
                    const personaje = window.MODULOS_PERSONAJES.find(p => p.id === option.value);
                    return personaje ? 
                        `${personaje.nombre}, ${personaje.genero}, ${personaje.edad} años: ${personaje.descripcion}` : 
                        '';
                }).filter(text => text).join('\n');
                
                textareaPersonajes.value = personajesTexto;
            }
        });
    }
}

/**
 * Cargar información del estado seleccionado
 */
function loadStateInfo() {
    const estadoSelect = document.getElementById('estado');
    const stateInfo = document.getElementById('stateInfo');
    
    if (!estadoSelect || !stateInfo) return;
    
    const estadoNombre = estadoSelect.value;
    if (!estadoNombre) {
        stateInfo.innerHTML = '';
        return;
    }
    
    const estado = obtenerEstado(estadoNombre);
    if (estado) {
        stateInfo.innerHTML = `
            <div style="background: #2a2a2a; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #d4af37;">
                <h4 style="margin: 0 0 10px 0; color: #d4af37;">${estadoNombre}</h4>
                <p style="margin: 5px 0; font-size: 0.9em;"><strong>Historia:</strong> ${estado.historia_dominante || 'No especificada'}</p>
                <p style="margin: 5px 0; font-size: 0.9em;"><strong>Atmósfera:</strong> ${estado.atmosfera || 'No especificada'}</p>
                ${estado.leyendas_y_mitos ? 
                    `<p style="margin: 5px 0; font-size: 0.9em;"><strong>Leyenda:</strong> ${estado.leyendas_y_mitos[0]}</p>` : 
                    ''
                }
            </div>
        `;
    }
}

/**
 * Sugerir personajes aleatorios
 */
function sugerirPersonajesAleatorios() {
    if (!window.MODULOS_PERSONAJES || window.MODULOS_PERSONAJES.length === 0) {
        alert('No hay personajes disponibles en la base de datos');
        return;
    }
    
    const personajesAleatorios = [];
    const indicesUsados = new Set();
    
    // Seleccionar 2-3 personajes aleatorios únicos
    while (personajesAleatorios.length < 3 && indicesUsados.size < window.MODULOS_PERSONAJES.length) {
        const indiceAleatorio = Math.floor(Math.random() * window.MODULOS_PERSONAJES.length);
        if (!indicesUsados.has(indiceAleatorio)) {
            personajesAleatorios.push(window.MODULOS_PERSONAJES[indiceAleatorio]);
            indicesUsados.add(indiceAleatorio);
        }
    }
    
    const textareaPersonajes = document.getElementById('personajes-custom');
    const textoPersonajes = personajesAleatorios.map(p => 
        `${p.nombre}, ${p.genero}, ${p.edad} años: ${p.descripcion}`
    ).join('\n\n');
    
    textareaPersonajes.value = textoPersonajes;
    
    // También seleccionar en el selector múltiple
    const selectorPersonajes = document.getElementById('personajes-predefinidos');
    if (selectorPersonajes) {
        // Deseleccionar todo primero
        Array.from(selectorPersonajes.options).forEach(option => {
            option.selected = false;
        });
        
        // Seleccionar los personajes sugeridos
        personajesAleatorios.forEach(personaje => {
            const option = Array.from(selectorPersonajes.options).find(opt => opt.value === personaje.id);
            if (option) {
                option.selected = true;
            }
        });
    }
}

/**
 * Validar formulario antes de generar historia
 */
function validarFormulario() {
    const trama = document.getElementById('trama').value.trim();
    
    if (!trama) {
        alert('⚠️ Por favor, describe la trama principal de tu historia. Este campo es obligatorio.');
        document.getElementById('trama').focus();
        return false;
    }
    
    const terrorTypes = getSelectedTerrorTypes();
    if (terrorTypes.length === 0) {
        alert('⚠️ Por favor, selecciona al menos un tipo de terror.');
        return false;
    }
    
    return true;
}

/**
 * Obtener tipos de terror seleccionados
 */
function getSelectedTerrorTypes() {
    const checkboxes = document.querySelectorAll('input[name="terrorTypes"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Generar historia principal
 */
async function generateStory() {
    if (!validarFormulario()) {
        return;
    }
    
    // Mostrar loading
    const button = document.querySelector('.btn-primary');
    const originalText = button.textContent;
    button.textContent = '⏳ Generando...';
    button.disabled = true;
    
    try {
        // Obtener datos del formulario
        const formData = obtenerDatosFormulario();
        
        // Enriquecer con datos de la base de datos
        const formDataEnriquecido = await enrichPromptWithDatabase(formData);
        
        // Generar historia
        let historia;
        if (document.getElementById('useApi')?.checked) {
            historia = await generateWithAPI(formDataEnriquecido);
        } else {
            historia = await generateLocalStory(formDataEnriquecido);
        }
        
        // Mostrar resultado
        mostrarHistoria(historia);
        
        // Actualizar estadísticas
        appState.historiasGeneradas++;
        actualizarEstadisticasGlobales();
        
    } catch (error) {
        console.error('Error generando historia:', error);
        alert('❌ Error generando la historia. Por favor, intenta de nuevo.');
    } finally {
        // Restaurar botón
        button.textContent = originalText;
        button.disabled = false;
    }
}

/**
 * Obtener datos del formulario
 */
function obtenerDatosFormulario() {
    const terrorTypes = getSelectedTerrorTypes();
    
    return {
        estado: document.getElementById('estado').value,
        terrorTypes: terrorTypes,
        personajes: document.getElementById('personajes-custom').value,
        antagonista: document.getElementById('antagonista').value,
        lugar: document.getElementById('lugar').value,
        epoca: document.getElementById('epoca').value,
        trama: document.getElementById('trama').value,
        elementos: document.getElementById('elementos').value,
        useApi: document.getElementById('useApi')?.checked || false,
        apiProvider: document.querySelector('input[name="apiProvider"]:checked')?.value || 'claude',
        apiKey: document.getElementById('apiKey')?.value || ''
    };
}

/**
 * Mostrar historia generada
 */
function mostrarHistoria(historia) {
    const resultPanel = document.getElementById('result');
    const storyOutput = document.getElementById('storyOutput');
    const formPanel = document.getElementById('form-panel');
    
    if (!resultPanel || !storyOutput || !formPanel) return;
    
    storyOutput.innerHTML = `
        <div class="story-content">
            <div class="story-header">
                <h3 style="color: #d4af37; border-bottom: 2px solid #8b4513; padding-bottom: 10px;">
                    ${historia.titulo || 'Historia de Terror'}
                </h3>
            </div>
            <div class="story-body">
                ${historia.contenido || historia}
            </div>
            ${historia.metadata ? `
                <div class="story-metadata" style="margin-top: 20px; padding: 15px; background: #2a2a2a; border-radius: 5px;">
                    <h4 style="color: #d4af37; margin-top: 0;">Elementos Utilizados</h4>
                    <p><strong>Estado:</strong> ${historia.metadata.estado || 'No especificado'}</p>
                    <p><strong>Tipos de Terror:</strong> ${historia.metadata.terrorTypes?.join(', ') || 'No especificados'}</p>
                    <p><strong>Época:</strong> ${historia.metadata.epoca || 'No especificada'}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    // Mostrar panel de resultados y ocultar formulario
    formPanel.style.display = 'none';
    resultPanel.style.display = 'block';
    
    // Scroll to result
    resultPanel.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Resetear formulario
 */
function resetForm() {
    const resultPanel = document.getElementById('result');
    const formPanel = document.getElementById('form-panel');
    
    if (resultPanel && formPanel) {
        resultPanel.style.display = 'none';
        formPanel.style.display = 'block';
        
        // Reset form (opcional - puedes mantener los valores si quieres)
        // document.getElementById('storyForm').reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Toggle API configuration
 */
function toggleApiConfig() {
    const useApi = document.getElementById('useApi');
    const apiConfig = document.getElementById('apiConfig');
    
    if (useApi && apiConfig) {
        apiConfig.style.display = useApi.checked ? 'block' : 'none';
    }
}

/**
 * Actualizar estadísticas globales
 */
function actualizarEstadisticasGlobales() {
    const statsElement = document.getElementById('moduleStats');
    const dbStatsElement = document.getElementById('dbStats');
    
    if (statsElement && window.MODULOS_PERSONAJES) {
        const stats = `
            ${window.MODULOS_PERSONAJES.length} personajes • 
            ${window.MODULOS_ANTAGONISTAS.length} antagonistas • 
            ${window.MODULOS_LUGARES.length} lugares • 
            ${window.MODULOS_EPOCAS.length} épocas •
            ${appState.historiasGeneradas} historias
        `;
        statsElement.textContent = stats;
    }
    
    if (dbStatsElement) {
        dbStatsElement.textContent = appState.datosCargados ? 'Sistema Listo ✓' : 'Cargando...';
        dbStatsElement.style.color = appState.datosCargados ? '#00ff00' : '#d4af37';
    }
}

/**
 * Exportar historia
 */
function exportStory(format) {
    const storyOutput = document.getElementById('storyOutput');
    if (!storyOutput) return;
    
    const contenido = storyOutput.innerText || storyOutput.textContent;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `historia-terror-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Configurar API key si existe en localStorage
    const savedApiKey = localStorage.getItem('terrorMexicano_apiKey');
    if (savedApiKey && document.getElementById('apiKey')) {
        document.getElementById('apiKey').value = savedApiKey;
    }
    
    // Guardar API key cuando cambie
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('change', function() {
            if (this.value) {
                localStorage.setItem('terrorMexicano_apiKey', this.value);
            }
        });
    }
});
