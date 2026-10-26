import { PodcastEpisode } from '@/types/podcast';

// Crisp SVG Diagram 1: Fotosíntesis & Cloroplasto
const svgDiagram1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23064e3b"/>
      <stop offset="100%" stop-color="%23022c22"/>
    </linearGradient>
    <linearGradient id="chloroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%2310b981"/>
      <stop offset="100%" stop-color="%23047857"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="16" fill="url(%23bgGrad1)"/>
  
  <text x="300" y="45" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="%23ecfdf5" text-anchor="middle">
    🍃 DIAPOSITIVA 1: FOTOSÍNTESIS &amp; EL CLOROPLASTO
  </text>
  <text x="300" y="70" font-family="system-ui, sans-serif" font-size="14" fill="%236ee7b7" text-anchor="middle">
    Fase Luminosa (Tilacoides) + Ciclo de Calvin (Estroma)
  </text>

  <!-- Chloroplast Body -->
  <ellipse cx="300" cy="225" rx="230" ry="125" fill="url(%23chloroGrad)" opacity="0.3" stroke="%2334d399" stroke-width="3" stroke-dasharray="6,4"/>

  <!-- Left: Thylakoid Grana (Fase Luminosa) -->
  <g transform="translate(140, 160)">
    <rect x="0" y="0" width="100" height="24" rx="8" fill="%2334d399"/>
    <rect x="0" y="28" width="100" height="24" rx="8" fill="%2310b981"/>
    <rect x="0" y="56" width="100" height="24" rx="8" fill="%23059669"/>
    <text x="50" y="42" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">TILAGOIDES</text>
    <text x="50" y="100" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="%23fef08a" text-anchor="middle">☀️ Luz + H2O</text>
    <text x="50" y="120" font-family="system-ui, sans-serif" font-size="12" fill="%23a7f3d0" text-anchor="middle">Libera: O2 (Oxígeno)</text>
    <text x="50" y="138" font-family="system-ui, sans-serif" font-size="11" fill="%23ecfdf5" text-anchor="middle">Genera: ATP + NADPH</text>
  </g>

  <!-- Flow Arrow -->
  <path d="M 260 210 Q 300 170 340 210" fill="none" stroke="%23fbbf24" stroke-width="4" marker-end="url(%23arrow)"/>
  <text x="300" y="180" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23fbbf24" text-anchor="middle">ATP + NADPH ➡️</text>

  <!-- Right: Calvin Cycle (Estroma) -->
  <g transform="translate(360, 160)">
    <circle cx="50" cy="40" r="45" fill="none" stroke="%2338bdf8" stroke-width="4" stroke-dasharray="5,3"/>
    <text x="50" y="38" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">CICLO DE</text>
    <text x="50" y="52" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">CALVIN</text>
    <text x="50" y="100" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="%2393c5fd" text-anchor="middle">Entra: CO2</text>
    <text x="50" y="120" font-family="system-ui, sans-serif" font-size="12" fill="%23e0f2fe" text-anchor="middle">Enzima estrella: RuBisCO</text>
    <text x="50" y="138" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%234ade80" text-anchor="middle">¡Fabrica Glucosa (C6H12O6)!</text>
  </g>

  <!-- Bottom Key Note -->
  <rect x="50" y="340" width="500" height="40" rx="8" fill="%23065f46" stroke="%2310b981" stroke-width="1"/>
  <text x="300" y="365" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="%23fef3c7" text-anchor="middle">
    💡 El Chisme Clave: La planta NO come sol, ¡convierte la luz en azúcar para que tú te la comas!
  </text>
