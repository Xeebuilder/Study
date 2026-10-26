import { NextRequest, NextResponse } from 'next/server';
import { PodcastEpisode, PodcastVibe } from '@/types/podcast';

interface RequestBody {
  images: Array<{
    id: string;
    name: string;
    dataUrl: string;
    mimeType: string;
  }>;
  topic?: string;
  vibe?: PodcastVibe;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { images, topic, vibe = 'puro-chisme', apiKey: clientApiKey } = body;

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Falta la clave API de Gemini. Ingresa tu API Key en la configuración ⚙️ o agrégala como GEMINI_API_KEY en las variables de entorno de Vercel.',
        },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Por favor sube al menos una imagen o apunte de estudio.' },
        { status: 400 }
      );
    }

    // Prepare image parts for Gemini
    const imageParts = images.map((img) => {
      // dataUrl is format "data:image/png;base64,....."
      const base64Data = img.dataUrl.includes('base64,')
        ? img.dataUrl.split('base64,')[1]
        : img.dataUrl;

      const mimeType = img.mimeType || 'image/jpeg';

      return {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };
    });

    const vibeDescriptions: Record<PodcastVibe, string> = {
      'puro-chisme':
        'Estilo Divulgación Científica y Narrativa Inteligente: Elocuente, cautivador, utiliza analogías ingeniosas y rigurosas de la vida real sin caer en chismes superficiales ni bromas infantiles. Explica los conceptos complejos con claridad meridiana.',
      'estudio-relajado':
        'Estilo Mesa de Diálogo Académico: Conversación natural, respetuosa y reflexiva entre dos colegas de estudio analizando a fondo los mecanismos del tema.',
      'el-esceptico':
        'Estilo Análisis Crítico & Demostración: Valeria plantea preguntas incisivas sobre por qué ocurren los fenómenos, y Mateo demuestra la lógica científica y matemática detrás.',
      'repaso-expres':
        'Estilo Síntesis Ejecutiva de Examen: Directo al grano, ágil, estructurado, destacando definiciones operativas y patrones de examen.',
    };

    const selectedVibe = vibeDescriptions[vibe] || vibeDescriptions['puro-chisme'];

    const promptText = `
Eres el productor y guionista principal de un podcast educativo y científico de primer nivel en español (al estilo de Radiolab, NPR, TED o divulgación universitaria de alta calidad).
Tu misión es transformar el material de estudio visual adjunto en un episodio de podcast enriquecedor, inteligente, dinámico y pedagógico.

PAUTAS EDITORIALES CRÍTICAS:
- NO uses chismes baratos, ni dramas juveniles, ni referencias a "exnovios" o relaciones amorosas.
- El tono debe ser el de un PODCAST REAL: culto, elocuente, ameno, curioso y con un respeto absoluto por el rigor del contenido.
- Explica los términos técnicos, diagramas y ecuaciones con precisión para que un estudiante universitario o de secundaria domine el tema a fondo.

IDIOMA: ESPAÑOL NATURAL, FLUIDO Y ARTICULADO.

IMÁGENES ADJUNTAS:
Hay ${images.length} imagen(es). Analiza cada una minuciosamente: esquemas, flechas, procesos, textos, títulos y fórmulas.
Los índices van de 0 a ${images.length - 1}.

TEMA O ENFOQUE SOLICITADO:
${topic ? `Enfócate con prioridad en: "${topic}"` : 'Identifica y desarrolla el tema central a partir de las imágenes.'}

FORMATO Y ENFOQUE:
${selectedVibe}

CO-CONDUCTORES:
1. Valeria (Host A): Conductora reflexiva y analítica. Plantea las preguntas de fondo, conecta los puntos entre etapas y resume las conclusiones clave.
2. Mateo (Host B): Conductor y especialista técnico. Explica los mecanismos moleculares/históricos/físicos con claridad, rigor y analogías de alta calidad.

REQUISITOS ESTRUCTURALES:
1. Entre 12 y 16 intervenciones de diálogo alternando de forma natural entre Valeria y Mateo.
2. Cada línea de diálogo debe incluir "referencedImageIndex" (número entre 0 y ${images.length - 1}) indicando qué diapositiva o figura están abordando en ese momento.
3. Precisión conceptual impecable para garantizar el éxito en exámenes.
4. Genera de 3 a 5 "keyTakeaways" (puntos de evaluación académica) con concepto, explicación clara y un "examTip" (orientación técnica para exámenes).

RESPONDE ÚNICAMENTE CON UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA (SIN TEXTO ADICIONAL):
{
  "title": "Título profesional del episodio (en español)",
  "subtitle": "Subtítulo conciso y elegante",
  "topic": "Nombre del tema o disciplina",
  "dialogue": [
    {
      "speaker": "hostA",
      "speakerName": "Valeria",
      "text": "Intervención de Valeria...",
      "emotion": "explicando",
      "referencedImageIndex": 0
    },
    {
      "speaker": "hostB",
      "speakerName": "Mateo",
      "text": "Intervención de Mateo...",
      "emotion": "explicando",
      "referencedImageIndex": 0
    }
  ],
  "keyTakeaways": [
    {
      "concept": "Concepto evaluable",
      "explanation": "Fundamento teórico conciso",
      "examTip": "Criterio o trampa común en evaluaciones"
    }
  ]
}
`;

    // Try Gemini 2.5 Flash, then 1.5 Flash
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let lastError: any = null;
    let jsonResult: any = null;

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    ...imageParts,
                    {
                      text: promptText,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.75,
                topP: 0.95,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.error?.message || `Error HTTP ${response.status} en modelo ${model}`
          );
        }

        const data = await response.json();
        const rawContent =
          data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!rawContent) {
          throw new Error('No se recibió contenido de texto de Gemini');
        }

        // Clean up markdown wrapper if present
        let cleanedJson = rawContent.trim();
        if (cleanedJson.startsWith('```json')) {
          cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedJson.startsWith('```')) {
          cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        jsonResult = JSON.parse(cleanedJson);
        break; // Successfully parsed!
      } catch (err: any) {
        lastError = err;
        console.warn(`Error con modelo ${model}:`, err.message);
        // Continue to next candidate model
      }
    }

    if (!jsonResult) {
      throw (
        lastError ||
        new Error('No se pudo generar el podcast con los modelos disponibles.')
      );
    }

    // Assemble final episode
    const episode: PodcastEpisode = {
      id: `chisme-${Date.now()}`,
      title: jsonResult.title || 'El Chisme de Estudio',
      subtitle: jsonResult.subtitle || 'Todo lo que necesitas saber para tu examen',
      topic: jsonResult.topic || topic || 'Tema de estudio',
      vibe,
      createdAt: new Date().toISOString(),
      durationMinutesEstimate: Math.max(
        2,
        Math.round((jsonResult.dialogue?.length || 10) * 0.3)
      ),
      hosts: {
        hostA: {
          id: 'hostA',
          name: 'Valeria',
          role: 'Co-conductora • Análisis Conceptual',
          avatar: '👩🏻‍💼',
          voiceGender: 'female',
          defaultPitch: 1.0,
          defaultRate: 1.0,
          elevenLabsVoiceId: '7DsPNelW3gSv6Oxki5sa',
        },
        hostB: {
          id: 'hostB',
          name: 'Mateo',
          role: 'Co-conductor • Divulgación y Mecanismos',
          avatar: '👨🏻‍🔬',
          voiceGender: 'male',
          defaultPitch: 1.0,
          defaultRate: 1.0,
          elevenLabsVoiceId: '3mmJ2Z5SLZ9OkeZZcv5p',
        },
      },
      images,
      dialogue: (jsonResult.dialogue || []).map((line: any, idx: number) => ({
        id: `line-${idx + 1}`,
        speaker: line.speaker === 'hostB' ? 'hostB' : 'hostA',
        speakerName: line.speakerName || (line.speaker === 'hostB' ? 'Mateo' : 'Valeria'),
        text: line.text || '',
        emotion: line.emotion || 'explicando',
        referencedImageIndex:
          typeof line.referencedImageIndex === 'number' &&
          line.referencedImageIndex >= 0 &&
          line.referencedImageIndex < images.length
            ? line.referencedImageIndex
            : 0,
      })),
      keyTakeaways: jsonResult.keyTakeaways || [],
    };

    return NextResponse.json({ episode });
  } catch (error: any) {
    console.error('API Error /api/generate-podcast:', error);
    return NextResponse.json(
      {
        error:
          error.message ||
          'Ocurrió un error inesperado al generar el podcast. Verifica tu conexión o clave de API.',
      },
      { status: 500 }
    );
  }
}
