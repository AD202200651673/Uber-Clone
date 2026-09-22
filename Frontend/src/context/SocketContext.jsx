import react, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';


export const SocketContext = createContext();

const socket = io('http://localhost:3000');

const SocketProvider = ({ children }) => {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected to server', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('disconnected from server');
        });

    }, []);

    const sendMessage = (eventName, message) => {
        socket.emit(eventName, message);
    };

    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);

    };

    return (
        <SocketContext.Provider value={{ socket, sendMessage, receiveMessage }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;