</svg>`;

// Crisp SVG Diagram 2: Respiración Celular & Mitocondria
const svgDiagram2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23450a0a"/>
      <stop offset="100%" stop-color="%231f0404"/>
    </linearGradient>
    <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23f97316"/>
      <stop offset="100%" stop-color="%23dc2626"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="16" fill="url(%23bgGrad2)"/>
  
  <text x="300" y="45" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="%23fee2e2" text-anchor="middle">
    ⚡ DIAPOSITIVA 2: LA MITOCONDRIA &amp; EL CICLO DE KREBS
  </text>
  <text x="300" y="70" font-family="system-ui, sans-serif" font-size="14" fill="%23fca5a5" text-anchor="middle">
    Glucólisis (Citosol) ➡️ Ciclo de Krebs (Matriz) ➡️ Cadena de Electrones
  </text>

  <!-- Mitochondria Bean -->
  <ellipse cx="300" cy="225" rx="230" ry="120" fill="url(%23mitoGrad)" opacity="0.35" stroke="%23f87171" stroke-width="3"/>
  <!-- Cristae folds -->
  <path d="M 120 220 C 160 170, 180 270, 220 210 C 260 160, 280 270, 320 210 C 360 160, 380 270, 420 210 C 450 170, 470 230, 480 220" 
        fill="none" stroke="%23fca5a5" stroke-width="4" stroke-linecap="round"/>

  <!-- Step 1: Glucolisis -->
  <g transform="translate(60, 130)">
    <rect width="110" height="65" rx="10" fill="%237f1d1d" stroke="%23f87171" stroke-width="1.5"/>
    <text x="55" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">1. GLUCÓLISIS</text>
    <text x="55" y="40" font-family="system-ui, sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">En el citoplasma</text>
    <text x="55" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23fef08a" text-anchor="middle">+2 ATP (netos)</text>
  </g>

  <!-- Step 2: Krebs -->
  <g transform="translate(240, 130)">
    <rect width="120" height="65" rx="10" fill="%23991b1b" stroke="%23ef4444" stroke-width="2"/>
    <text x="60" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">2. CICLO KREBS</text>
    <text x="60" y="40" font-family="system-ui, sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">En la matriz mitocondrial</text>
    <text x="60" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23fef08a" text-anchor="middle">+2 ATP, NADH, FADH2</text>
  </g>

  <!-- Step 3: Fosforilacion Oxidativa -->
  <g transform="translate(420, 130)">
    <rect width="130" height="65" rx="10" fill="%23b91c1c" stroke="%23fca5a5" stroke-width="1.5"/>
    <text x="65" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle">3. CADENA TRANSP.</text>
    <text x="65" y="40" font-family="system-ui, sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">Crestas mitocondriales</text>
    <text x="65" y="55" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="%234ade80" text-anchor="middle">¡+30 a 34 ATP!</text>
  </g>

  <!-- Big Payoff -->
  <rect x="50" y="335" width="500" height="45" rx="8" fill="%237f1d1d" stroke="%23ef4444" stroke-width="1.5"/>
  <text x="300" y="362" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="%23fef08a" text-anchor="middle">
    🔥 El Chisme de Oro: La glucólisis es el aperitivo, ¡el verdadero billete (ATP) sale de la cadena!
  </text>
</svg>`;

