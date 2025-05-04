// mapchat.js

// Инициализация карты
var map = L.map('map').setView([55.7558, 37.6173], 12); // Начальная позиция (Москва)

// Добавление слоя карты (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Добавление маркера для текущего пользователя
var userMarker = L.marker([55.7558, 37.6173]).addTo(map); // Примерная позиция
userMarker.bindPopup("Вы здесь").openPopup();

// Функция для добавления маркеров на карту
function addMarker(lat, lon) {
  var marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup("Собеседник").openPopup();
}

// Пример добавления маркера для собеседника
addMarker(55.7580, 37.6175); // Примерная позиция собеседника
