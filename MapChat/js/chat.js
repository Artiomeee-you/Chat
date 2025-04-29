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
  document.getElementById('sendMessage').addEventListener('click', function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
  
    if (message.trim() !== '') {
      displayMessage(message, 'user'); // Отображаем сообщение от пользователя
      messageInput.value = ''; // Очищаем поле ввода
      // Здесь можно добавить логику для отправки сообщения на сервер
    }
  });
  
  // Для демонстрации добавляем автоматический ответ
  setInterval(() => {
    displayMessage('Ответ от собеседника', 'other');
  }, 5000); // Ответ от собеседника появляется через 5 секунд
  