export const DEMO_EPISODE: PodcastEpisode = {
  id: 'demo-chisme-biologia-1',
  title: 'El Gran Drama Celular: Fotosíntesis vs Mitocondria 🍃⚡',
  subtitle: '¡Amiga, no sabes el escándalo bioquímico que hay dentro de tus células!',
  topic: 'Fotosíntesis y Respiración Celular (Biología)',
  vibe: 'puro-chisme',
  createdAt: '2026-10-25T20:00:00.000Z',
  durationMinutesEstimate: 4,
  hosts: {
    hostA: {
      id: 'hostA',
      name: 'Valeria',
      role: 'La que trae las preguntas y el drama',
      avatar: '👩🏻‍🦰',
      voiceGender: 'female',
      defaultPitch: 1.15,
      defaultRate: 1.05
    },
    hostB: {
      id: 'hostB',
      name: 'Mateo',
      role: 'El que tiene toda la data y suelta la sopa',
      avatar: '👨🏻‍🏫',
      voiceGender: 'male',
      defaultPitch: 0.92,
      defaultRate: 1.02
    }
  },
  images: [
    {
      id: 'img-demo-1',
      name: '1. Cloroplasto y Fotosíntesis',
      dataUrl: svgDiagram1,
      mimeType: 'image/svg+xml'
    },
    {
      id: 'img-demo-2',
      name: '2. Mitocondria y Ciclo de Krebs',
      dataUrl: svgDiagram2,
      mimeType: 'image/svg+xml'
    }
  ],
  dialogue: [
    {
      id: 'd-1',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: '¡Mateo, por favor, siéntate y tómate un café porque te tengo un chisme de los pesados! Tienes que ver la primera diapositiva que nos pusieron para el examen de biología.',
      emotion: 'chismoso',
      referencedImageIndex: 0
    },
    {
      id: 'd-2',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: '¡Suelta la sopa, Valeria! ¿Qué pasó ahora? ¿Otra vez la fotosíntesis y sus dramas?',
      emotion: 'riendo',
      referencedImageIndex: 0
    },
    {
      id: 'd-3',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: '¡Exacto! Todo el mundo jura que la planta come luz solar como si fuera un bufé mágico. Pero mira la Diapositiva 1: el cloroplasto en verdad tiene dos turnos de trabajo que no descansan.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-4',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: '¡Totalmente! Primero está la Fase Luminosa en los tilacoides. Ahí la planta agarra la luz del sol y rompe el agua, ¡como quien rompe una relación tóxica! Y de ahí escupe el oxígeno que respiramos como desecho. ¡Lo que para ella es basura, para nosotros es la vida!',
      emotion: 'enfatico',
      referencedImageIndex: 0
    },
    {
      id: 'd-5',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: '¡No me digas! ¿O sea que el oxígeno que respiramos es el ex novio que la planta botó a la calle? ¡Qué escándalo!',
      emotion: 'sorprendido',
      referencedImageIndex: 0
    },
    {
      id: 'd-6',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: '¡Literalmente! Y el verdadero premio se va a la noche, en el estroma, con el Ciclo de Calvin. Hay una enzima llamada RuBisCO que fija el dióxido de carbono y fabrica glucosa. Es el verdadero negocio: convertir aire y luz en azúcar pura.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-7',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Espérate, ahora pásame a la Diapositiva 2 porque aquí entra la verdadera villana de la telenovela: ¡la señora Mitocondria!',
      emotion: 'chismoso',
      referencedImageIndex: 1
    },
    {
      id: 'd-8',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: '¡Ufff, la mitocondria! Todo el mundo dice "es la central energética", pero el chisme histórico es que la mitocondria era una bacteria libre hace miles de millones de años, y una célula más grande se la tragó. Tienen su propio ADN porque nunca firmaron la rendición completa.',
      emotion: 'enfatico',
      referencedImageIndex: 1
    },
    {
      id: 'd-9',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: '¡Una roomie que nunca se fue del departamento! Y mira el proceso: primero la Glucólisis en el citoplasma sólo nos da 2 tristes moneditas de ATP. ¡Eso no le alcanza a nadie!',
      emotion: 'riendo',
      referencedImageIndex: 1
    },
    {
      id: 'd-10',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: '¡Claro, la glucólisis es pura propina! Pero cuando el piruvato entra a la matriz mitocondrial y arranca el Ciclo de Krebs, y luego a la Cadena de Transporte de Electrones en las crestas... ¡pum! Se producen más de 30 ATP. ¡Ahí es donde se factura la energía!',
      emotion: 'enfatico',
      referencedImageIndex: 1
    },
    {
      id: 'd-11',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: '¡Shakira tenía razón, la mitocondria no llora, la mitocondria factura! Entonces para el examen: ¿la fotosíntesis sintetiza glucosa en el cloroplasto y la respiración celular la quema en la mitocondria para darnos energía?',
      emotion: 'explicando',
      referencedImageIndex: 1
    },
    {
      id: 'd-12',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: '¡Bingo, Valeria! Son el matrimonio tóxico perfecto: lo que uno produce, el otro se lo gasta. Si te acuerdas de ese chisme en el examen, sacas 100 seguro.',
      emotion: 'riendo',
      referencedImageIndex: 0
    },
    {
      id: 'd-13',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: '¡Me encanta! Amigos, repasen los puntos clave que dejamos aquí abajo y nos vemos en el próximo cafecito de estudio.',
      emotion: 'chismoso',
      referencedImageIndex: 1
    }
  ],
  keyTakeaways: [
    {
      concept: 'Fotosíntesis (Fase Luminosa vs Ciclo de Calvin)',
      explanation: 'Ocurre en el cloroplasto. La fase luminosa usa agua y luz para producir O2, ATP y NADPH. El ciclo de Calvin (estroma) fija el CO2 usando la enzima RuBisCO para fabricar glucosa.',
      examTip: 'Recuerda: El O2 liberado proviene del agua (H2O), no del CO2.'
    },
    {
      concept: 'Respiración Celular y Rendimiento de ATP',
      explanation: 'La glucólisis ocurre en el citosol y produce sólo 2 ATP netos. El Ciclo de Krebs y la cadena de transporte de electrones ocurren en la mitocondria y producen entre 30 y 34 ATP.',
      examTip: 'La mayor cantidad de ATP se genera en la fosforilación oxidativa (cadena respiratoria) gracias a la ATP sintasa.'
    },
    {
      concept: 'Relación Complementaria',
      explanation: 'La ecuación de la fotosíntesis es exactamente la inversa de la respiración celular: 6CO2 + 6H2O + luz ↔ C6H12O6 + 6O2.',
      examTip: 'Tanto plantas como animales hacen respiración celular; las plantas hacen fotosíntesis Y respiración.'
    }
  ]
};
