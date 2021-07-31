export default class MessageSender{
    constructor(element, onSend){
        this.onSend = onSend;
        this.messageInput = element.querySelector('[data-role=message-input]');
        this.messageSendButton = element.querySelector('[data-role=message-send-button]');

        messageSendButton.addEventListener('click', ()=>{
            const message = messageInput.value.trim();

            if (message) {
                this.onSend(message);
              }
        });
    }

    clear() {
    this.messageInput.value = '';
  }
}