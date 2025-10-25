import { Giro, EntityType } from '../types';

export const initialGiros: Giro[] = [
    {
        id: '1',
        name: 'Taller Mecánico "El Veloz"',
        prompt: `Eres un asistente de IA para un taller mecánico. Tu objetivo es ayudar a los clientes a diagnosticar problemas, agendar citas y responder preguntas sobre servicios comunes como cambios de aceite, frenos y afinación. Sé amable y profesional. Pide siempre el modelo y año del vehículo.`,
        floorPlan: {
            width: 600,
            height: 400,
            areas: [
                { id: 'recepcion', label: 'Recepción', position: { x: 20, y: 20 }, size: { x: 150, y: 100 }, backgroundColor: 'rgba(52, 152, 219, 0.2)' },
                { id: 'taller', label: 'Taller', position: { x: 20, y: 140 }, size: { x: 560, y: 240 }, backgroundColor: 'rgba(231, 76, 60, 0.2)' },
                { id: 'oficina', label: 'Oficina', position: { x: 190, y: 20 }, size: { x: 200, y: 100 }, backgroundColor: 'rgba(241, 196, 15, 0.2)' },
                { id: 'almacen', label: 'Almacén', position: { x: 410, y: 20 }, size: { x: 170, y: 100 }, backgroundColor: 'rgba(46, 204, 113, 0.2)' },
            ],
            entities: [
                { id: 'cam1', type: EntityType.Camera, position: { x: 30, y: 30 }, label: 'Cámara Lobby', areaId: 'recepcion', status: 'active' },
                { id: 'cam2', type: EntityType.Camera, position: { x: 570, y: 370 }, label: 'Cámara Taller', areaId: 'taller', status: 'active' },
                { id: 'access1', type: EntityType.Access, position: { x: 90, y: 15 }, label: 'Puerta Principal', areaId: 'recepcion', status: 'closed' },
                { id: 'ind1', type: EntityType.Individual, position: { x: 80, y: 60 }, label: 'Ana', role: 'Recepcionista', color: '#3498db', areaId: 'recepcion' },
                { id: 'ind2', type: EntityType.Individual, position: { x: 100, y: 250 }, label: 'Carlos', role: 'Mecánico Jefe', color: '#e74c3c', areaId: 'taller' },
                { id: 'ind3', type: EntityType.Individual, position: { x: 300, y: 300 }, label: 'Luis', role: 'Mecánico', color: '#e74c3c', areaId: 'taller' },
                { id: 'ind4', type: EntityType.Individual, position: { x: 450, y: 50 }, label: 'Maria', role: 'Inventario', color: '#2ecc71', areaId: 'almacen' },
            ]
        }
    },
    {
        id: '2',
        name: 'Refaccionaria "Todo Partes"',
        prompt: `Eres un asistente de IA para una tienda de refacciones. Ayuda a los clientes a encontrar las piezas correctas para su vehículo. Pide marca, modelo, año y número de parte si lo conocen. Ofrece alternativas y verifica existencias (simuladas).`,
        floorPlan: {
            width: 500,
            height: 300,
            areas: [
                { id: 'mostrador', label: 'Mostrador', position: { x: 20, y: 20 }, size: { x: 460, y: 80 }, backgroundColor: 'rgba(52, 152, 219, 0.2)' },
                { id: 'bodega', label: 'Bodega', position: { x: 20, y: 120 }, size: { x: 460, y: 160 }, backgroundColor: 'rgba(142, 68, 173, 0.2)' },
            ],
            entities: [
                { id: 'cam3', type: EntityType.Camera, position: { x: 250, y: 30 }, label: 'Cámara Mostrador', areaId: 'mostrador', status: 'active' },
                { id: 'access2', type: EntityType.Access, position: { x: 20, y: 50 }, label: 'Puerta Clientes', areaId: 'mostrador', status: 'open' },
                { id: 'ind5', type: EntityType.Individual, position: { x: 100, y: 60 }, label: 'Jorge', role: 'Vendedor', color: '#3498db', areaId: 'mostrador' },
                { id: 'ind6', type: EntityType.Individual, position: { x: 300, y: 200 }, label: 'Sofia', role: 'Bodeguero', color: '#8e44ad', areaId: 'bodega' },
            ]
        }
    },
    {
        id: '3',
        name: 'Grúas "Rescate Rápido"',
        prompt: `Eres un despachador de IA para un servicio de grúas. Responde a solicitudes de emergencia. Pide la ubicación exacta, el tipo de vehículo y el problema que tiene. Proporciona un tiempo estimado de llegada y un costo aproximado. Sé rápido y tranquilizador.`,
    },
];
