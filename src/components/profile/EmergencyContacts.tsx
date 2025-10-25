import React, { useState, useEffect } from 'react';

interface EmergencyContact {
  name: string;
  phone: string;
}

interface EmergencyContactsProps {
  onContactsChange: (contacts: EmergencyContact[]) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ onContactsChange }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [
      { name: '', phone: '' },
      { name: '', phone: '' },
      { name: '', phone: '' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    onContactsChange(contacts);
  }, [contacts, onContactsChange]);

  const updateContact = (index: number, field: 'name' | 'phone', value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contactos de Emergencia</h3>
      <p className="text-sm text-gray-600">Hasta 3 contactos que serán notificados en caso de emergencia</p>
      
      {contacts.map((contact, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre {index + 1}</label>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => updateContact(index, 'name', e.target.value)}
              placeholder="Nombre del contacto"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono {index + 1}</label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => updateContact(index, 'phone', e.target.value)}
              placeholder="Número de teléfono"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
};