import { PodcastEpisode } from '@/types/podcast';

// Clean SVG Diagram 1: Fotosíntesis & Cloroplasto
const svgDiagram1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23091e14"/>
      <stop offset="100%" stop-color="%23040f0a"/>
    </linearGradient>
    <linearGradient id="chloroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%2310b981"/>
      <stop offset="100%" stop-color="%23047857"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="16" fill="url(%23bgGrad1)"/>
  
  <text x="300" y="45" font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="%23ecfdf5" text-anchor="middle" letter-spacing="1">
    FIGURA 1: ARQUITECTURA FUNCIONAL DEL CLOROPLASTO
  </text>
  <text x="300" y="70" font-family="system-ui, sans-serif" font-size="13" fill="%236ee7b7" text-anchor="middle">
    Fase Fotoquímica (Tilacoides) y Ciclo de Calvin-Benson (Estroma)
  </text>

  <!-- Chloroplast Body -->
  <ellipse cx="300" cy="225" rx="230" ry="125" fill="url(%23chloroGrad)" opacity="0.15" stroke="%2310b981" stroke-width="2" stroke-dasharray="6,4"/>

  <!-- Left: Thylakoid Grana (Fase Luminosa) -->
  <g transform="translate(130, 155)">
    <rect x="0" y="0" width="110" height="24" rx="6" fill="%2310b981"/>
    <rect x="0" y="28" width="110" height="24" rx="6" fill="%23059669"/>
    <rect x="0" y="56" width="110" height="24" rx="6" fill="%23047857"/>
    <text x="55" y="42" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle" letter-spacing="0.5">TILACOIDES</text>
    <text x="55" y="100" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="%23fef08a" text-anchor="middle">Luz (Fotones) + H2O</text>
    <text x="55" y="120" font-family="system-ui, sans-serif" font-size="11" fill="%23a7f3d0" text-anchor="middle">Fotólisis: Libera O2</text>
    <text x="55" y="138" font-family="system-ui, sans-serif" font-size="11" fill="%23ecfdf5" text-anchor="middle">Síntesis: ATP + NADPH</text>
  </g>

  <!-- Flow Arrow -->
  <path d="M 260 210 Q 300 170 340 210" fill="none" stroke="%23fbbf24" stroke-width="3"/>
  <text x="300" y="180" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="%23fbbf24" text-anchor="middle" font-family="monospace">ATP + NADPH ➔</text>

  <!-- Right: Calvin Cycle (Estroma) -->
  <g transform="translate(360, 155)">
    <circle cx="55" cy="40" r="45" fill="none" stroke="%2338bdf8" stroke-width="2.5" stroke-dasharray="5,3"/>
    <text x="55" y="36" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">CICLO DE</text>
    <text x="55" y="50" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">CALVIN</text>
    <text x="55" y="100" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="%2393c5fd" text-anchor="middle">Fijación de CO2</text>
    <text x="55" y="120" font-family="system-ui, sans-serif" font-size="11" fill="%23e0f2fe" text-anchor="middle">Enzima catalizadora: RuBisCO</text>
    <text x="55" y="138" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="%234ade80" text-anchor="middle">Glucosa (C6H12O6)</text>
  </g>

  <!-- Bottom Key Note -->
  <rect x="50" y="340" width="500" height="38" rx="8" fill="%2306281e" stroke="%2310b981" stroke-width="1"/>
  <text x="300" y="364" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="%23ecfdf5" text-anchor="middle">
    Principio bioenergético: Los tilacoides convierten energía radiante en química para fijar carbono en el estroma.
  </text>
