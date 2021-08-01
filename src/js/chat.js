import LoginWindow from "./ui/loginWindow";
import MainWindow from "./ui/mainWindow";
import UserName from "./ui/userName";
import WebSocket from "./client";
import MessageList from "./ui/messageList";
import MessageSender from "./ui/messageSender";
import UserList from "./ui/userList" 

export default class Chat {
    constructor() {
        this.WsClient = new WebSocket(
        `ws://localhost:8282/chat/ws`,
        this.onMessage.bind(this),
        )

        this.ui = {
            loginWindow: new LoginWindow(
                document.querySelector('#login'),
                this.onLogin.bind(this)
            ),
            mainWindow: new MainWindow(document.querySelector('#main')),
            userName: new UserName(document.querySelector('[data-role=user-name]')),
            messageList: new MessageList(document.querySelector('[data-role=messages-list]')),
            messageSender: new MessageSender(
                document.querySelector('[data-role=message-sender]'),
                this.onSend.bind(this)
            ),
            userList: new UserList(document.querySelector('[data-role=user-list]'))
        }

        this.ui.loginWindow.show();
    }

    onSend(message) {
        this.WsClient.sendTextMessage(message);
        this.ui.messageSender.clear();
    }

    async onLogin(name) {
        await this.WsClient.connect();
        this.WsClient.sendHello(name);
        this.ui.loginWindow.hide();
        this.ui.mainWindow.show();
        this.ui.userName.set(name);
    }

    onMessage({type, from, data}){
        console.log(type, from, data);

        if (type === 'hello') {
            this.ui.messageList.addSystemMessage(`${from} вошел в чат`);
            this.ui.userList.add(from);
        } else if (type === "text-message"){
            this.ui.messageList.add(from, data.message);
        } else if  (type === "user-list") {
            for(const item of data){
                this.ui.userList.add(item);
            }
        } 
        else if (type === 'bye-bye'){
            this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
            this.ui.userList.remove(from);
        }
    }
 }