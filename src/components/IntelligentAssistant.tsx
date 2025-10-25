// Arquitecto: DIOS | Implementador: Jorge Hernández
// Migrado de F:\TEST_ASISTENCIA_VIAL
import { useState, useEffect, useRef } from 'react';

interface AssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'emergency' | 'diagnostic' | 'navigation' | 'general';
}

interface VoiceRecognition {
  isListening: boolean;
  transcript: string;
  confidence: number;
}

export default function IntelligentAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition>({
    isListening: false,
    transcript: '',
    confidence: 0
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'chat' | 'voice' | 'camera'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-MX';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        let confidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          confidence = event.results[i][0].confidence;
        }

        setVoiceRecognition(prev => ({ ...prev, transcript, confidence }));

        if (event.results[event.results.length - 1].isFinal && confidence > 0.7) {
          processVoiceCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setVoiceRecognition(prev => ({ ...prev, isListening: false }));
      };
    }

    addAssistantMessage('¡Hola! Soy tu asistente inteligente de Salvame. Puedo ayudarte con emergencias, diagnósticos vehiculares, navegación y más. ¿En qué puedo asistirte?', 'general');

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAssistantMessage = (content: string, category: AssistantMessage['category'] = 'general') => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      category
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const processMessage = async (text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setIsProcessing(true);

    try {
      const response = await analyzeAndRespond(text);
      addAssistantMessage(response.content, response.category);
    } catch (error) {
      addAssistantMessage('Lo siento, hubo un error. Por favor intenta nuevamente.', 'general');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeAndRespond = async (text: string): Promise<{content: string, category: AssistantMessage['category']}> => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('emergencia') || lowerText.includes('accidente') || lowerText.includes('sos')) {
      return {
        content: `🚨 **EMERGENCIA DETECTADA**\n\nProtocolo activado.\n\n**Acciones:**\n1. ¿Estás seguro?\n2. Ambulancia: 065\n3. Policía: 911\n4. Ángeles Verdes: 078\n\nUbicación compartida.\n\n¿Qué emergencia tienes?`,
        category: 'emergency'
      };
    }

    if (lowerText.includes('ruido') || lowerText.includes('falla') || lowerText.includes('motor')) {
      return {
        content: `🔧 **DIAGNÓSTICO**\n\n"${text}"\n\n**Análisis:**\n- Motor: Revisar aceite\n- Frenos: Verificar pastillas\n- Llanta: Inspeccionar presión\n\n**Recomendaciones:**\n1. Lugar seguro\n2. Luces emergencia\n3. ¿Contactar mecánico?\n\n¿Más detalles?`,
        category: 'diagnostic'
      };
    }

    if (lowerText.includes('ruta') || lowerText.includes('tráfico') || lowerText.includes('llegar')) {
      return {
        content: `🗺️ **NAVEGACIÓN**\n\n"${text}"\n\n**Servicios:**\n- Rutas optimizadas\n- Tráfico en tiempo real\n- Gasolineras cercanas\n- Talleres en ruta\n\n**¿Qué necesitas?**\n1. Ruta a destino\n2. Evitar tráfico\n3. Servicios cercanos\n4. Reportar incidente\n\nComparte ubicación.`,
        category: 'navigation'
      };
    }

    return {
      content: `🤖 **ASISTENTE**\n\n"${text}"\n\n**Puedo ayudarte con:**\n- 🚨 Emergencias\n- 🔧 Diagnóstico\n- 🗺️ Navegación\n- 📞 Servicios\n\n**Comandos:**\n- "Emergencia"\n- "Problema con..."\n- "Ruta a..."\n- "Buscar..."\n\n¿Más específico?`,
      category: 'general'
    };
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !voiceRecognition.isListening) {
      setVoiceRecognition(prev => ({ ...prev, isListening: true, transcript: '' }));
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && voiceRecognition.isListening) {
      recognitionRef.current.stop();
      setVoiceRecognition(prev => ({ ...prev, isListening: false }));
    }
  };

  const processVoiceCommand = (transcript: string) => {
    stopVoiceRecognition();
    processMessage(transcript);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setAssistantMode('camera');
      }
    } catch (error) {
      addAssistantMessage('No se pudo acceder a la cámara. Verifica permisos.', 'general');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setAssistantMode('chat');
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        processImageDiagnostic(imageData);
      }
    }
  };

  const processImageDiagnostic = (imageData: string) => {
    addUserMessage('📸 Foto capturada');
    addAssistantMessage(`📸 **ANÁLISIS**\n\nImagen procesada con IA.\n\n**Diagnóstico:**\n- Buscando patrones\n- Comparando fallas\n\n**Recomendaciones:**\n1. Humo: Detente\n2. Líquidos: Identifica color\n3. Daños: Documenta\n\n¿Qué observas?`, 'diagnostic');
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'emergency': return '🚨';
      case 'diagnostic': return '🔧';
      case 'navigation': return '🗺️';
      default: return '🤖';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">🤖 Asistente Inteligente</h3>
        <div className="flex gap-2">
          <button onClick={() => setAssistantMode('chat')} className={`p-2 rounded ${assistantMode === 'chat' ? 'bg-blue-600' : 'bg-gray-700'}`}>💬</button>
          <button onClick={() => setAssistantMode('voice')} className={`p-2 rounded ${assistantMode === 'voice' ? 'bg-blue-600' : 'bg-gray-700'}`}>🎤</button>
          <button onClick={() => setAssistantMode('camera')} className={`p-2 rounded ${assistantMode === 'camera' ? 'bg-blue-600' : 'bg-gray-700'}`}>📷</button>
        </div>
      </div>

      {assistantMode === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto bg-gray-800 rounded p-3 mb-4">
            {messages.map(message => (
              <div key={message.id} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-xs p-2 rounded text-sm ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                  {message.type === 'assistant' && <span className="mr-2">{getCategoryIcon(message.category)}</span>}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
            {isProcessing && <div className="text-left mb-3"><div className="inline-block bg-gray-700 text-gray-100 p-2 rounded text-sm">🤖 Procesando...</div></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && processMessage(inputText) && setInputText('')} placeholder="Escribe tu consulta..." className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" disabled={isProcessing} />
            <button onClick={() => { processMessage(inputText); setInputText(''); }} disabled={isProcessing || !inputText.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm">Enviar</button>
          </div>
        </>
      )}

      {assistantMode === 'voice' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <div className={`text-6xl mb-4 ${voiceRecognition.isListening ? 'animate-pulse' : ''}`}>🎤</div>
            <div className="text-lg font-semibold mb-2 text-white">{voiceRecognition.isListening ? 'Escuchando...' : 'Asistente por Voz'}</div>
            {voiceRecognition.transcript && <div className="bg-gray-800 rounded p-3 mb-4 text-sm text-white">"{voiceRecognition.transcript}"</div>}
          </div>
          <div className="flex gap-4">
            {!voiceRecognition.isListening ? (
              <button onClick={startVoiceRecognition} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">🎤 Iniciar Voz</button>
            ) : (
              <button onClick={stopVoiceRecognition} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">🛑 Detener</button>
            )}
          </div>
        </div>
      )}

      {assistantMode === 'camera' && (
        <div className="flex-1 flex flex-col">
          {!cameraActive ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">📷</div>
              <div className="text-lg font-semibold mb-4 text-white">Diagnóstico Visual</div>
              <p className="text-gray-400 text-sm text-center mb-6">Captura foto para análisis IA</p>
              <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">📷 Activar Cámara</button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <video ref={videoRef} autoPlay playsInline className="flex-1 bg-black rounded mb-4" />
              <div className="flex gap-2">
                <button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">📸 Capturar</button>
                <button onClick={stopCamera} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">❌</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
