// Arquitecto: DIOS | Implementador: Jorge Hernández
// Migrado de F:\TEST_ASISTENCIA_VIAL - Cumplimiento Regulatorio México
import { useState, useEffect } from 'react';

interface ConsentData {
  locationTracking: boolean;
  emergencyContacts: boolean;
  medicalData: boolean;
  dataSharing: boolean;
  consentDate: string;
  iftCompliance: boolean;
}

export default function MexicanCompliance() {
  const [showConsent, setShowConsent] = useState(false);
  const [consent, setConsent] = useState<ConsentData | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem('mexican_compliance_consent');
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    } else {
      setShowConsent(true);
    }
  }, []);

  const giveConsent = (consentData: Partial<ConsentData>) => {
    const fullConsent: ConsentData = {
      locationTracking: consentData.locationTracking || false,
      emergencyContacts: consentData.emergencyContacts || false,
      medicalData: consentData.medicalData || false,
      dataSharing: consentData.dataSharing || false,
      consentDate: new Date().toISOString(),
      iftCompliance: true
    };

    setConsent(fullConsent);
    localStorage.setItem('mexican_compliance_consent', JSON.stringify(fullConsent));
    setShowConsent(false);

    console.log('🇲🇽 MEXICAN COMPLIANCE CONSENT:', {
      timestamp: fullConsent.consentDate,
      iftCompliance: true,
      lfpdppp: true,
      permissions: fullConsent
    });
  };

  if (showConsent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-blue-500 rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🇲🇽</div>
            <h2 className="text-xl font-bold text-blue-400">Cumplimiento Regulatorio México</h2>
            <div className="text-sm text-gray-400 mt-2">IFT • LFPDPPP • Normatividad Mexicana</div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-blue-900 border border-blue-500 rounded p-3">
              <h3 className="font-semibold text-blue-200 mb-2">📡 Instituto Federal de Telecomunicaciones (IFT)</h3>
              <p className="text-blue-100 text-xs">Esta aplicación cumple con las regulaciones del IFT para servicios de emergencia y comunicación satelital en territorio mexicano.</p>
            </div>

            <div className="bg-green-900 border border-green-500 rounded p-3">
              <h3 className="font-semibold text-green-200 mb-2">🔒 Ley Federal de Protección de Datos (LFPDPPP)</h3>
              <p className="text-green-100 text-xs">El tratamiento de sus datos personales se realiza conforme a la normatividad mexicana de protección de datos personales.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white">Consentimiento Informado Requerido:</h3>
              
              <label className="flex items-start gap-3 p-3 bg-gray-800 rounded">
                <input type="checkbox" className="mt-1" id="location" />
                <div>
                  <div className="font-medium text-white">📍 Servicios de Localización de Emergencia (ELS)</div>
                  <div className="text-xs text-gray-400">Compartir ubicación precisa con servicios de emergencia</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-800 rounded">
                <input type="checkbox" className="mt-1" id="emergency" />
                <div>
                  <div className="font-medium text-white">📞 Contactos de Emergencia</div>
                  <div className="text-xs text-gray-400">Notificar automáticamente a contactos designados</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-800 rounded">
                <input type="checkbox" className="mt-1" id="medical" />
                <div>
                  <div className="font-medium text-white">🏥 Información Médica</div>
                  <div className="text-xs text-gray-400">Almacenar y compartir datos médicos con servicios de emergencia</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-800 rounded">
                <input type="checkbox" className="mt-1" id="sharing" />
                <div>
                  <div className="font-medium text-white">🔄 Compartir Datos con Terceros</div>
                  <div className="text-xs text-gray-400">Compartir datos con servicios de emergencia, hospitales y autoridades</div>
                </div>
              </label>
            </div>

            <div className="bg-yellow-900 border border-yellow-500 rounded p-3 text-xs">
              <div className="font-semibold text-yellow-200 mb-1">⚖️ Sus Derechos (ARCO)</div>
              <div className="text-yellow-100">Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales conforme a la LFPDPPP.</div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => {
              const locationConsent = (document.getElementById('location') as HTMLInputElement)?.checked;
              const emergencyConsent = (document.getElementById('emergency') as HTMLInputElement)?.checked;
              const medicalConsent = (document.getElementById('medical') as HTMLInputElement)?.checked;
              const sharingConsent = (document.getElementById('sharing') as HTMLInputElement)?.checked;

              giveConsent({
                locationTracking: locationConsent,
                emergencyContacts: emergencyConsent,
                medicalData: medicalConsent,
                dataSharing: sharingConsent
              });
            }} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded">
              ✅ Acepto y Consiento
            </button>
            <button onClick={() => {
              alert('Para usar funciones de emergencia, debe aceptar el tratamiento de datos conforme a la normatividad mexicana.');
            }} className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded">
              ❌ Rechazar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!consent) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-green-900 border border-green-500 rounded-lg p-3 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-400">🇲🇽</span>
          <span className="text-green-200 font-semibold text-sm">Cumplimiento MX</span>
        </div>
        
        <div className="text-xs text-green-100 space-y-1">
          <div>✅ IFT Compliance</div>
          <div>✅ LFPDPPP Compliance</div>
          <div>📅 {new Date(consent.consentDate).toLocaleDateString()}</div>
        </div>

        <button onClick={() => setShowConsent(true)} className="text-xs text-green-300 hover:text-green-200 mt-2">
          Revisar Consentimientos
        </button>
      </div>
    </div>
  );
}
