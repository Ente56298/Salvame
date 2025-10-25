import { User, PublicArea, PublicEntity } from '../types';

export const login = async (email: string, password: string): Promise<User | null> => {
  // Mock login
  return {
    id: '1',
    name: 'Usuario Demo',
    email,
    phone: '+52 55 1234 5678'
  };
};

export const register = async (email: string, password: string): Promise<User | null> => {
  // Mock registration
  console.log(`Registering ${email}`);
  return {
    id: Date.now().toString(),
    name: 'Nuevo Usuario',
    email,
  };
};

export const logout = async (): Promise<void> => {
  // Mock logout
};

export const getCurrentUser = (): User | null => {
  // Mock current user
  return {
    id: '1',
    name: 'Usuario Demo',
    email: 'demo@asistenciavial.mx'
  };
};

export const getUsers = async (): Promise<User[]> => {
  // Mock user list
  return [
    { id: '1', name: 'Usuario Demo', email: 'demo@asistenciavial.mx' },
    { id: '2', name: 'Admin', email: 'admin@asistenciavial.mx' },
  ];
};

export const updateUserSubscription = async (userId: string, level: IntegrationLevel): Promise<User> => {
  // Mock subscription update
  console.log(`Updating user ${userId} to subscription level ${level}`);
  return {
    id: userId,
    name: 'Usuario Actualizado',
    email: 'updated@asistenciavial.mx',
  };
};

export const getPublicAreas = async (): Promise<PublicArea[]> => {
  return [
    {
      id: '1',
      name: 'Área Pública 1',
      type: 'park',
      location: { lat: 19.4326, lng: -99.1332 }
    }
  ];
};

export const addPublicArea = async (area: Omit<PublicArea, 'id'>): Promise<PublicArea> => {
  return {
    id: Date.now().toString(),
    ...area
  };
};

export const updatePublicArea = async (id: string, area: Partial<PublicArea>): Promise<PublicArea> => {
  return {
    id,
    name: area.name || 'Updated Area',
    type: area.type || 'park',
    location: area.location || { lat: 0, lng: 0 }
  };
};

export const deletePublicArea = async (id: string): Promise<void> => {
  // Mock delete
};

export const getPublicEntities = async (): Promise<PublicEntity[]> => {
  return [
    {
      id: '1',
      name: 'Hospital General',
      type: 'hospital',
      location: { lat: 19.4326, lng: -99.1332 }
    }
  ];
};

export const addPublicEntity = async (entity: Omit<PublicEntity, 'id'>): Promise<PublicEntity> => {
  return {
    id: Date.now().toString(),
    ...entity
  };
};

export const updatePublicEntity = async (id: string, entity: Partial<PublicEntity>): Promise<PublicEntity> => {
  return {
    id,
    name: entity.name || 'Updated Entity',
    type: entity.type || 'hospital',
    location: entity.location || { lat: 0, lng: 0 }
  };
};

export const deletePublicEntity = async (id: string): Promise<void> => {
  // Mock delete
};