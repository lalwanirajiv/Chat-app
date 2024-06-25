const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector(".chat-window");

const name = prompt("Enter Name");

if (name && name.trim() !== "") {
    console.log("Your name: " + name);
    socket.emit('new-user-joined', name);

    const append = (message, position) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', position);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerText = message;

        messageElement.appendChild(messageContent);
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to the bottom
    }

    socket.on('connect', () => {
        console.log("Connected to server");
    });

    socket.on('user-joined', name => {
        console.log(name + ' joined the chat');
        append(`${name} joined the chat`, 'received');
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const message = messageInput.value;
        if (message && message.trim() !== "") {
            append(`You: ${message}`, 'sent');
            socket.emit('send', message);
            messageInput.value = '';
        }
    });

    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'received');
    });
} else {
    console.log("Name is required to join the chat");
}
