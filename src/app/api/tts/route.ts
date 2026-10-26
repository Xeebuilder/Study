import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, apiKey: clientApiKey } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Falta el texto para sintetizar.' }, { status: 400 });
    }

    const apiKey = clientApiKey || process.env.ELEVENLABS_API_KEY;
    const cleanVoiceId = voiceId?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Falta la API Key de ElevenLabs. Configúrala en las variables de entorno o en la app.' },
        { status: 400 }
      );
    }

    if (!cleanVoiceId) {
      return NextResponse.json(
        { error: 'Falta el Voice ID de ElevenLabs.' },
        { status: 400 }
      );
    }

    // Call ElevenLabs TTS API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cleanVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2', // Best for high-fidelity Spanish voices
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Error en ElevenLabs (${response.status}): ${errText}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: any) {
    console.error('Error /api/tts:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al generar el audio.' },
      { status: 500 }
    );
  }
}
