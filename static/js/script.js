document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.getElementById('chat-container');
    const chatButton = document.getElementById('chat-button');
    const chatImage = document.getElementById('chat-image');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    document.getElementById('minimize-button').addEventListener('click', minimizeChatbox);
    document.getElementById('maximize-button').addEventListener('click', toggleMaximizeChatbox);
    document.getElementById('close-button').addEventListener('click', closeChatSession);

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // Prevent the default behavior (e.g., form submission)
            event.preventDefault();
            // Trigger the click event on the submit button
            sendButton.click();
        }
    });

    function minimizeChatbox() {
        const chatContainer = document.getElementById('chat-container');
    
        if (chatContainer.classList.contains('maximized'))
        {
            // If maximized, restore to the original size
            chatContainer.classList.remove('maximized');
            chatContainer.style.width = '';
            chatContainer.style.height = '';
            chatContainer.style.bottom = '80px';
            chatContainer.style.right = '20px';
            chatContainer.style.maxWidth = '400px';
            chatContainer.style.borderRadius = '10px';
        } 
        else
        {
            // If not maximized, close the chatbox
            chatContainer.style.display = 'none';
        }
    }

    function toggleMaximizeChatbox() {
        const chatContainer = document.getElementById('chat-container');
        const isMaximized = chatContainer.classList.toggle('maximized');
    
        if (isMaximized) {
            chatContainer.style.width = '80%'; // Adjust width as needed
            chatContainer.style.height = '80vh'; // Adjust height as needed
            chatContainer.style.bottom = '10px';
            chatContainer.style.right = '10px';
            chatContainer.style.maxWidth = 'none'; // Remove max-width for maximizing
            chatContainer.style.borderRadius = '10px';
        } else {
            // Reset styles when not maximized
            chatContainer.style.width = '';
            chatContainer.style.height = '';
            chatContainer.style.bottom = '80px';
            chatContainer.style.right = '20px';
            chatContainer.style.maxWidth = '400px';
            chatContainer.style.borderRadius = '10px';
        }
    
        // Ensure the chat messages are scrolled to the bottom when maximizing
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function closeChatSession() {
        // Clear chat history
        chatMessages.innerHTML = '';
        // Display initial greeting on reopening the chat
        const welcomeMessage = `Good ${getTimeOfDay()}! I'm Insurance Genie. How may I help you?`;
        appendMessage("Genie", welcomeMessage, "bot-message");
        // Close chatbox
        chatContainer.style.display = 'none';
    }

    function getTimeOfDay() {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return "Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    }

    const welcomeMessage = `Good ${getTimeOfDay()}! I'm Insurance Genie. How may I help you?`;
    appendMessage("Genie", welcomeMessage, "bot-message");

    chatButton.addEventListener('click', function () {
        if (chatContainer.style.display === 'block') {
            chatContainer.style.display = 'none';
            chatButton.style.backgroundColor = '#4CAF50';
        } else {
            chatContainer.style.display = 'block';
            chatButton.style.backgroundColor = '#3498db';
        }
    });

    sendButton.addEventListener('click', function () {
        const userMessage = userInput.value;
        if (userMessage.trim() !== "") {
            appendMessage("You", userMessage, "user-message");
            userInput.value = "";

            // Make an AJAX request to the Flask server
            fetch('/process_input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'user_input': userMessage,
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the responses received from the server
                const genieResponse = data.responses.length > 0
                    ? formatGenieResponses(data.responses)
                    : "Sorry! I did not understand. Can you please rephrase?";
                appendMessage("Genie", genieResponse, "bot-message");
            })
            .catch(error => {
                console.error('Error processing input:', error);
            });
        }
    });

    function appendMessage(sender, message, messageClass) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', messageClass);
    
        if (sender === 'You') {
            messageElement.innerHTML = `<div class="${messageClass}">${message}</div>`;
        } else {
            messageElement.innerHTML = `
                <div class="${messageClass}">
                    ${sender === 'Genie' ? '<img src="/static/img/avatar.png" alt="Bot Icon" class="bot-icon">' : ''}
                    <div class="message-text">${message}</div>
                </div>`;
        }
    
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatGenieResponses(responses) {
        // Format Genie's responses with buttons
        const formattedResponses = responses.map(response => `<button>${response}</button>`).join(' ');
        return `Did you mean - ${formattedResponses}`;
    }
});