</svg>`;

// Clean SVG Diagram 2: Respiración Celular & Mitocondria
const svgDiagram2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%231e0c09"/>
      <stop offset="100%" stop-color="%230d0504"/>
    </linearGradient>
    <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23ea580c"/>
      <stop offset="100%" stop-color="%23b91c1c"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="16" fill="url(%23bgGrad2)"/>
  
  <text x="300" y="45" font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="%23fee2e2" text-anchor="middle" letter-spacing="1">
    FIGURA 2: ETAPAS DE LA RESPIRACIÓN CELULAR Y MITOCONDRIA
  </text>
  <text x="300" y="70" font-family="system-ui, sans-serif" font-size="13" fill="%23fca5a5" text-anchor="middle">
    Glucólisis Citosólica ➔ Ciclo de Krebs (Matriz) ➔ Fosforilación Oxidativa
  </text>

  <!-- Mitochondria Body -->
  <ellipse cx="300" cy="225" rx="230" ry="120" fill="url(%23mitoGrad)" opacity="0.15" stroke="%23ea580c" stroke-width="2"/>
  <!-- Cristae folds -->
  <path d="M 120 220 C 160 170, 180 270, 220 210 C 260 160, 280 270, 320 210 C 360 160, 380 270, 420 210 C 450 170, 470 230, 480 220" 
        fill="none" stroke="%23fca5a5" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Step 1: Glucolisis -->
  <g transform="translate(60, 130)">
    <rect width="115" height="65" rx="8" fill="%232b0f0b" stroke="%23f87171" stroke-width="1"/>
    <text x="57" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">1. GLUCÓLISIS</text>
    <text x="57" y="40" font-family="system-ui, sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">En Citosol</text>
    <text x="57" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23fef08a" text-anchor="middle">+2 ATP Netos</text>
  </g>

  <!-- Step 2: Krebs -->
  <g transform="translate(240, 130)">
    <rect width="120" height="65" rx="8" fill="%233b110b" stroke="%23ea580c" stroke-width="1.5"/>
    <text x="60" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">2. CICLO KREBS</text>
    <text x="60" y="40" font-family="system-ui, sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">Matriz Mitocondrial</text>
    <text x="60" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23fef08a" text-anchor="middle">+2 ATP, NADH, FADH2</text>
  </g>

  <!-- Step 3: Fosforilacion Oxidativa -->
  <g transform="translate(420, 130)">
    <rect width="130" height="65" rx="8" fill="%2345140e" stroke="%23fca5a5" stroke-width="1"/>
    <text x="65" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%23ffffff" text-anchor="middle">3. CADENA ELECTR.</text>
    <text x="65" y="40" font-family="system-ui, sans-serif" font-size="10" fill="%23fecaca" text-anchor="middle">Crestas Internas</text>
    <text x="65" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="%234ade80" text-anchor="middle">+30 a 34 ATP</text>
  </g>

  <!-- Bottom Key Note -->
  <rect x="50" y="335" width="500" height="38" rx="8" fill="%232b0f0b" stroke="%23ea580c" stroke-width="1"/>
  <text x="300" y="359" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="%23fee2e2" text-anchor="middle">
    Rendimiento neto: La fosforilación oxidativa aporta más del 90% del ATP generado por molécula de glucosa.
  </text>
</svg>`;

