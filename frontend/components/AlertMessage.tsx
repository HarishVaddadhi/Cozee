import React from 'react';

interface AlertMessageProps {
    message: string;
    type: 'error' | 'success';
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`${bgColor} text-white p-4 rounded-md mt-4`}>
            {message}
        </div>
    );
};

export default AlertMessage;