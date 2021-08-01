// import io from 'socket.io-client';

export default class WebSocket{
    constructor(url, onMessage) {
       this.url = url;
       this.onMessage = onMessage;
    //    this.socket = io('http://localhost:8282');
    }

    connect() {
        return new Promise((resolve) => {
            this.socket = new WebSocket(this.url);
            // console.log(this.url);
            this.socket.addEventListener('open', resolve);
            console.log(resolve)
            this.socket.addEventListener('message', (e) => {
                this.onMessage(JSON.parse(e.data));
            });
        });
    }

    sendHello(name) {
        this.socket.sendMessage('hello', {name});
    }

    sendTextMessage(message) {
        this.socket.sendMessage('text-message', { message });
    }

    sendMessage(type, data) {
        this.socket.send(JSON.stringify({
                type,
                data,
            })
        );
    }
}   