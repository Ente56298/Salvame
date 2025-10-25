import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface ServiceRatingProps {
    serviceId: string;
    onSubmit: (rating: number, comment: string) => void;
}

const ServiceRating: React.FC<ServiceRatingProps> = ({ serviceId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold mb-3">Califica el servicio</h3>
            
            <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                        <StarIcon className="w-8 h-8" />
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comentarios (opcional)"
                className="w-full bg-gray-700 text-white p-2 rounded mb-3"
                rows={3}
            />

            <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full bg-blue-600 disabled:bg-gray-600 text-white py-2 rounded"
            >
                Enviar Calificación
            </button>
        </div>
    );
};

export default ServiceRating;