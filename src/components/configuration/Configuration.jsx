import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Configuration() {
    const [port, updatePort] = useState(null);
    const [sendEvents, updateSendEvents] = useState([]);
    const [socket, updateSocket] = useState(null);
    const [receivedEvents, updateReceivedEvents] = useState([]);
    const [extraHeaders, updateExtraHeaders] = useState(null);
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
        const newExtraHeaders = e.target.extraHeaders?.value;

        updatePort(newPort);
        let newExtraHeadersObj
        if(newExtraHeaders){
            newExtraHeadersObj = JSON.parse(newExtraHeaders);
            updateExtraHeaders(newExtraHeadersObj);
        }
        const newSocket = io(newPort,{
            extraHeaders: newExtraHeadersObj
        });
        
        newSocket.on('connect', () => {
            updateSocket(newSocket)
        });

        if (newSendEvent) {
            // console.log(sendEvents)
            const events = newSendEvent.split(',');
            updateSendEvents(events);
        }
    };

    useEffect(() => {
        
        if (socket) {
            console.log(socket)
            socket.on(('connect', () => console.log("connected")))
            sendEvents.forEach(event => {
                socket.on(event, (data) => {
                    console.log(`Event listened: ${event}`);
                    console.log('Data: ', data);
                    const newObj = {
                        "Event Listened": event,
                        "Data": data
                    }
                    receivedEvents.push(newObj);
                    updateReceivedEvents([...receivedEvents]);
                    console.log({receivedEvents})
                });
            });
        }
    }, [sendEvents, socket]);

    return (
        <>
            <form onSubmit={submitConfig}>
                <input type="text" name="port" placeholder="Port" />
                <input type="text" name="receivedEvent" placeholder="Send Event, separated by comma" />
                <textarea id="jsonInput" placeholder="headers in json format" rows="10" cols="50" name="extraHeaders"></textarea>
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
            {receivedEvents.map((x,i)=>
             <details key={i}>
                <summary>{x["Event Listened"]}</summary>
                <p>{x["Data"]}</p>
            </details> 
            )}
        </>
    );
}
