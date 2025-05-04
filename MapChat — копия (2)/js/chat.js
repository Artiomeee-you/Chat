// chat.js

// Функция для отображения сообщения
function displayMessage(message, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(sender);
    messageContainer.innerText = message;
    document.getElementById('messages').appendChild(messageContainer);
  }
  
  // Обработка отправки сообщения
  document.getElementById('sendMsg').addEventListener('click', function() {
    const messageInput = document.getElementById('msgInput');
    const message = messageInput.value.trim();
    if (!message) return;
    displayMessage(message, 'user');
    const newMsgRef = push(ref(db, `chats/${chatId}/messages`));
set(newMsgRef, {
  from: deviceId,
  text: message,
  timestamp: Date.now()
});
    // здесь нужно тоже пушить сообщение в Firebase, как вы делаете в home.js,
    // либо просто очищаем поле, если это демо:
    messageInput.value = '';
  });
  
  // Для демонстрации добавляем автоматический ответ
  setInterval(() => {
    displayMessage(m.text, m.from === deviceId ? 'user' : 'other');
  }, 5000); // Ответ от собеседника появляется через 5 секунд
  