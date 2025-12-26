
/**
 * TERROR MEXICANO - GENERADOR LOCAL DE HISTORIAS
 * Generación de historias sin API usando plantillas y algoritmos
 */

/**
 * Generar historia localmente
 */
async function generateLocalStory(formData) {
    console.log('📝 Generando historia localmente...', formData);
    
    // Obtener datos enriquecidos
    const personajePrincipal = await obtenerPersonajePrincipal(formData);
    const antagonista = await obtenerAntagonista(formData);
    const escenario = await generarEscenario(formData);
    
    // Generar componentes de la historia
    const introduccion = generarIntroduccion(personajePrincipal, escenario);
    const desarrollo = generarDesarrollo(personajePrincipal, antagonista, formData.trama);
    const climax = generarClimax(antagonista, formData.terrorTypes);
    const final = generarFinal(formData.terrorTypes);
    
    // Combinar la historia
    const historiaCompleta = `
        ${introduccion}
        
        ${desarrollo}
        
        ${climax}
        
        ${final}
    `;
    
    return {
        titulo: generarTitulo(personajePrincipal, antagonista, escenario),
        contenido: historiaCompleta,
        metadata: {
            estado: formData.estado,
            terrorTypes: formData.terrorTypes,
            epoca: formData.epoca,
            personajePrincipal: personajePrincipal?.nombre,
            antagonista: antagonista?.nombre
        }
    };
}

/**
 * Obtener personaje principal
 */
async function obtenerPersonajePrincipal(formData) {
    // Si hay personajes específicos en el textarea, usar el primero
    if (formData.personajes) {
        const lineas = formData.personajes.split('\n').filter(l => l.trim());
        if (lineas.length > 0) {
            const primeraLinea = lineas[0];
            // Parsear formato: "Nombre, Género, Edad: Descripción"
            const match = primeraLinea.match(/([^,]+),\s*([^,]+),\s*(\d+)\s*años?:\s*(.+)/);
            if (match) {
                return {
                    nombre: match[1].trim(),
                    genero: match[2].trim(),
                    edad: parseInt(match[3]),
                    descripcion: match[4].trim()
                };
            }
        }
    }
    
    // Si no, usar un personaje aleatorio de la base de datos
    if (window.MODULOS_PERSONAJES && window.MODULOS_PERSONAJES.length > 0) {
        const aleatorio = window.MODULOS_PERSONAJES[Math.floor(Math.random() * window.MODULOS_PERSONAJES.length)];
        return aleatorio;
    }
    
    // Personaje por defecto
    return {
        nombre: "Alex",
        genero: "Masculino",
        edad: 30,
        descripcion: "Personaje en una situación de terror inexplicable"
    };
}

/**
 * Obtener antagonista
 */
async function obtenerAntagonista(formData) {
    // Si hay un antagonista seleccionado
    if (formData.antagonista && window.MODULOS_ANTAGONISTAS) {
        const antagonista = window.MODULOS_ANTAGONISTAS.find(a => a.id === formData.antagonista);
        if (antagonista) return antagonista;
    }
    
    // Antagonista aleatorio compatible con los tipos de terror
    if (window.MODULOS_ANTAGONISTAS && window.MODULOS_ANTAGONISTAS.length > 0) {
        const compatibles = window.MODULOS_ANTAGONISTAS.filter(a => 
            a.contextos && a.contextos.some(ctx => 
                formData.terrorTypes.some(tipo => ctx.includes(tipo))
            )
        );
        
        if (compatibles.length > 0) {
            return compatibles[Math.floor(Math.random() * compatibles.length)];
        }
        
        // Si no hay compatibles, usar cualquier antagonista
        return window.MODULOS_ANTAGONISTAS[Math.floor(Math.random() * window.MODULOS_ANTAGONISTAS.length)];
    }
    
    // Antagonista por defecto
    return {
        nombre: "La Sombra",
        descripcion: "Una presencia oscura que acecha en la noche",
        tipo: "entidad",
        manifestacion: "Sombras que se mueven, frío inexplicable"
    };
}

