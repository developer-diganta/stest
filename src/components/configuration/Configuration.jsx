import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Configuration() {
    const [port, updatePort] = useState(null);
    const [sendEvents, updateSendEvents] = useState([]);
    const [socket, updateSocket] = useState(null);

    const handleChange = (event) => {
        updatePort(event.target.value);
    };

    const addSendEvents = (event) => {
        updateSendEvents([...sendEvents, event.target.value]);
    };

    const submitConfig = (e) => {
        e.preventDefault();
        const newPort = e.target.port.value;
        const newSendEvent = e.target.sendEvent.value;

        updatePort(newPort);
        const newSocket = io(newPort);
            newSocket.on('connect', () => {
                updateSocket(newSocket)
            });
        if (newSendEvent) {
            updateSendEvents([...sendEvents, newSendEvent]);
        }
    };

    // useEffect(() => {

    //     console.log(newSocket)
    //     newSocket.on('connect', () => {
    //         console.log('Connected!');
    //     });

    //     // Cleanup on component unmount
    //     return () => newSocket.close();
    // }, []);

    useEffect(() => {
        
        if (socket) {
            console.log(socket)
            socket.on(('connect', () => console.log("connected")))
            sendEvents.forEach(event => {
                socket.on(event, (data) => {
                    console.log(`Event listened: ${event}`);
                    console.log('Data: ', data);
                });
            });
        }
    }, [sendEvents, socket]);

    return (
        <>
            <form onSubmit={submitConfig}>
                <input type="text" name="port" placeholder="Port" />
                <input type="text" name="sendEvent" placeholder="Send Event" />
                <button type="submit">Save</button>
            </form>
            <div>
                Send events:
                {sendEvents.map((x, i) => <div key={i}>{x}</div>)}
            </div>
            {socket && (
                <button onClick={() => socket.emit('fromClient', { message: 'Hello from client' })}>
                    Emit Event
                </button>
            )}
        </>
    );
}
