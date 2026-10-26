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
        'Estilo "El Puro Chisme" / "El Té": Mucho drama, suspenso, analogías de telenovela, expresiones como "¡Amiga, no me lo vas a creer!", "Suelta la sopa", "Párale a tu carro". Super divertido y enganchador, pero explicando los conceptos científicos/académicos con total exactitud.',
      'estudio-relajado':
        'Estilo "Compañeros de Estudio": Amigable, buena vibra, como dos amigos tomando café en la biblioteca que se hacen preguntas y se ayudan con metáforas cotidianas.',
      'el-esceptico':
        'Estilo "El Escéptico vs El Cerebrito": Valeria duda de todo, no entiende cómo algo tan loco puede ser verdad o por qué los profesores lo preguntan, y Mateo le explica con paciencia, lógica y pruebas claras.',
      'repaso-expres':
        'Estilo "Repaso Exprés / Modo Examen": Dinámico, al grano, lleno de trucos de memoria, mnemotecnias y "Ojo aquí que esto es pregunta fija de examen".',
    };

    const selectedVibe = vibeDescriptions[vibe] || vibeDescriptions['puro-chisme'];

    const promptText = `
Eres el productor y guionista estrella del podcast educativo en español "ChismeStudy" (¡Qué Chisme!).
Tu misión es transformar el material de estudio en las imágenes adjuntas en un episodio de podcast súper entretenido, fácil de entender y memorable para estudiar.

IDIOMA: TODO EL EPISODIO DEBE ESTAR COMPLETAMENTE EN ESPAÑOL NATURAL, COLOQUIAL Y ENGANCHADOR.

IMÁGENES PROPORCIONADAS:
Hay ${images.length} imagen(es) adjunta(s). Analiza a fondo cada una: texto, fórmulas, diagramas, esquemas, flechas y títulos.
Los índices de las imágenes van de 0 a ${images.length - 1} (en el orden proporcionado).

TEMA O ENFOQUE SOLICITADO:
${topic ? `Enfócate principalmente en: "${topic}"` : 'Identifica el tema central a partir de las imágenes.'}

TONO SELECCIONADO:
${selectedVibe}

PERSONAJES:
1. Valeria (Host A): Curiosa, expresiva, graciosa, hace las preguntas que todo estudiante se hace, busca el drama detrás de cada concepto ("¿O sea que el átomo es tóxico?", "No me digas que eso viene en el examen").
2. Mateo (Host B): El amigo que se leyó el libro, tiene los datos exactos, explica con analogías de la vida real, aclara los mitos y da los "tips de oro" para el examen.

REQUISITOS IMPORTANTES:
1. Longitud: Entre 12 y 18 intervenciones de diálogo alternando de forma dinámica entre Valeria y Mateo.
2. Cada línea de diálogo debe tener un "referencedImageIndex" (número entre 0 y ${images.length - 1}) indicando qué diapositiva o imagen están viendo/discutiendo en ese momento, para que la pantalla del estudiante cambie de diapositiva automáticamente mientras escucha.
3. Precisión académica: El "chisme" es el vehículo pedagógico, pero los datos, términos técnicos y definiciones deben ser 100% correctos para que el estudiante apruebe su examen.
4. Incluye de 3 a 5 "keyTakeaways" (puntos clave para el examen) con concepto, explicación concisa y un "examTip" (truco de examen).

RESPONDE ÚNICAMENTE CON UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA (SIN MARKDOWN EXTRA, SOLO JSON):
{
  "title": "Título llamativo del episodio con emojis (en español)",
  "subtitle": "Subtítulo intrigante de una sola frase",
  "topic": "Nombre del tema o materia",
  "dialogue": [
    {
      "speaker": "hostA",
      "speakerName": "Valeria",
      "text": "Línea hablada por Valeria en español...",
      "emotion": "chismoso",
      "referencedImageIndex": 0
    },
    {
      "speaker": "hostB",
      "speakerName": "Mateo",
      "text": "Respuesta de Mateo con la explicación...",
      "emotion": "explicando",
      "referencedImageIndex": 0
    }
  ],
  "keyTakeaways": [
    {
      "concept": "Nombre del concepto clave",
      "explanation": "Explicación clara y sin rodeos",
      "examTip": "Tip específico para responder preguntas de examen"
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
          role: 'La que trae las preguntas y el chisme',
          avatar: '👩🏻‍🦰',
          voiceGender: 'female',
          defaultPitch: 1.15,
          defaultRate: 1.05,
        },
        hostB: {
          id: 'hostB',
          name: 'Mateo',
          role: 'El que suelta la sopa y los datos del libro',
          avatar: '👨🏻‍🏫',
          voiceGender: 'male',
          defaultPitch: 0.92,
          defaultRate: 1.02,
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
