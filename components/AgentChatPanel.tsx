import React, { useState, useEffect, useRef } from 'react';
import { AssistanceType } from '../types';
import { getAgentResponse } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';
import { Content } from '@google/genai';

interface AgentChatPanelProps {
    assistanceType: AssistanceType;
    onClose: () => void;
}

const AgentChatPanel: React.FC<AgentChatPanelProps> = ({ assistanceType, onClose }) => {
    const [history, setHistory] = useState<Content[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchInitialMessage = async () => {
            setIsLoading(true);
            const initialPrompt: Content = { role: 'user', parts: [{ text: 'Hola, necesito ayuda.' }] };
            const initialResponse = await getAgentResponse([initialPrompt], assistanceType);
            setHistory([{ role: 'model', parts: [{ text: initialResponse }] }]);
            setIsLoading(false);
        };
        fetchInitialMessage();
    }, [assistanceType]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserContent: Content = { role: 'user', parts: [{ text: userInput }] };
        const updatedHistory = [...history, newUserContent];
        
        setHistory(updatedHistory);
        setUserInput('');
        setIsLoading(true);

        const responseText = await getAgentResponse(updatedHistory, assistanceType);
        const newModelContent: Content = { role: 'model', parts: [{ text: responseText }] };

        setHistory(prev => [...prev, newModelContent]);
        setIsLoading(false);
    };

    const renderMessage = (msg: Content, index: number) => {
        const textContent = msg.parts.map(part => part.text).join('');
        const isModel = msg.role === 'model';

        return (
            <div key={index} className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl ${isModel ? 'bg-gray-700 text-white rounded-bl-none' : 'bg-cyan-600 text-white rounded-br-none'}`}>
                    <p className="text-sm whitespace-pre-wrap">{textContent}</p>
                </div>
            </div>
        );
    };

    return (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-40 p-4">
            <div className="relative w-full max-w-2xl h-[90vh] bg-gray-900/80 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">{assistanceType}</h2>
                    <button onClick={onClose} className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600 transition-colors">&times;</button>
                </header>

                <div ref={chatContainerRef} className="p-4 flex-grow overflow-y-auto space-y-4">
                    {history.map(renderMessage)}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-md lg:max-w-lg p-3 rounded-2xl bg-gray-700 text-white rounded-bl-none flex items-center">
                                <SpinnerIcon className="w-5 h-5 mr-2" />
                                <span>Pensando...</span>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="p-4 border-t border-gray-700 bg-gray-900/50">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input 
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Describe tu situación..."
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-400 disabled:bg-cyan-800" disabled={isLoading || !userInput.trim()}>
                            Enviar
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default AgentChatPanel;