export const DEMO_EPISODE: PodcastEpisode = {
  id: 'demo-podcast-biologia-1',
  title: 'Bioenergética Celular: Fotosíntesis y Respiración',
  subtitle: 'Análisis detallado sobre los mecanismos moleculares de transformación y captación de energía.',
  topic: 'Fisiología Celular y Bioquímica',
  vibe: 'estudio-relajado',
  createdAt: '2026-10-25T20:00:00.000Z',
  durationMinutesEstimate: 4,
  hosts: {
    hostA: {
      id: 'hostA',
      name: 'Valeria',
      role: 'Co-conductora • Análisis y Preguntas',
      avatar: '👩🏻‍💼',
      voiceGender: 'female',
      defaultPitch: 1.0,
      defaultRate: 1.0,
      elevenLabsVoiceId: '7DsPNelW3gSv6Oxki5sa', // Correct female voice
    },
    hostB: {
      id: 'hostB',
      name: 'Mateo',
      role: 'Co-conductor • Divulgación Científica',
      avatar: '👨🏻‍🔬',
      voiceGender: 'male',
      defaultPitch: 1.0,
      defaultRate: 1.0,
      elevenLabsVoiceId: '3mmJ2Z5SLZ9OkeZZcv5p', // Correct male voice
    }
  },
  images: [
    {
      id: 'img-demo-1',
      name: 'Figura 1: Estructura del Cloroplasto y Fotosíntesis',
      dataUrl: svgDiagram1,
      mimeType: 'image/svg+xml'
    },
    {
      id: 'img-demo-2',
      name: 'Figura 2: Vías de Respiración y Mitocondria',
      dataUrl: svgDiagram2,
      mimeType: 'image/svg+xml'
    }
  ],
  dialogue: [
    {
      id: 'd-1',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Bienvenidos a este episodio de estudio. Hoy abordaremos uno de los temas centrales en biología celular: los circuitos de energía que sostienen la vida celular. Mateo, iniciemos analizando la primera figura sobre el cloroplasto.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-2',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Totalmente de acuerdo, Valeria. La fotosíntesis no es una simple reacción estática; es un sistema en dos etapas coordinadas que ocurren en compartimentos distintos del cloroplasto, como vemos en la figura 1.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-3',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Hablemos de la fase fotoquímica en los tilacoides. ¿Cómo se desencadena exactamente el transporte de electrones?',
      emotion: 'dudoso',
      referencedImageIndex: 0
    },
    {
      id: 'd-4',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Los fotones de luz solar excitan los pigmentos en el fotosistema dos. Para estabilizarse, se produce la fotólisis del agua: la molécula de H2O se escinde, liberando protones y el oxígeno que se emite a la atmósfera. Los electrones fluyen por la cadena transportadora hacia el fotosistema uno, sintetizando ATP y NADPH.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-5',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Y ese ATP y NADPH pasan inmediatamente al estroma para alimentar la fase enzimática: el Ciclo de Calvin.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-6',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Exacto. En el estroma, la enzima RuBisCO cataliza la fijación del dióxido de carbono ambiental sobre la ribulosa 1,5-bisfosfato, transformando carbono inorgánico en carbohidratos estables como la glucosa.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-7',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Ahora observemos la figura 2. Aquí vemos el proceso complementario en la mitocondria: la respiración celular.',
      emotion: 'explicando',
      referencedImageIndex: 1
    },
    {
      id: 'd-8',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Así es. La respiración celular desmonta ordenadamente esos carbohidratos. El proceso arranca fuera de la mitocondria, en el citoplasma, con la glucólisis, donde la glucosa se divide en dos moléculas de piruvato generando dos ATP netos.',
      emotion: 'explicando',
      referencedImageIndex: 1
    },
    {
      id: 'd-9',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Dos ATP es un rendimiento modesto. El verdadero potencial energético se libera cuando el piruvato entra a la matriz mitocondrial, ¿cierto?',
      emotion: 'dudoso',
      referencedImageIndex: 1
    },
    {
      id: 'd-10',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Totalmente. El piruvato se convierte en Acetil-CoA y entra al Ciclo de Krebs. Aquí se extraen electrones de alta energía que se transfieren a coenzimas transportadoras: NADH y FADH2.',
      emotion: 'explicando',
      referencedImageIndex: 1
    },
    {
      id: 'd-11',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'Y esas coenzimas descargan sus electrones en los complejos de las crestas mitocondriales para la fosforilación oxidativa.',
      emotion: 'explicando',
      referencedImageIndex: 1
    },
    {
      id: 'd-12',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Exactamente. El gradiente electroquímico de protones impulsa a la ATP sintasa rotacional para generar entre 30 y 34 moléculas de ATP adicionales. El oxígeno actúa como el aceptor final de electrones, formando agua.',
      emotion: 'enfatico',
      referencedImageIndex: 1
    },
    {
      id: 'd-13',
      speaker: 'hostA',
      speakerName: 'Valeria',
      text: 'En resumen: el cloroplasto almacena energía solar en enlaces químicos, y la mitocondria oxida esos enlaces para abastecer de ATP a la célula. Un ciclo vital perfecto.',
      emotion: 'explicando',
      referencedImageIndex: 0
    },
    {
      id: 'd-14',
      speaker: 'hostB',
      speakerName: 'Mateo',
      text: 'Completamente. En el panel adyacente tienen los puntos de evaluación y conceptos clave para repasar antes del examen.',
      emotion: 'explicando',
      referencedImageIndex: 1
    }
  ],
  keyTakeaways: [
    {
      concept: 'Fases de la Fotosíntesis (Tilacoides vs Estroma)',
      explanation: 'La fase luminosa en los tilacoides utiliza agua y fotones para generar O2, ATP y NADPH. El Ciclo de Calvin en el estroma fija CO2 usando la enzima RuBisCO para sintetizar carbohidratos.',
      examTip: 'Pregunta recurrente: El oxígeno liberado procede de la fotólisis del agua (H2O), no del CO2.'
    },
    {
      concept: 'Rendimiento Energético de la Respiración Celular',
      explanation: 'La glucólisis en el citosol aporta 2 ATP netos. El Ciclo de Krebs y la cadena de transporte de electrones en la mitocondria generan entre 30 y 34 ATP por molécula de glucosa.',
      examTip: 'La mayor producción de ATP se logra en la fosforilación oxidativa gracias al gradiente de protones y la ATP sintasa.'
    },
    {
      concept: 'Interdependencia Metabólica',
      explanation: 'La ecuación general de la fotosíntesis (6CO2 + 6H2O + luz ➔ C6H12O6 + 6O2) es la contraparte termodinámica de la respiración celular (C6H12O6 + 6O2 ➔ 6CO2 + 6H2O + ATP).',
      examTip: 'Las células vegetales poseen tanto cloroplastos como mitocondrias; ejecutan fotosíntesis y respiración de forma simultánea.'
    }
  ]
};
