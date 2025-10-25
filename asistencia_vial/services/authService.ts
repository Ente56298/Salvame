import { User, PublicEntity, PublicEntityType, IntegrationLevel, PublicArea, PublicAreaType } from '../types';

// Mock user database in a way that can be updated
let users: User[] = [
    { id: '1', name: 'Usuario Gratuito', email: 'free@test.com', subscriptionStatus: 'free' },
    { id: '2', name: 'Usuario Premium', email: 'premium@test.com', subscriptionStatus: 'premium' },
    { id: '3', name: 'Administrador', email: 'admin@test.com', subscriptionStatus: 'admin' },
];

let publicEntities: PublicEntity[] = [
    { 
        id: 'pe1', 
        name: 'Secretaría de Comunicaciones y Transportes', 
        type: PublicEntityType.Government, 
        contactPerson: 'Ana Méndez', 
        contactEmail: 'amendez@sct.gob.mx', 
        status: 'active', 
        integrationLevel: 'data_sharing',
        notes: 'Comparten datos de aforos vehiculares.'
    },
    { 
        id: 'pe2', 
        name: 'Guardia Nacional - División Caminos', 
        type: PublicEntityType.Government, 
        contactPerson: 'Cmdt. Ricardo Solis', 
        contactEmail: 'rsolis@gn.gob.mx', 
        status: 'active', 
        integrationLevel: 'alert_protocol',
        notes: 'Protocolo de alerta SOS activado para emergencias graves.'
    },
     { 
        id: 'pe3', 
        name: 'Aseguradora Vial Segura S.A. de C.V.', 
        type: PublicEntityType.Company, 
        contactPerson: 'Luis Herrera', 
        contactEmail: 'luis.h@seguravial.com', 
        status: 'pending', 
        integrationLevel: 'api_integration',
        notes: 'Pendiente de firma de convenio para integración de pólizas.'
    },
    { 
        id: 'pe4', 
        name: 'Ángeles Verdes', 
        type: PublicEntityType.NGO, 
        contactPerson: 'Sofia Alvarez', 
        contactEmail: 'contacto@angelesverdes.org', 
        status: 'active', 
        integrationLevel: 'none',
        notes: 'Alianza estratégica. No hay integración técnica.'
    },
];

let publicAreas: PublicArea[] = [
    {
        id: 'pa1',
        name: 'Bosque de Chapultepec',
        type: PublicAreaType.Park,
        description: 'El parque urbano más grande de América Latina, con lagos, museos y áreas recreativas.',
        address: 'Miguel Hidalgo, 11100 Ciudad de México, CDMX',
        hasEntryFee: false,
    },
    {
        id: 'pa2',
        name: 'Monumento a la Revolución',
        type: PublicAreaType.Monument,
        description: 'Mausoleo y mirador con una rica historia de la Revolución Mexicana.',
        address: 'Plaza de la República S/N, Tabacalera, Cuauhtémoc, 06030 Ciudad de México, CDMX',
        hasEntryFee: true,
    },
    {
        id: 'pa3',
        name: 'Museo Nacional de Antropología',
        type: PublicAreaType.Museum,
        description: 'Alberga la colección más grande del mundo de arte precolombino de Mesoamérica.',
        address: 'Av. Paseo de la Reforma y Calzada Gandhi s/n, Chapultepec Polanco, Miguel Hidalgo, 11560 Ciudad de México, CDMX',
        hasEntryFee: true,
    },
];

export const login = (email: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const normalizedEmail = email.toLowerCase().trim();
            const user = users.find(u => u.email === normalizedEmail);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('Credenciales inválidas. Por favor, inténtelo de nuevo.'));
            }
        }, 1000);
    });
};

export const register = (name: string, email: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const normalizedEmail = email.toLowerCase().trim();
            if (users.find(u => u.email === normalizedEmail)) {
                reject(new Error('Ya existe una cuenta con este correo electrónico.'));
                return;
            }

            const newUser: User = {
                id: String(Date.now()),
                name,
                email: normalizedEmail,
                subscriptionStatus: 'free',
            };
            
            users.push(newUser);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            resolve(newUser);
        }, 1000);
    });
};

export const logout = (): void => {
    localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
    try {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};

export const getUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...users]);
        }, 500);
    });
};

export const updateUserSubscription = (userId: string, status: 'free' | 'premium'): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].subscriptionStatus = status;
                // Also update local storage if it's the current user
                const currentUser = getCurrentUser();
                if (currentUser && currentUser.id === userId) {
                    localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
                }
                resolve(users[userIndex]);
            } else {
                reject(new Error('Usuario no encontrado.'));
            }
        }, 500);
    });
};

// --- Public Entity Management ---

export const getPublicEntities = (): Promise<PublicEntity[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(publicEntities)));
        }, 700);
    });
};

export const addPublicEntity = (entity: Omit<PublicEntity, 'id'>): Promise<PublicEntity> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newEntity: PublicEntity = {
                ...entity,
                id: `pe${Date.now()}`,
            };
            publicEntities.push(newEntity);
            resolve(newEntity);
        }, 500);
    });
};

export const updatePublicEntity = (entity: PublicEntity): Promise<PublicEntity> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = publicEntities.findIndex(e => e.id === entity.id);
            if (index !== -1) {
                publicEntities[index] = entity;
                resolve(entity);
            } else {
                reject(new Error('Entidad no encontrada.'));
            }
        }, 500);
    });
};

export const deletePublicEntity = (entityId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = publicEntities.findIndex(e => e.id === entityId);
            if (index !== -1) {
                publicEntities.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Entidad no encontrada.'));
            }
        }, 500);
    });
};

// --- Public Area Management ---
export const getPublicAreas = (): Promise<PublicArea[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(publicAreas)));
        }, 700);
    });
};

export const addPublicArea = (area: Omit<PublicArea, 'id'>): Promise<PublicArea> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newArea: PublicArea = {
                ...area,
                id: `pa${Date.now()}`,
            };
            publicAreas.push(newArea);
            resolve(newArea);
        }, 500);
    });
};

export const updatePublicArea = (area: PublicArea): Promise<PublicArea> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = publicAreas.findIndex(a => a.id === area.id);
            if (index !== -1) {
                publicAreas[index] = area;
                resolve(area);
            } else {
                reject(new Error('Área no encontrada.'));
            }
        }, 500);
    });
};

export const deletePublicArea = (areaId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = publicAreas.findIndex(a => a.id === areaId);
            if (index !== -1) {
                publicAreas.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Área no encontrada.'));
            }
        }, 500);
    });
};