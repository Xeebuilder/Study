# ☕🎙️ ChismeStudy - AI Study Buddy Podcast en Español

> **¡Convierte tus apuntes, fotos y diapositivas en un podcast de chisme educativo para aprender cualquier tema antes del examen!**

ChismeStudy es una aplicación web moderna diseñada para desplegarse fácilmente en **Vercel**. Transforma imágenes de estudio (páginas de libros, presentaciones, apuntes a mano, diagramas) en entretenidas conversaciones de podcast entre dos anfitriones: **Valeria** (dramática, curiosa, hace las preguntas que todo estudiante se hace) y **Mateo** (el que suelta la sopa con analogías de telenovela y datos exactos del libro).

---

## 🌟 Características Principales

- **🎙️ Diálogos 100% en Español con Doble Voz**:
  - Utiliza el motor Web Speech con voces diferenciadas en español (latinoamericano / castellano).
  - Control de velocidad (0.75x, 1x, 1.25x, 1.5x), saltos de línea y pausa fluida.
- **🖼️ Diapositivas Sincronizadas en Tiempo Real**:
  - Mientras los anfitriones hablan de un concepto, la pantalla cambia automáticamente a la diapositiva que están comentando.
  - Opción de ampliar imágenes en pantalla completa.
- **🎭 4 Estilos de Conversación ("Té y Chisme")**:
  - ☕ **El Puro Chisme** (El cafecito dramático, analogías inolvidables pero rigurosas).
  - 👯 **Compañeros de Estudio** (Chill, amistoso, explicaciones claras).
  - 🧠 **El Escéptico vs El Cerebro** (Uno duda de todo y el otro lo demuestra con lógica).
  - ⚡ **Repaso Exprés / Examen Mañana** (Rápido, dinámico, mnemotecnias y preguntas fijas).
- **📝 Guion Interactivo Karaoke**:
  - El texto se resalta en vivo al ritmo de la voz.
  - Haz clic en cualquier línea para saltar a ese punto del audio.
- **💡 Acordeón de Puntos Clave para el Examen**:
  - Resumen conciso de conceptos y tips para responder preguntas fijas.
- **📚 Biblioteca de Episodios Guardados**:
  - Guarda tus podcasts favoritos en `localStorage` para escucharlos antes de cada parcial.
- **✨ Episodio Demo Incluido**:
  - Viene con un ejemplo preconfigurado listo para escuchar: *"Fotosíntesis vs Mitocondria: El Gran Drama Celular"*.

---

## 🚀 Despliegue en Vercel (1 Clic)

### Opción A: Desplegar desde GitHub a Vercel
1. Sube este repositorio a tu cuenta de GitHub:
   ```bash
   git add .
   git commit -m "feat: ChismeStudy podcast app"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com) y haz clic en **"Add New Project"**.
3. Importa tu repositorio.
4. En **Environment Variables**, añade:
   - `GEMINI_API_KEY`: Tu clave gratuita de [Google AI Studio](https://aistudio.google.com/apikey).
   *(Nota: Si no la agregas aquí, cualquier usuario puede ingresar su propia clave desde la app en el botón de Configuración ⚙️)*.
5. Haz clic en **Deploy**. ¡Listo!

### Opción B: Desplegar con Vercel CLI
```bash
npx vercel
```

---

## 💻 Ejecución Local

1. Clona o abre la carpeta del proyecto:
   ```bash
   cd Podcast
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. (Opcional) Crea un archivo `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Agrega tu `GEMINI_API_KEY=tu_clave_aqui`.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 16 (App Router con Turbopack) & React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4 & Lucide Icons
- **IA Multimodal**: Google Gemini API (Gemini 2.5 Flash / 1.5 Flash con comprensión de imágenes)
- **Audio**: Web Speech API con síntesis dual en español y control de velocidad
- **Efectos**: Canvas Confetti
