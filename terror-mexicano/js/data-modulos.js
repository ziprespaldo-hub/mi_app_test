const MODULOS_PERSONAJES = [
    {
        id: 'clara',
        nombre: 'Clara',
        genero: 'Femenino',
        edad: 25,
        tipo: 'protagonista',
        descripcion: 'Joven introvertida que hereda una casa antigua; ignora lo paranormal hasta que es demasiado tarde.',
        contextos: ['gótico', 'paranormal', 'casas encantadas']
    },
    {
        id: 'david',
        nombre: 'David',
        genero: 'Masculino',
        edad: 35,
        tipo: 'protagonista',
        descripcion: 'Detective con trauma por pérdida familiar; su obsesión lo vuelve vulnerable a fuerzas malignas.',
        contextos: ['psicológico', 'urbano', 'paranormal']
    },
    {
        id: 'dr_alan',
        nombre: 'Dr. Alan',
        genero: 'Masculino',
        edad: 45,
        tipo: 'protagonista',
        descripcion: 'Psiquiatra arrogante que enfrenta un caso de supuesta posesión; su lógica científica es su debilidad.',
        contextos: ['psicológico', 'sobrenatural', 'religioso']
    },
    {
        id: 'mateo',
        nombre: 'Mateo',
        genero: 'Masculino',
        edad: 31,
        tipo: 'protagonista',
        descripcion: 'Paramédico del turno nocturno que recibe llamadas desde números de personas fallecidas.',
        contextos: ['urbano', 'paranormal', 'psicológico']
    },
    {
        id: 'luz',
        nombre: 'Luz',
        genero: 'Femenino',
        edad: 23,
        tipo: 'protagonista',
        descripcion: 'Paseadora de perros que sigue ladridos hacia casas abandonadas. Los animales sienten lo que ella ignora.',
        contextos: ['urbano', 'paranormal', 'folk horror']
    }
];

// ANTAGONISTAS / ENTIDADES DE TERROR
const MODULOS_ANTAGONISTAS = [
    {
        id: 'ninguno',
        nombre: 'Sin Entidad Sobrenatural',
        descripcion: 'Terror realista/psicológico. El miedo proviene de situaciones humanas, locura o violencia.',
        tipo: 'realista',
        contextos: ['psicológico', 'urbano', 'gore']
    },
    {
        id: 'diablo',
        nombre: 'El Diablo (Entidad Astuta)',
        descripcion: 'Demonio que tienta y manipula. Rara vez se muestra directamente, actúa a través de contratos o posesiones.',
        tipo: 'sobrenatural',
        contextos: ['sobrenatural', 'religioso', 'folk horror'],
        manifestacion: 'Olor a azufre, sombras alargadas, voces seductoras, espejos distorsionados'
    },
    {
        id: 'duende',
        nombre: 'El Duende (Acosador Doméstico)',
        descripcion: 'Criatura pequeña que acosa a familias. Más travieso que maligno, pero puede ser mortal si se le provoca.',
        tipo: 'criatura',
        contextos: ['folk horror', 'rural', 'paranormal'],
        manifestacion: 'Objetos que desaparecen, risas infantiles, huellas pequeñas, trenzas en cabello'
    },
    {
        id: 'bruja',
        nombre: 'La Bruja (Hechicera Desterrada)',
        descripcion: 'Anciana hechicera que utiliza magia negra o folk, ligada a la tierra y a maldiciones ancestrales.',
        tipo: 'sobrenatural',
        contextos: ['folk horror', 'maldiciones', 'rural'],
        manifestacion: 'Rituales con velas negras, muñecos de trapo, hierbas malditas, símbolos tallados'
    }
];

// LUGARES PREDEFINIDOS
const MODULOS_LUGARES = [
    {
        id: 'planta_agua',
        nombre: 'Planta de Tratamiento de Aguas',
        tipo: 'industrial',
        descripcion: 'Instalación subterránea de procesamiento de aguas residuales con túneles laberínticos.',
        atmosfera: 'Humedad constante, eco metálico, olor a químicos',
        contextos: ['urbano', 'gore', 'sobrenatural']
    },
    {
        id: 'torre_oficinas',
        nombre: 'Torre Corporativa',
        tipo: 'corporativo',
        descripcion: 'Edificio de oficinas de 24 pisos. El piso 13 oficialmente no existe, pero hay botón en algunos elevadores.',
        atmosfera: 'Aire acondicionado perpetuo, silencio artificial, luces LED frías',
        contextos: ['urbano', 'psicológico', 'sobrenatural']
    },
    {
        id: 'estacion_metro',
        nombre: 'Estación de Metro Abandonada',
        tipo: 'transporte',
        descripcion: 'Antigua estación clausurada. Aún tiene corriente eléctrica aunque oficialmente fue desconectada.',
        atmosfera: 'Ozono y tierra húmeda, eco interminable, oscuridad densa',
        contextos: ['urbano', 'paranormal', 'gótico']
    }
];

// ÉPOCAS PREDEFINIDAS
const MODULOS_EPOCAS = [
    {
        id: 'actualidad',
        nombre: 'Actualidad (2020s)',
        descripcion: 'Presente, con tecnología moderna, redes sociales, smartphones'
    },
    {
        id: 'anos_90',
        nombre: 'Años 90',
        descripcion: 'Década pre-internet masivo, beepers, walkman, cultura pop noventera'
    },
    {
        id: 'colonial',
        nombre: 'Época Colonial (1500s-1800s)',
        descripcion: 'Virreinato, iglesias, minas, haciendas, inquisición'
    }
];

// Para compatibilidad con código existente
const MODULOS_ELEMENTOS = [];

// Exportar para uso global
console.log('Módulos de datos cargados:', {
    personajes: MODULOS_PERSONAJES.length,
    antagonistas: MODULOS_ANTAGONISTAS.length,
    lugares: MODULOS_LUGARES.length,
    epocas: MODULOS_EPOCAS.length
});

window.MODULOS_PERSONAJES = MODULOS_PERSONAJES;
window.MODULOS_ANTAGONISTAS = MODULOS_ANTAGONISTAS;
window.MODULOS_LUGARES = MODULOS_LUGARES;
window.MODULOS_EPOCAS = MODULOS_EPOCAS;
window.MODULOS_ELEMENTOS = MODULOS_ELEMENTOS;
