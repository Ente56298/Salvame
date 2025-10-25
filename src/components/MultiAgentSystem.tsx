// Arquitecto: DIOS | Implementador: Jorge Hernández
// Migrado de F:\TEST_ASISTENCIA_VIAL - Sistema de 6 Agentes
import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  specialty: string;
  status: 'active' | 'busy' | 'offline';
  avatar: string;
  description: string;
  capabilities: string[];
}

interface AgentTask {
  id: string;
  agentId: string;
  task: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  timestamp: string;
}

export default function MultiAgentSystem() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    const systemAgents: Agent[] = [
      {
        id: 'emergency-agent',
        name: 'Agente Emergencias',
        specialty: 'Respuesta SOS',
        status: 'active',
        avatar: '🚨',
        description: 'Protocolos de emergencia y coordinación con servicios de auxilio.',
        capabilities: ['SOS', 'Ambulancias', 'Protocolos', 'Geolocalización']
      },
      {
        id: 'diagnostic-agent',
        name: 'Agente Diagnóstico',
        specialty: 'Análisis vehicular',
        status: 'active',
        avatar: '🔧',
        description: 'Diagnóstico de fallas vehiculares y recomendaciones técnicas.',
        capabilities: ['OBD', 'Síntomas', 'Códigos', 'Mantenimiento']
      },
      {
        id: 'navigation-agent',
        name: 'Agente Navegación',
        specialty: 'Rutas y tráfico',
        status: 'active',
        avatar: '🗺️',
        description: 'Optimización de rutas y análisis de tráfico.',
        capabilities: ['Rutas', 'Tráfico', 'POI', 'Incidentes']
      },
      {
        id: 'insurance-agent',
        name: 'Agente Seguros',
        specialty: 'Pólizas y siniestros',
        status: 'active',
        avatar: '🛡️',
        description: 'Gestión de seguros y coordinación con aseguradoras.',
        capabilities: ['Pólizas', 'Siniestros', 'Aseguradoras', 'Documentación']
      },
      {
        id: 'ai-coordinator',
        name: 'CO•RA Coordinador',
        specialty: 'IA y coordinación',
        status: 'active',
        avatar: '🧠',
        description: 'Coordinación multi-agente y toma de decisiones complejas.',
        capabilities: ['Coordinación', 'Predictivo', 'Decisiones', 'Aprendizaje']
      },
      {
        id: 'fleet-agent',
        name: 'Agente Flotillas',
        specialty: 'Gestión de flotas',
        status: 'busy',
        avatar: '🚛',
        description: 'Monitoreo y gestión de flotillas comerciales.',
        capabilities: ['Monitoreo', 'Optimización', 'Mantenimiento', 'Reportes']
      }
    ];

    setAgents(systemAgents);

    const initialTasks: AgentTask[] = [
      {
        id: 'task-001',
        agentId: 'emergency-agent',
        task: 'Monitorear alertas CDMX',
        status: 'processing',
        timestamp: new Date().toISOString()
      },
      {
        id: 'task-002',
        agentId: 'navigation-agent',
        task: 'Analizar tráfico Periférico',
        status: 'completed',
        result: 'Tráfico moderado, +15 min',
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ];

    setTasks(initialTasks);
  }, []);

  const assignTask = (agentId: string, task: string) => {
    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId,
      task,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setAgents(prev => prev.map(agent => agent.id === agentId ? { ...agent, status: 'busy' as const } : agent));

    setTimeout(() => processTask(newTask.id, agentId), 2000);
  };

  const processTask = (taskId: string, agentId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: 'processing' } : task));

    setTimeout(() => {
      const result = generateTaskResult(agentId);
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: 'completed', result } : task));
      setAgents(prev => prev.map(agent => agent.id === agentId ? { ...agent, status: 'active' as const } : agent));
    }, 3000);
  };

  const generateTaskResult = (agentId: string): string => {
    const results: {[key: string]: string[]} = {
      'emergency-agent': ['Protocolo activado', 'Servicios contactados - ETA 8 min', 'Ubicación compartida'],
      'diagnostic-agent': ['Diagnóstico: Frenos', 'Código P0171 detectado', 'Revisar filtro de aire'],
      'navigation-agent': ['Ruta optimizada - Ahorro 12 min', 'Ruta alternativa Insurgentes', '3 gasolineras en ruta'],
      'insurance-agent': ['Póliza verificada', 'Siniestro reportado #AS2024-001', 'Ajustador asignado'],
      'ai-coordinator': ['Análisis completado', 'Coordinación optimizada', 'Priorizar emergencia médica'],
      'fleet-agent': ['15 vehículos activos', 'Ahorro 8% combustible', 'FL-003 requiere mantenimiento']
    };

    const agentResults = results[agentId] || ['Tarea completada'];
    return agentResults[Math.floor(Math.random() * agentResults.length)];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'busy': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold mb-4 text-white">🤖 Sistema Multi-Agente (6 Agentes)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <div key={agent.id} className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${selectedAgent === agent.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setSelectedAgent(agent.id)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{agent.avatar}</div>
                <div>
                  <div className="font-semibold text-white">{agent.name}</div>
                  <div className={`text-sm ${getStatusColor(agent.status)}`}>● {status.toUpperCase()}</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mb-3">{agent.description}</div>
              
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 2).map(capability => (
                  <span key={capability} className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">{capability}</span>
                ))}
                {agent.capabilities.length > 2 && <span className="text-xs text-gray-500">+{agent.capabilities.length - 2}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAgent && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-white">📋 Asignar Tarea a {agents.find(a => a.id === selectedAgent)?.name}</h3>
          
          <div className="flex gap-2 mb-4">
            <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="Describe la tarea..." className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" onKeyPress={(e) => { if (e.key === 'Enter' && taskInput.trim()) { assignTask(selectedAgent, taskInput); setTaskInput(''); } }} />
            <button onClick={() => { if (taskInput.trim()) { assignTask(selectedAgent, taskInput); setTaskInput(''); } }} disabled={!taskInput.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded">Asignar</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {selectedAgent === 'emergency-agent' && (
              <>
                <button onClick={() => assignTask(selectedAgent, 'Activar SOS')} className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded">🚨 SOS</button>
                <button onClick={() => assignTask(selectedAgent, 'Contactar ambulancia')} className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded">🚑 Ambulancia</button>
              </>
            )}
            
            {selectedAgent === 'diagnostic-agent' && (
              <>
                <button onClick={() => assignTask(selectedAgent, 'Diagnóstico OBD')} className="bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 rounded">🔧 OBD</button>
                <button onClick={() => assignTask(selectedAgent, 'Analizar síntomas')} className="bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 rounded">🔍 Síntomas</button>
              </>
            )}
            
            {selectedAgent === 'navigation-agent' && (
              <>
                <button onClick={() => assignTask(selectedAgent, 'Ruta óptima')} className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded">🗺️ Ruta</button>
                <button onClick={() => assignTask(selectedAgent, 'Analizar tráfico')} className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded">🚦 Tráfico</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold mb-4 text-white">📊 Historial de Tareas</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {tasks.map(task => {
            const agent = agents.find(a => a.id === task.agentId);
            return (
              <div key={task.id} className="bg-gray-800 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{agent?.avatar}</span>
                    <div>
                      <div className="font-semibold text-sm text-white">{agent?.name}</div>
                      <div className="text-xs text-gray-400">{task.task}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${task.status === 'completed' ? 'bg-green-900 text-green-200' : task.status === 'processing' ? 'bg-blue-900 text-blue-200' : task.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>{task.status}</span>
                </div>
                
                {task.result && <div className="text-sm text-green-300 bg-green-900/20 rounded p-2 mt-2">✅ {task.result}</div>}
                
                <div className="text-xs text-gray-500 mt-2">{new Date(task.timestamp).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
