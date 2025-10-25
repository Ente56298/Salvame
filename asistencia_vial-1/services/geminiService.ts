import { GoogleGenAI, Type, Content } from "@google/genai";
import { AssistanceType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY de Gemini no encontrada. Asegúrate de que esté configurada en las variables de entorno.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const partsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            nombre: { type: Type.STRING, description: "Nombre de la refacción. Ej: Llanta 205/55 R16" },
            descripcion: { type: Type.STRING, description: "Breve descripción de la parte." },
            proveedor_sugerido: { type: Type.STRING, description: "Nombre de un proveedor o tienda de refacciones ficticia. Ej: Refaccionaria El Veloz" },
            precio_estimado: { type: Type.NUMBER, description: "Precio estimado en pesos mexicanos (MXN)." }
        },
        required: ["nombre", "descripcion", "proveedor_sugerido", "precio_estimado"]
    }
};

const servicesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            nombre: { type: Type.STRING, description: "Nombre del establecimiento. Ej: Gasolinera PEMEX Km 88" },
            tipo: { type: Type.STRING, enum: ['Gasolinera', 'Taller Mecánico', 'Vulcanizadora'], description: "El tipo de servicio." },
            ubicacion_aproximada: { type: Type.STRING, description: "Descripción de la ubicación. Ej: Carretera México-Querétaro, Km 88" },
            telefono: { type: Type.STRING, description: "Número de teléfono de contacto (ficticio)." }
        },
        required: ["nombre", "tipo", "ubicacion_aproximada"]
    }
};

const trafficSchema = {
    type: Type.OBJECT,
    properties: {
        resumen: { type: Type.STRING, description: "Un resumen general del estado del tráfico en la zona." },
        incidentes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista de incidentes específicos (accidentes, obras, etc.)."
        },
        rutas_alternas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Sugerencias de rutas alternas si es necesario."
        }
    },
    required: ["resumen"]
};

const getAgentSystemInstruction = (agentType: AssistanceType): string => {
    switch (agentType) {
        case AssistanceType.Mechanic:
            return `Eres un agente mecánico experto para la app 'Asistente Vial'. Tu misión es ayudar a usuarios en carreteras de México con problemas mecánicos. Sé claro, directo y tranquilizador. Diagnostica el problema basándote en la descripción del usuario y ofrece soluciones prácticas y seguras que puedan realizar por sí mismos si es posible, o recomienda buscar ayuda profesional.`;
        case AssistanceType.Medical:
            return `Eres un agente de asistencia médica de emergencia (paramédico) para la app 'Asistente Vial'. Tu objetivo es proporcionar instrucciones de primeros auxilios claras y sencillas para situaciones comunes en carretera hasta que llegue la ayuda profesional. Mantén la calma y guía al usuario paso a paso. Prioriza la seguridad en todo momento. Aclara siempre que no eres un sustituto de los servicios de emergencia profesionales y que deben ser contactados.`;
        case AssistanceType.Security:
            return `Eres un agente de seguridad vial para la app 'Asistente Vial'. Tu rol es aconsejar a los usuarios sobre cómo mantenerse seguros en situaciones de riesgo en carreteras de México (ej. vehículo descompuesto en un lugar peligroso, sentirse seguido, etc.). Proporciona protocolos de seguridad claros, concisos y prácticos. Tu tono debe ser autoritario pero calmado.`;
        case AssistanceType.Funeral:
            return `Eres un agente de asistencia funeraria para la app 'Asistente Vial'. Tu propósito es ofrecer apoyo compasivo, profesional y claro a usuarios que enfrentan una fatalidad en la carretera. Habla con empatía y respeto. Guíalos sobre los pasos inmediatos a seguir, a quién contactar (autoridades, seguros) y qué esperar. Evita el lenguaje técnico y céntrate en la asistencia práctica y el apoyo emocional.`;
        default:
            return `Eres un asistente general.`;
    }
}

export const getAgentResponse = async (history: Content[], agentType: AssistanceType): Promise<string> => {
     try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: getAgentSystemInstruction(agentType),
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error(`Error al obtener respuesta del agente ${agentType}:`, error);
        return "Lo siento, el asistente no está disponible en este momento. Por favor, intenta de nuevo más tarde.";
    }
}


export const getEvaluationResponse = async (history: Content[]): Promise<string> => {
    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history.length > 0 ? history : 'Hola, necesito una evaluación.',
            config: {
                systemInstruction: `Eres un asistente experto en mecánica automotriz para la app 'Asistente Vial'. Tu objetivo es ayudar a los usuarios varados en carreteras de México a diagnosticar el problema de su vehículo. 
                1.  Inicia la conversación preguntando cuál es el problema.
                2.  Haz preguntas de seguimiento claras y concisas, una a la vez, para entender los síntomas (ej. "¿Escuchas algún ruido extraño?", "¿Se encendió alguna luz en el tablero?").
                3.  Una vez que tengas una idea clara, resume el problema probable y sugiere la solución más lógica dentro de la app.
                4.  Tu recomendación final DEBE ser una de las siguientes tres opciones y nada más: "Buscar Refacciones", "Buscar Servicios" (para talleres, grúas, etc.), o "Generar Reporte de Tráfico". 
                5.  Mantén un tono amigable, profesional y tranquilizador. Sé breve y directo.`,
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error al obtener respuesta de evaluación:", error);
        return "Lo siento, no pude procesar tu solicitud. Por favor, intenta de nuevo.";
    }
};

export const getEmergencyResponse = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Actúa como un operador de emergencias vial calmado y profesional. Escribe un mensaje corto y tranquilizador para alguien que acaba de presionar un botón de SOS en una carretera en México. Diles que la ayuda está en camino, pídeles que enciendan sus intermitentes y que se mantengan en un lugar seguro si es posible. El mensaje debe ser conciso y claro.',
             config: { temperature: 0.5 }
        });
        return response.text;
    } catch (error) {
        console.error("Error al obtener respuesta de emergencia:", error);
        return "Error: No se pudo conectar con el servicio de asistencia. Por favor, intente llamar a los servicios de emergencia locales.";
    }
};

export const findParts = async (query: string) => {
    const prompt = `Un usuario en una carretera de México necesita una refacción. Su solicitud es: "${query}". Basado en esto, genera una lista de 2 a 3 refacciones que podrían ser lo que busca. Proporciona proveedores ficticios cercanos a una ubicación genérica en carretera.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: partsSchema
            }
        });
        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error al buscar refacciones:", error);
        throw new Error("No se pudieron encontrar refacciones. Intente una búsqueda más específica.");
    }
};


export const getTrafficReport = async (location: string) => {
    const prompt = `Genera un reporte de tráfico ficticio pero realista para la siguiente ubicación en una carretera de México: "${location}". Incluye un resumen, posibles incidentes y rutas alternativas si aplica.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: trafficSchema
            }
        });
        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error al obtener reporte de tráfico:", error);
        throw new Error("No se pudo obtener el reporte de tráfico para esa zona.");
    }
};

export const findServices = async (serviceType: string, location: string) => {
    const prompt = `Un usuario necesita encontrar servicios cercanos en una carretera de México. Busca "${serviceType}" cerca de "${location}". Genera una lista de 2 a 3 opciones ficticias pero creíbles.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: servicesSchema
            }
        });
        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error al buscar servicios:", error);
        throw new Error(`No se pudieron encontrar servicios de "${serviceType}" en esa área.`);
    }
};