/**
 * Generar escenario
 */
async function generarEscenario(formData) {
    let lugar = formData.lugar;
    let estado = formData.estado;
    
    // Si no hay lugar específico, generar uno
    if (!lugar && window.MODULOS_LUGARES && window.MODULOS_LUGARES.length > 0) {
        const lugarAleatorio = window.MODULOS_LUGARES[Math.floor(Math.random() * window.MODULOS_LUGARES.length)];
        lugar = `${lugarAleatorio.nombre}: ${lugarAleatorio.descripcion}`;
    }
    
    // Si no hay estado, usar uno aleatorio
    if (!estado && window.estadosDB) {
        const estados = Object.keys(window.estadosDB);
        estado = estados[Math.floor(Math.random() * estados.length)];
    }
    
    return {
        lugar: lugar || "Un lugar olvidado por el tiempo",
        estado: estado || "México",
        epoca: formData.epoca || "Actualidad"
    };
}

/**
 * Generar introducción
 */
function generarIntroduccion(personaje, escenario) {
    const introducciones = [
        `En las profundidades de ${escenario.estado}, durante ${escenario.epoca.toLowerCase()}, ${personaje.nombre} se encontraba en ${escenario.lugar}. Lo que comenzó como una situación ordinaria pronto se convertiría en una pesadilla de la que no podría despertar.`,
        
        `La vida de ${personaje.nombre} siempre había sido normal, hasta que llegó a ${escenario.lugar} en ${escenario.estado}. En la ${escenario.epoca.toLowerCase()}, las sombras comenzaron a cobrar vida propia.`,
        
        `${escenario.estado} guardaba secretos que ${personaje.nombre} nunca imaginó. En ${escenario.lugar}, durante ${escenario.epoca.toLowerCase()}, descubriría que algunas historias de terror son más reales de lo que se cree.`
    ];
    
    return introducciones[Math.floor(Math.random() * introducciones.length)];
}

/**
 * Generar desarrollo
 */
function generarDesarrollo(personaje, antagonista, trama) {
    let desarrollo = "";
    
    // Si hay trama específica del usuario, usarla
    if (trama && trama.trim()) {
        desarrollo += `${trama}\n\n`;
    }
    
    // Añadir elementos del antagonista
    if (antagonista.manifestacion) {
        desarrollo += `Poco a poco, ${personaje.nombre} comenzó a notar señales extrañas: ${antagonista.manifestacion}. `;
    }
    
    // Desarrollar según el tipo de antagonista
    if (antagonista.tipo === 'fantasmal') {
        desarrollo += `Las apariciones se hicieron más frecuentes, cada vez más cercanas, más reales. ${personaje.nombre} intentaba convencerse de que era su imaginación, pero los hechos eran innegables.`;
    } else if (antagonista.tipo === 'humano') {
        desarrollo += `Lo que parecía ser una persona normal resultó ser algo mucho más siniestro. ${personaje.nombre} descubrió patrones, coincidencias que no podían ser casualidad.`;
    } else {
        desarrollo += `La presencia se manifestaba de formas cada vez más aterradoras. ${personaje.nombre} sentía que estaba perdiendo el control de la realidad.`;
    }
    
    return desarrollo;
}

/**
 * Generar clímax
 */
