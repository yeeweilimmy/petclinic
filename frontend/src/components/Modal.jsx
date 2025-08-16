import { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 150); // Delay to allow animation
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✓',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    borderColor: 'border-green-200'
                };
            case 'error':
                return {
                    icon: '⚠',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    borderColor: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: '⚠',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    borderColor: 'border-yellow-200'
                };
            default:
                return {
                    icon: 'ℹ',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    borderColor: 'border-blue-200'
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-cream max-w-md w-full mx-4 rounded-xl shadow-2xl border-2 ${typeStyles.borderColor} transform transition-all duration-150 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-lightBlue">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${typeStyles.iconBg} flex items-center justify-center`}>
                            <span className={`text-lg font-bold ${typeStyles.iconColor}`}>
                                {typeStyles.icon}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-darkNavy">{title}</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-darkNavy hover:text-red-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-darkNavy leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleClose}
                        className="w-full bg-primaryBlue text-cream py-3 px-4 rounded-lg hover:bg-darkNavy transition-colors duration-200 font-medium"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// Custom hook for easy modal usage
export const useModal = () => {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showModal = (message, title = 'Notice', type = 'info') => {
        setModal({
            isOpen: true,
            title,
            message,
            type
        });
    };

    const showSuccess = (message, title = 'Success') => {
        showModal(message, title, 'success');
    };

    const showError = (message, title = 'Error') => {
        showModal(message, title, 'error');
    };

    const showWarning = (message, title = 'Warning') => {
        showModal(message, title, 'warning');
    };

    const hideModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const ModalComponent = () => (
        <Modal
            isOpen={modal.isOpen}
            onClose={hideModal}
            title={modal.title}
            message={modal.message}
            type={modal.type}
        />
    );

    return {
        showModal,
        showSuccess,
        showError,
        showWarning,
        hideModal,
        ModalComponent
    };
};

export default Modal;