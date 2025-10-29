import { GoogleGenAI } from "@google/genai";
import { type PodcastFormInputs } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (inputs: PodcastFormInputs): string => {
  const { specialization, hostName, hostRole, guestName, episodeTitle, guestHit, section1, section2, section3 } = inputs;
  
  return `
    Actúa como un productor de podcast experto en generar ideas. Tu tono debe ser empático y asertivo, con el objetivo de inspirar una conversación profunda y significativa. Tu misión es generar una lluvia de ideas en formato de lista para una pauta de conversación. El resultado no debe ser un guion en prosa, sino una lista de tópicos y conceptos clave que sirvan como disparadores.

    **Contexto del Episodio:**
    *   **Anfitrión:** ${hostName}, que representa a "${hostRole}".
    *   **Invitado/a:** ${guestName}, una persona experta en ${specialization}.
    *   **El "Hit" del Invitado/a:** ${guestName} es conocido/a por su trabajo en "${guestHit}". Este es un punto clave.
    *   **Título del Episodio:** "${episodeTitle}"
    
    **Estructura Temática del Programa (definida por el anfitrión):**
    *   **Sección 1:** "${section1}"
    *   **Sección 2:** "${section2}"
    *   **Sección 3:** "${section3}"

    **Tus Instrucciones:**
    1.  **Primero, crea una sección "Intro" de 1 a 3 minutos.** Debe comenzar EXACTAMENTE con la frase: "Bienvenidos a Altavoz, el vodcast de la Escuela de Diseño". Luego, debe presentar al anfitrión, ${hostName}, mencionando el departamento que representa, "${hostRole}", y finalmente presentar de forma cálida al invitado/a.
    2.  **Genera una pauta de ideas para un podcast de 30 a 45 minutos en total.** Distribuye el tiempo de forma lógica entre la intro, las 3 secciones temáticas y el cierre.
    3.  **Estructura la respuesta en el siguiente orden:** "Intro", "${section1}", "${section2}", "${section3}", y "Cierre".
    4.  **Indica el minutaje APROXIMADO para CADA sección.** Por ejemplo: **Intro (1-3 minutos)**, **${section1} (10-15 minutos)**, **Cierre (1-2 minutos)**.
    5.  **Dentro de cada sección, crea una lista numerada de ideas clave para la conversación.** NO uses preguntas completas. Deben ser conceptos o temas concisos que sirvan como disparadores para un diálogo espontáneo.
    6.  **En la sección de "Cierre", incluye estos puntos:**
        *   Agradecimiento final a ${guestName}.
        *   Invitación a seguir las redes sociales del departamento del anfitrión ("${hostRole}"), las redes del invitado/a (${guestName}) y las de la Escuela de Diseño.
        *   Llamada a la acción: invitar a suscribirse para más contenidos y compartir el episodio.
    7.  **Relaciona las ideas directamente con el "Hit" del invitado (${guestHit}) y la experiencia del anfitrión (${hostRole}).** Busca conexiones significativas.
    8.  **Mantén un tono empático y asertivo en las ideas propuestas.**

    **Formato de la Respuesta (MUY IMPORTANTE):**
    Usa Markdown para la estructura, con los títulos de sección en negrita. Devuelve ÚNICAMENTE la pauta de ideas en formato de lista. No agregues saludos, explicaciones, ni prosa introductoria o de cierre.

    **Ejemplo de formato esperado:**

    **Intro (1-3 minutos)**
    1. Saludo inicial: "Bienvenidos a Altavoz, el vodcast de la Escuela de Diseño".
    2. Presentación del anfitrión: ${hostName}, en representación de "${hostRole}".
    3. Presentación de ${guestName}, destacar la importancia de su "hit" ("${guestHit}") en ${specialization}.

    **${section1} (10-15 minutos)**
    1. Orígenes de ${guestName} en "${section1}", conectándolo con su proyecto "${guestHit}".
    2. Perspectiva de ${hostName} desde su experiencia en ${hostRole} sobre este tema.
    3. Aprendizajes clave en los inicios de una carrera en ${specialization}.

    **${section2} (15-20 minutos)**
    1. Principales desafíos en "${guestHit}" relacionados con el tema "${section2}".
    2. Anécdota o lección aprendida de ${hostName} desde su rol en "${hostRole}".
    3. Tópico clave sobre ${section2}.

    **${section3} (5-10 minutos)**
    1. Visión a futuro: "${section3}" y el "hit".
    2. Reflexión final sobre el impacto de "${section3}".

    **Cierre (1-2 minutos)**
    1. Agradecimientos a ${guestName} por su tiempo y perspectiva.
    2. Llamada a la acción: "No olviden seguir las redes de '${hostRole}', de ${guestName} y de la Escuela de Diseño".
    3. Recordatorio: "Suscríbanse para más contenidos y compartan si les gustó".
    `;
};

export const generatePodcastStructure = async (inputs: PodcastFormInputs): Promise<string> => {
  try {
    const prompt = buildPrompt(inputs);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Falla en la Matrix generando la pauta: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al contactar a la IA. Quizás se fue a tomar un café.");
  }
};