function generarClimax(antagonista, terrorTypes) {
    const climaxes = {
        'paranormal': [
            `El aire se espesó hasta hacerse irrespirable. Las sombras se retorcieron formando figuras imposibles, y un frío glacial se apoderó del ambiente. La entidad se reveló en toda su terrible gloria.`,
            `Los objetos comenzaron a flotar, las paredes sangraron, y los susurros se convirtieron en gritos ensordecedores. La barrera entre los mundos se había roto.`
        ],
        'psicológico': [
            `La línea entre la realidad y la locura se desvaneció por completo. ¿Eran recuerdos reales o implantados? ¿Era víctima o verdugo? La verdad resultó ser más aterradora que cualquier pesadilla.`,
            `Cada pensamiento se sentía ajeno, cada recuerdo parecía manipulado. El terror no venía de fuera, sino de la propia mente, corrompida y traicionera.`
        ],
        'gótico': [
            `Bajo la luz de la luna llena, los secretos ancestrales salieron a la luz. Los retratos en las paredes parecían seguir cada movimiento, y los ecos del pasado resonaban en los pasillos vacíos.`,
            `La maldición familiar se manifestó en toda su crudeza. Los pecados de los antepasados exigían su precio, y la sangre siempre encuentra su camino.`
        ],
        'folk horror': [
            `Los rituales antiguos despertaron fuerzas que nunca debieron ser perturbadas. La tierra misma parecía enfurecerse, y las criaturas de las leyendas resultaron ser reales.`,
            `Las tradiciones del pueblo escondían una verdad oscura. Los sacrificios no eran metáforas, y los dioses antiguos aún exigían adoración.`
        ]
    };
    
    // Buscar climaxes para los tipos de terror seleccionados
    for (const tipo of terrorTypes) {
        if (climaxes[tipo] && climaxes[tipo].length > 0) {
            return climaxes[tipo][Math.floor(Math.random() * climaxes[tipo].length)];
        }
    }
    
    // Climax genérico
    return `El enfrentamiento final llegó cuando la verdad fue revelada. El horror que acechaba en las sombras mostró su verdadero rostro, y nada volvería a ser igual.`;
}

/**
 * Generar final
 */
function generarFinal(terrorTypes) {
    const finales = {
        'paranormal': [
            `La entidad fue contenida, pero no destruida. Algunas noches, cuando el viento sopla de cierta manera, aún se pueden escuchar sus susurros en la oscuridad.`,
            `El lugar fue abandonado, pero la maldición persistió. Quienes se atreven a mencionar lo ocurrido dicen que las apariciones continúan, esperando nuevas víctimas.`
        ],
        'psicológico': [
            `Nunca se supo con certeza qué fue real y qué fue producto de una mente fracturada. Algunas verdades son tan terribles que la locura es el único refugio.`,
            `La terapia ayudó a sobrellevar el trauma, pero las pesadillas persisten. A veces, en el borde del sueño, los recuerdos regresan con toda su fuerza aterradora.`
        ],
        'gótico': [
            `La mansión fue sellada, pero los lugareños juran que en las noches de luna llena aún se ven luces en las ventanas superiores. La maldición familiar continúa.`,
            `Los documentos fueron quemados, los retratos destruidos, pero algunos secretos son demasiado persistentes para morir. La sangre siempre recuerda.`
        ],
        'folk horror': [
            `El pueblo recuperó su tranquilidad, pero los rituales antiguos continúan en secreto. La tierra tiene memoria, y algunos pactos son eternos.`,
            `Los jóvenes abandonaron el lugar, pero los ancianos permanecen, vigilantes. Saben que las fuerzas que despertaron solo esperan el momento adecuado para regresar.`
        ]
    };
    
    // Buscar finales para los tipos de terror
    for (const tipo of terrorTypes) {
        if (finales[tipo] && finales[tipo].length > 0) {
            return finales[tipo][Math.floor(Math.random() * finales[tipo].length)];
        }
    }
    
    // Final genérico
    return `La pesadilla terminó, pero las cicatrices permanecieron. Algunos horrores nunca nos abandonan completamente, solo esperan en la oscuridad, pacientemente.`;
}

/**
 * Generar título
 */
function generarTitulo(personaje, antagonista, escenario) {
    const titulos = [
        `El secreto de ${escenario.lugar.split(':')[0]}`,
        `La maldición de ${antagonista.nombre}`,
        `Las sombras de ${escenario.estado}`,
        `${personaje.nombre} y el horror en ${escenario.lugar.split(':')[0]}`,
        `Lo que susurra la noche en ${escenario.estado}`,
        `El precio de recordar en ${escenario.epoca}`,
        `La entidad de ${antagonista.nombre}`,
        `Pesadilla en ${escenario.lugar.split(':')[0]}`
    ];
    
    return titulos[Math.floor(Math.random() * titulos.length)];
}