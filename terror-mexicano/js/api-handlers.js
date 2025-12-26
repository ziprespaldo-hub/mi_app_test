/**
 * TERROR MEXICANO - MANEJADORES DE API
 * Gestión de APIs externas para generación de historias
 */

/**
 * Generar historia usando API
 */
async function generateWithAPI(formData) {
    console.log('🌐 Generando historia con API...', formData);
    
    const apiKey = formData.apiKey || localStorage.getItem('terrorMexicano_apiKey');
    if (!apiKey) {
        throw new Error('No se encontró API Key configurada');
    }
    
    const prompt = construirPromptAPI(formData);
    
    try {
        let resultado;
        
        switch (formData.apiProvider) {
            case 'openai':
                resultado = await generateWithOpenAI(apiKey, prompt);
                break;
            case 'claude':
                resultado = await generateWithClaude(apiKey, prompt);
                break;
            case 'gemini':
                resultado = await generateWithGemini(apiKey, prompt);
                break;
            case 'openrouter':
                resultado = await generateWithOpenRouter(apiKey, prompt);
                break;
            default:
                throw new Error(`Proveedor de API no soportado: ${formData.apiProvider}`);
        }
        
        return {
            titulo: extraerTitulo(resultado) || generarTituloDesdePrompt(formData),
            contenido: resultado,
            metadata: {
                estado: formData.estado,
                terrorTypes: formData.terrorTypes,
                epoca: formData.epoca,
                generadoCon: formData.apiProvider
            }
        };
        
    } catch (error) {
        console.error('Error con API:', error);
        throw new Error(`Error de API: ${error.message}`);
    }
}

/**
 * Construir prompt para API
 */
function construirPromptAPI(formData) {
    const elementos = [];
    
    // Estado y ubicación
    if (formData.estado) {
        elementos.push(`**Ubicación:** ${formData.estado}, México`);
    }
    
    // Época
    if (formData.epoca) {
        elementos.push(`**Época:** ${formData.epoca}`);
    }
    
    // Tipos de terror
    if (formData.terrorTypes.length > 0) {
        elementos.push(`**Géneros de terror:** ${formData.terrorTypes.join(', ')}`);
    }
    
    // Personajes
    if (formData.personajes) {
        elementos.push(`**Personajes:**\n${formData.personajes}`);
    }
    
    // Antagonista
    if (formData.antagonista && window.MODULOS_ANTAGONISTAS) {
        const antagonista = window.MODULOS_ANTAGONISTAS.find(a => a.id === formData.antagonista);
        if (antagonista) {
            elementos.push(`**Antagonista/Entidad:** ${antagonista.nombre} - ${antagonista.descripcion}`);
            if (antagonista.manifestacion) {
                elementos.push(`**Manifestaciones:** ${antagonista.manifestacion}`);
            }
        }
    }
    
    // Lugar
    if (formData.lugar) {
        elementos.push(`**Escenario principal:** ${formData.lugar}`);
    }
    
    // Trama (obligatoria)
    elementos.push(`**Trama principal:** ${formData.trama}`);
    
    // Elementos adicionales
    if (formData.elementos) {
        elementos.push(`**Elementos de terror adicionales:** ${formData.elementos}`);
    }
    
    const prompt = `
Eres un escritor experto en cuentos de terror mexicano. Escribe una historia de terror original y aterradora basada en los siguientes elementos:

${elementos.join('\n\n')}

**INSTRUCCIONES ESPECÍFICAS:**
- Escribe en español, con un estilo literario de alta calidad
- Mantén un tono oscuro, atmosférico y genuinamente aterrador
- Desarrolla personajes creíbles con motivaciones claras
- Incluye elementos del folclore y cultura mexicana cuando sea apropiado
- La historia debe tener: introducción, desarrollo, clímax y final
- Longitud: 800-1200 palabras
- Incluye un título creativo al inicio
- Usa descripciones sensoriales (sonidos, olores, texturas, temperaturas)
- Crea tensión gradual y momentos de terror genuino

**FORMATO DE RESPUESTA:**
Comienza directamente con el título en la primera línea, seguido de la historia completa.
    `.trim();
    
    return prompt;
}

/**
 * Generar con OpenAI
 */
async function generateWithOpenAI(apiKey, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un escritor profesional de terror especializado en narrativa mexicana. Escribe historias originales, aterradoras y literariamente sofisticadas.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.8
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Generar con Claude
 */
async function generateWithClaude(apiKey, prompt) {
    // Claude a través de OpenRouter
    return await generateWithOpenRouter(apiKey, prompt, 'claude-3-sonnet');
}

/**
 * Generar con Gemini
 */
async function generateWithGemini(apiKey, prompt) {
    // Gemini a través de OpenRouter
    return await generateWithOpenRouter(apiKey, prompt, 'gemini-pro');
}

/**
 * Generar con OpenRouter
 */
async function generateWithOpenRouter(apiKey, prompt, model = 'openai/gpt-4') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Generador de Terror Mexicano'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'Eres un escritor profesional de terror especializado en narrativa mexicana. Escribe historias originales, aterradoras y literariamente sofisticadas.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.8
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Extraer título del contenido generado
 */
function extraerTitulo(contenido) {
    // Buscar la primera línea como título
    const lineas = contenido.split('\n').filter(l => l.trim());
    if (lineas.length > 0) {
        const primeraLinea = lineas[0].trim();
        // Si la primera línea parece un título (sin punto, no muy largo)
        if (primeraLinea.length < 100 && !primeraLinea.includes('.') && !primeraLinea.toLowerCase().includes('érase')) {
            return primeraLinea;
        }
    }
    return null;
}

/**
 * Generar título desde el prompt si no se pudo extraer
 */
function generarTituloDesdePrompt(formData) {
    const elementos = [];
    if (formData.estado) elementos.push(formData.estado);
    if (formData.epoca) elementos.push(formData.epoca);
    if (formData.terrorTypes.length > 0) elementos.push(formData.terrorTypes[0]);
    
    const titulos = [
        `El horror en ${elementos[0] || 'la oscuridad'}`,
        `Lo que susurra la noche`,
        `La maldición olvidada`,
        `Sombras del pasado`,
        `El precio de la verdad`,
        `Voces en el silencio`,
        `El reflejo distorsionado`,
        `La entidad sin nombre`
    ];
    
    return titulos[Math.floor(Math.random() * titulos.length)];
}