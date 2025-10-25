export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  plates: string;
}

export interface SOSRequest {
  id: string;
  userId: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'resolved' | 'cancelled';
  createdAt: Date;
}

export interface PublicArea {
  id: string;
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface PublicEntity {
  id: string;
  name: string;
  type: PublicEntityType;
  location: {
    lat: number;
    lng: number;
  };
}

export type PublicEntityType = 'hospital' | 'police' | 'fire' | 'government';
export type EntityType = 'mechanic' | 'medical' | 'tow' | 'parts';
export type IntegrationLevel = 'basic' | 'advanced' | 'premium';

export interface Giro {
  id: string;
  name: string;
  type: EntityType;
  description: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export type AssistanceType =
  | 'mechanical'
  | 'medical'
  | 'accident'
  | 'other';