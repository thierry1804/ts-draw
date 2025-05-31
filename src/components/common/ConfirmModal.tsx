import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-gray-600">{message}</p>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal; 