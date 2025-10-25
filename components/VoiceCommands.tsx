import React, { useState, useEffect } from 'react';
import { useGameification } from '../hooks/useGameification';

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  category: 'navigation' | 'emergency' | 'search' | 'system';
  confidence: number;
}

const VoiceCommands: React.FC = () => {
  const { actions } = useGameification();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);

  const availableCommands = [
    { phrase: 'SOS emergencia', action: 'Activar SOS', category: 'emergency' as const },
    { phrase: 'buscar taller', action: 'Buscar talleres cercanos', category: 'search' as const },
    { phrase: 'navegar a casa', action: 'Iniciar navegación', category: 'navigation' as const },
    { phrase: 'reportar tráfico', action: 'Abrir reportes', category: 'search' as const },
    { phrase: 'llamar contacto', action: 'Llamar emergencia', category: 'emergency' as const },
    { phrase: 'mostrar mapa', action: 'Abrir mapa', category: 'navigation' as const }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      actions.addXP(20, 'Comandos de voz disponibles');
    }
  }, [actions]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setTranscript('');

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setTranscript(result);
      processVoiceCommand(result, event.results[0][0].confidence);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript('Error al procesar comando');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    actions.addXP(10, 'Comando de voz iniciado');
  };

  const processVoiceCommand = (text: string, confidence: number) => {
    const matchedCommand = availableCommands.find(cmd => 
      text.includes(cmd.phrase) || cmd.phrase.includes(text)
    );

    if (matchedCommand) {
      const command: VoiceCommand = {
        id: Date.now().toString(),
        phrase: text,
        action: matchedCommand.action,
        category: matchedCommand.category,
        confidence: confidence * 100
      };

      setCommands(prev => [command, ...prev.slice(0, 4)]);
      setLastCommand(command);
      actions.addXP(25, `Comando ejecutado: ${command.action}`);
      
      // Simular ejecución del comando
      setTimeout(() => {
        executeCommand(command);
      }, 1000);
    }
  };

  const executeCommand = (command: VoiceCommand) => {
    switch (command.category) {
      case 'emergency':
        console.log('Ejecutando comando de emergencia:', command.action);
        break;
      case 'navigation':
        console.log('Ejecutando navegación:', command.action);
        break;
      case 'search':
        console.log('Ejecutando búsqueda:', command.action);
        break;
      case 'system':
        console.log('Ejecutando comando de sistema:', command.action);
        break;
    }
  };

  const getCategoryIcon = (category: VoiceCommand['category']) => {
    switch (category) {
      case 'emergency': return '🚨';
      case 'navigation': return '🗺️';
      case 'search': return '🔍';
      case 'system': return '⚙️';
    }
  };

  const getCategoryColor = (category: VoiceCommand['category']) => {
    switch (category) {
      case 'emergency': return 'bg-red-600';
      case 'navigation': return 'bg-blue-600';
      case 'search': return 'bg-green-600';
      case 'system': return 'bg-purple-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎤</span>
        <div>
          <h2 className="text-xl font-bold text-white">Comandos de Voz</h2>
          <p className="text-gray-400">Control por voz para manos libres</p>
        </div>
      </div>

      {/* Voice Control */}
      <div className="mb-6 text-center">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`px-8 py-4 rounded-full text-white font-bold text-lg transition-all ${
            isListening 
              ? 'bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isListening ? (
            <>
              <span className="animate-pulse">🎤 Escuchando...</span>
            </>
          ) : (
            <>
              <span>🎤 Mantén presionado para hablar</span>
            </>
          )}
        </button>
      </div>

      {/* Current Transcript */}
      {transcript && (
        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-white mb-2">📝 Último comando:</h3>
          <p className="text-blue-300 text-lg">&quot;{transcript}&quot;</p>
        </div>
      )}

      {/* Last Command Result */}
      {lastCommand && (
        <div className="mb-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{getCategoryIcon(lastCommand.category)}</span>
            <div>
              <h3 className="font-bold text-white">✅ Comando Ejecutado</h3>
              <p className="text-green-300">{lastCommand.action}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className={`${getCategoryColor(lastCommand.category)} text-white px-2 py-1 rounded text-xs`}>
              {lastCommand.category.toUpperCase()}
            </span>
            <span className={`${getConfidenceColor(lastCommand.confidence)}`}>
              {lastCommand.confidence.toFixed(0)}% confianza
            </span>
          </div>
        </div>
      )}

      {/* Available Commands */}
      <div className="mb-6">
        <h3 className="font-bold text-white mb-4">🗣️ Comandos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableCommands.map((cmd, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCategoryIcon(cmd.category)}</span>
                <div>
                  <div className="font-bold text-white">&quot;{cmd.phrase}&quot;</div>
                  <div className="text-sm text-gray-300">{cmd.action}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Command History */}
      {commands.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-white mb-4">📜 Historial de Comandos</h3>
          <div className="space-y-3">
            {commands.map((command) => (
              <div key={command.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCategoryIcon(command.category)}</span>
                    <div>
                      <div className="font-bold text-white">{command.action}</div>
                      <div className="text-sm text-gray-300">&quot;{command.phrase}&quot;</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getConfidenceColor(command.confidence)}`}>
                      {command.confidence.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">Confianza</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Tips */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-white mb-3">💡 Consejos para Comandos de Voz</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2">🎯 Para mejor reconocimiento</h4>
            <ul className="space-y-1">
              <li>• Habla claro y pausado</li>
              <li>• Usa frases exactas</li>
              <li>• Evita ruido de fondo</li>
              <li>• Mantén el micrófono cerca</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">🚨 Comandos de emergencia</h4>
            <ul className="space-y-1">
              <li>• &quot;SOS emergencia&quot; - Activación rápida</li>
              <li>• &quot;llamar contacto&quot; - Llamada automática</li>
              <li>• &quot;buscar hospital&quot; - Ubicación médica</li>
              <li>• &quot;reportar accidente&quot; - Reporte rápido</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-400">{commands.length}</div>
          <div className="text-sm text-gray-300">Comandos</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-400">
            {commands.filter(c => c.confidence >= 80).length}
          </div>
          <div className="text-sm text-gray-300">Alta precisión</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-red-400">
            {commands.filter(c => c.category === 'emergency').length}
          </div>
          <div className="text-sm text-gray-300">Emergencias</div>
        </div>
        <div className="bg-gray-700 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-400">
            {availableCommands.length}
          </div>
          <div className="text-sm text-gray-300">Disponibles</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommands;