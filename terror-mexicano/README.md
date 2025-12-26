# 🇲🇽 Generador de Historias de Terror Mexicanas

Aplicación web para crear historias de terror originales e inéditas basadas en los 32 estados de la República Mexicana, siguiendo los cánones de la literatura de terror hispana.

## 📖 Descripción

Este generador literario permite crear narrativas de terror completamente originales, evitando arquetipos tradicionales (La Llorona, Charro Negro, etc.) y enfocándose en crear atmósferas auténticas usando elementos culturales de cada estado mexicano como contexto, no como protagonistas.

## ✨ Características

- **32 Estados Mexicanos**: Cada uno con datos geográficos, atmosféricos y elementos culturales específicos
- **9 Tipos de Terror**: Gótico, Psicológico, Sobrenatural, Cósmico, Paranormal, Folk Horror, Gore, Urbano, Casas Encantadas
- **Generación Dual**:
  - **Con API**: OpenRouter, OpenAI, Gemini, Claude (requiere API key)
  - **Sin API**: Sistema de plantillas inteligentes
- **Estructura Narrativa**: Siguiendo los elementos del cuento de terror (suspense, atmósfera inquietante, personajes, estructura narrativa)
- **Exportación**: Descarga tus historias en formato TXT o Markdown

## 🛠️ Instalación

1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador
3. ¡Listo! No requiere servidor ni instalación adicional

```bash
# Si quieres usar un servidor local (opcional)
python -m http.server 8000
# o
npx serve
```

## 📝 Uso

### Paso 1: Seleccionar Estado
Elige uno de los 32 estados mexicanos. El sistema cargará automáticamente elementos culturales y atmosféricos del estado.

### Paso 2: Configurar API (Opcional)
- Marca la casilla "Usar API para generación avanzada"
- Selecciona tu proveedor (OpenRouter, OpenAI, Gemini, Claude)
- Ingresa tu API key (se guarda localmente en tu navegador)

### Paso 3: Seleccionar Tipos de Terror
Marca uno o varios tipos de terror que deseas combinar en tu historia.

### Paso 4: Proporcionar Elementos
Completa los campos con TUS elementos:
- **Personajes**: Describe quiénes son, sus características, roles
- **Lugar Específico**: Describe el lugar donde ocurre la historia
- **Época/Tiempo**: Cuándo sucede (presente, años 80, colonial, etc.)
- **Trama/Conflicto**: Qué sucede, el conflicto principal
- **Elementos Adicionales** (opcional): Objetos, situaciones específicas

### Paso 5: Generar
Click en "Generar Historia de Terror" y espera a que se genere tu narrativa.

### Paso 6: Exportar
Descarga tu historia en formato TXT o Markdown.

## 🎨 Elementos Narrativos

El generador respeta la estructura del cuento de terror:

1. **Introducción** (2 párrafos): Panorámica vaga sin revelar trama
2. **Planteamiento**: Presentación de personajes, lugar, tiempo
3. **Nudo/Desarrollo**: Escalada de tensión hasta el clímax
4. **Desenlace**: Resolución o final abierto perturbador

### Técnicas Literarias Implementadas
- Descripciones sensoriales detalladas
- Ritmo variable (frases largas + oraciones cortas)
- Ambigüedad sobre la amenaza
- Transgresión de lo cotidiano
- Aislamiento y vulnerabilidad
- Simbolismo sutil

## 🔑 APIs Soportadas

### OpenAI
```javascript
Modelo: gpt-4-turbo-preview
URL: https://api.openai.com/v1/chat/completions
```

### Claude (Anthropic)
```javascript
Modelo: claude-3-5-sonnet-20241022
URL: https://api.anthropic.com/v1/messages
```

### Gemini (Google)
```javascript
Modelo: gemini-pro
URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### OpenRouter
```javascript
Modelo: anthropic/claude-3.5-sonnet
URL: https://openrouter.ai/api/v1/chat/completions
```

## 📚 Base de Datos

El archivo `data/estados.json` contiene información de los 32 estados:
- Geografía específica
- Atmósfera característica
- Elementos culturales
- Lugares emblemáticos

## 🔒 Privacidad

- Las API keys se guardan LOCALMENTE en el localStorage de tu navegador
- No se envía información a ningún servidor externo (excepto a la API que selecciones)
- Puedes limpiar las keys guardadas borrando el localStorage

## 🎯 Filosofía del Proyecto

Este generador busca crear historias ORIGINALES que:
- ❌ **NO usan** arquetipos tradicionales mexicanos conocidos
- ✅ **Crean** personajes originales con profundidad
- ✅ **Usan** espacios NO convencionales
- ✅ **Aplican** elementos culturales como contexto, no como cliché
- ✅ **Generan** tensión real y atmósfera auténtica

## 📄 Estructura de Archivos

```
terror-mexicano/
├── README.md              # Este archivo
├── index.html             # Página principal
├── css/
│   └── styles.css         # Estilos visuales
├── js/
│   ├── app.js            # Lógica principal
│   ├── generator.js      # Motor de generación
│   └── api-handlers.js   # Manejo de APIs
└── data/
    └── estados.json      # Base de datos de estados
```

## 🤝 Contribuir

Si deseas mejorar el proyecto:
1. Agrega más elementos culturales a los estados
2. Mejora las plantillas de generación sin API
3. Añade más tipos de terror
4. Optimiza los prompts de las APIs

## 📖 Basado en

Literatura de terror hispana siguiendo los elementos:
- Terror gótico, psicológico y sobrenatural
- Atmósfera mediante descripciones sensoriales
- Transgresión de lo cotidiano
- Suspense y ambigüedad
- Estructura narrativa clásica

Para crear la estructura:
bashmkdir terror-mexicano
cd terror-mexicano
mkdir css js data

## ⚠️ Nota Importante

Este proyecto es una herramienta creativa. Las historias generadas son ficticias y no pretenden ofender creencias culturales. El uso de elementos regionales es meramente atmosférico y contextual.

## 📞 Soporte

Para problemas con APIs, consulta la documentación oficial:
- [OpenAI Docs](https://platform.openai.com/docs)
- [Anthropic Docs](https://docs.anthropic.com)
- [Google AI Docs](https://ai.google.dev/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)

---

**Versión**: 1.0.0  
**Licencia**: MIT  
**Idioma**: Español (México)

🕯️ *"Porque hay historias que no terminan. Solo esperan."* 🕯️