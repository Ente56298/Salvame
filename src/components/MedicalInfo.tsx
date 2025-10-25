import { useState, useEffect } from 'react';

interface MedicalData {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  notes: string;
}

export default function MedicalInfo() {
  const [medicalData, setMedicalData] = useState<MedicalData>({
    bloodType: '',
    allergies: [],
    medications: [],
    conditions: [],
    emergencyContacts: [],
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load medical data from localStorage
    const saved = localStorage.getItem('medical_info');
    if (saved) {
      setMedicalData(JSON.parse(saved));
    }
  }, []);

  const saveMedicalData = () => {
    localStorage.setItem('medical_info', JSON.stringify(medicalData));
    setIsEditing(false);
    
    // Make available on lock screen (simulated)
    localStorage.setItem('emergency_info_lockscreen', JSON.stringify({
      ...medicalData,
      showOnLockScreen: true,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addEmergencyContact = () => {
    setMedicalData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
    }));
  };

  const updateContact = (index: number, field: string, value: string) => {
    setMedicalData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const addAllergy = (allergy: string) => {
    if (allergy && !medicalData.allergies.includes(allergy)) {
      setMedicalData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy]
      }));
    }
  };

  if (!isEditing) {
    return (
      <div className="rocket-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Información Médica de Emergencia</h3>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ✏️ Editar
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400">Tipo de Sangre</div>
              <div className="font-semibold">{medicalData.bloodType || 'No especificado'}</div>
            </div>
            <div>
              <div className="text-gray-400">Contactos de Emergencia</div>
              <div className="font-semibold">{medicalData.emergencyContacts.length}</div>
            </div>
          </div>

          {medicalData.allergies.length > 0 && (
            <div>
              <div className="text-gray-400 mb-1">Alergias</div>
              <div className="flex flex-wrap gap-1">
                {medicalData.allergies.map(allergy => (
                  <span key={allergy} className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {medicalData.medications.length > 0 && (
            <div>
              <div className="text-gray-400 mb-1">Medicamentos</div>
              <div className="text-xs space-y-1">
                {medicalData.medications.map(med => (
                  <div key={med} className="bg-blue-900 text-blue-200 px-2 py-1 rounded">
                    {med}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-900 border border-green-500 rounded p-2 text-xs">
            ✅ Visible en pantalla de bloqueo durante emergencias
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rocket-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Editar Información Médica</h3>
        <div className="space-x-2">
          <button 
            onClick={saveMedicalData}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            💾 Guardar
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            ❌ Cancelar
          </button>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-gray-400 mb-1">Tipo de Sangre</label>
          <select 
            value={medicalData.bloodType}
            onChange={(e) => setMedicalData(prev => ({ ...prev, bloodType: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
          >
            <option value="">Seleccionar</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Contactos de Emergencia</label>
          {medicalData.emergencyContacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                placeholder="Nombre"
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
              />
              <input
                placeholder="Teléfono"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
              />
              <input
                placeholder="Relación"
                value={contact.relationship}
                onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
              />
            </div>
          ))}
          <button 
            onClick={addEmergencyContact}
            className="text-blue-400 hover:text-blue-300 text-xs"
          >
            + Agregar Contacto
          </button>
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Alergias</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {medicalData.allergies.map(allergy => (
              <span key={allergy} className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs">
                {allergy}
                <button 
                  onClick={() => setMedicalData(prev => ({
                    ...prev,
                    allergies: prev.allergies.filter(a => a !== allergy)
                  }))}
                  className="ml-1 text-red-400 hover:text-red-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Agregar alergia"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addAllergy(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Notas Médicas</label>
          <textarea
            value={medicalData.notes}
            onChange={(e) => setMedicalData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Condiciones médicas, medicamentos, instrucciones especiales..."
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 h-20 resize-none"
          />
        </div>
      </div>
    </div>
  );
}