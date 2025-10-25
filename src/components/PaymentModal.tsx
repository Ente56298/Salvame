import React, { useState } from 'react';

interface PaymentModalProps {
    service: string;
    cost: number;
    onClose: () => void;
    onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ service, cost, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">Confirmar Servicio</h2>
                <div className="mb-4">
                    <p className="text-gray-300">Servicio: {service}</p>
                    <p className="text-green-400 font-bold text-lg">${cost} MXN</p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Método de pago:</label>
                    <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'cash')}
                        className="w-full bg-gray-800 text-white p-2 rounded"
                    >
                        <option value="card">Tarjeta</option>
                        <option value="cash">Efectivo</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-gray-700 text-white py-2 rounded">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="flex-1 bg-blue-600 text-white py-2 rounded">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;