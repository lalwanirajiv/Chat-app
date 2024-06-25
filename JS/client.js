const socket = io('http://localhost:8000');

const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector(".chat-window");

let name = prompt('Enter your name');

if (name && name.trim() !== "") {
    console.log("Your name: " + name);
    socket.emit('new-user-joined', name);

    const appendMessage = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', position);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = message; // Use innerHTML to render HTML tags

        messageElement.appendChild(messageContent);
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    socket.on('connect', () => {
        console.log("Connected to server");
    });

    socket.on('user-joined', name => {
        console.log(name + ' joined the chat');
        appendMessage(`${name} joined the chat`, 'received');
    });

    socket.on('receive', data => {
        appendMessage(`<strong>${data.name}</strong>: ${data.message}`, 'received');
    });

    const messageForm = document.getElementById('send-container');
    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message !== "") {
            appendMessage(`<strong>You</strong>: ${message}`, 'sent');
            socket.emit('send', message);
            messageInput.value = '';
        }
    });

} else {
    console.log("Name is required to join the chat");
}
