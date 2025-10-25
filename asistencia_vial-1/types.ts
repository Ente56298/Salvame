export interface User {
    id: string;
    name: string;
    email: string;
    subscriptionStatus: 'free' | 'premium' | 'admin';
}

export enum Feature {
    Evaluation = 'EVALUATION',
    Parts = 'PARTS',
    Traffic = 'TRAFFIC',
    Services = 'SERVICES',
    Assistance = 'ASSISTANCE',
    Partnerships = 'PARTNERSHIPS',
    Admin = 'ADMIN',
    Profile = 'PROFILE',
    Subscription = 'SUBSCRIPTION',
    Functions = 'FUNCTIONS',
}

export enum AssistanceType {
    Mechanic = 'Asistencia Mecánica',
    Medical = 'Asistencia Médica',
    Security = 'Asistencia de Seguridad',
    Funeral = 'Asistencia Funeraria',
}

export interface Part {
    nombre: string;
    descripcion: string;
    proveedor_sugerido: string;
    precio_estimado: number;
}

export interface Service {
    nombre: string;
    tipo: 'Gasolinera' | 'Taller Mecánico' | 'Vulcanizadora';
    ubicacion_aproximada: string;
    telefono?: string;
}

export interface TrafficReport {
    resumen: string;
    incidentes: string[];
    rutas_alternas: string[];
}

export interface LocationCoords {
    lat: number;
    lon: number;
}

export interface Partner {
    id: string;
    name: string;
    iconComponent: string;
}

// Tipos para la Vista 3D
export interface Vector2 {
    x: number;
    y: number;
}

export enum EntityType {
    Individual = 'INDIVIDUAL',
    Camera = 'CAMERA',
    Access = 'ACCESS',
}

export interface Entity {
    id: string;
    type: EntityType;
    position: Vector2;
    label: string;
    role?: string; // Para individuos
    status?: 'active' | 'inactive' | 'open' | 'closed'; // Para cámaras o accesos
    color?: string; // Para individuos
    areaId: string; // Área a la que pertenece o se mueve
}

export interface FloorPlanArea {
    id: string;
    label: string;
    position: Vector2;
    size: Vector2;
    backgroundColor: string;
}

export interface FloorPlan {
    width: number;
    height: number;
    areas: FloorPlanArea[];
    entities: Entity[];
}

export interface Giro {
    id: string;
    name: string;
    prompt: string;
    floorPlan?: FloorPlan;
}

// Tipos para Gestión Pública
export enum PublicEntityType {
    Government = 'GOBIERNO',
    PublicService = 'SERVICIO PÚBLICO',
    Company = 'EMPRESA',
    NGO = 'ONG',
}

export type IntegrationLevel = 'data_sharing' | 'api_integration' | 'alert_protocol' | 'none';

export interface PublicEntity {
    id: string;
    name: string;
    type: PublicEntityType;
    contactPerson: string;
    contactEmail: string;
    status: 'active' | 'pending' | 'inactive';
    integrationLevel: IntegrationLevel;
    notes?: string;
}

// Tipos para Áreas Públicas
export enum PublicAreaType {
    Park = 'PARQUE',
    Garden = 'JARDÍN',
    Monument = 'MONUMENTO',
    Museum = 'MUSEO',
    Building = 'EDIFICIO HISTÓRICO',
}

export interface PublicArea {
    id: string;
    name: string;
    type: PublicAreaType;
    description: string;
    address: string;
    hasEntryFee: boolean;
}


export interface AdminUser extends User {
    // any admin specific fields can go here
}