export interface EmergencyResponse {
  message: string;
  instructions: string[];
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const getEmergencyResponse = async (emergencyType: string): Promise<EmergencyResponse> => {
  // Mock emergency response
  const responses: Record<string, EmergencyResponse> = {
    medical: {
      message: 'Emergencia médica detectada',
      instructions: [
        'Mantén la calma',
        'Verifica signos vitales',
        'No muevas al paciente',
        'Espera a los paramédicos'
      ],
      estimatedTime: '8-12 minutos',
      priority: 'critical'
    },
    mechanical: {
      message: 'Falla mecánica reportada',
      instructions: [
        'Enciende las luces de emergencia',
        'Muévete a un lugar seguro',
        'Coloca triángulos de seguridad',
        'Espera al mecánico'
      ],
      estimatedTime: '15-25 minutos',
      priority: 'medium'
    },
    accident: {
      message: 'Accidente vehicular',
      instructions: [
        'Verifica heridos',
        'Llama a emergencias si es necesario',
        'Documenta el incidente',
        'Intercambia información'
      ],
      estimatedTime: '10-20 minutos',
      priority: 'high'
    }
  };

  return responses[emergencyType] || responses.mechanical;
};

export const analyzeEmergency = async (description: string): Promise<string> => {
  // Mock AI analysis
  return `Análisis: ${description}. Recomendación: Contactar servicios de emergencia apropiados.`;
};

export const getAgentResponse = async (query: string): Promise<string> => {
  // Mock agent response
  return `Respuesta del agente para "${query}": Por favor, proporcione más detalles.`;
};

export const getEvaluationResponse = async (feature: string): Promise<string> => {
  // Mock evaluation response
  return `Evaluación para la característica "${feature}": La implementación parece viable.`;
};

export const findParts = async (partName: string): Promise<string[]> => {
  // Mock parts finder
  return [`Refaccionaria 1 para ${partName}`, `Refaccionaria 2 para ${partName}`];
};

export const getTrafficReport = async (lat: number, lng: number): Promise<string> => {
  // Mock traffic report
  return `Reporte de tráfico para la ubicación ${lat}, ${lng}: Tráfico moderado.`;
};

export const findServices = async (serviceType: string): Promise<string[]> => {
  // Mock service finder
  return [`Servicio cercano 1 para ${serviceType}`, `Servicio cercano 2 para ${serviceType}`];
};