import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

import { includeHTML } from './common.js';
import { initializeApp }    from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getDatabase, ref, push, set }
 
from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

// 1) Подтягиваем header и footer
await includeHTML('#header', '../components/header.html');
await includeHTML('#footer', '../components/footer.html');

// 2) Инициализируем Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVx5ivejptnndxViX--VF9fUVaEpfxg-s",
  authDomain: "wektorrrrr.firebaseapp.com",
  databaseURL: "https://wektorrrrr-default-rtdb.firebaseio.com",
  projectId: "wektorrrrr",
  storageBucket: "wektorrrrr.firebasestorage.app",
  messagingSenderId: "756460949205",
  appId: "1:756460949205:web:6268c23460d3d65b2fdc5c",
  measurementId: "G-VJE6WCDDSM"
};
const app       = initializeApp(firebaseConfig);
const database  = getDatabase(app);

// 3) Обработчик «Зарегистрироваться»
document.getElementById('submitRegistration')
  .addEventListener('click', async () => {
    const name = document.getElementById('name').value.trim();
    const age  = document.getElementById('age' ).value.trim();
    if (!name || !age) {
      alert('Пожалуйста, заполните имя и возраст.');
      return;
    }
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        startTracking(user.uid);
      } else {
        // например: анонимный вход
        signInAnonymously(auth)
          .then(cred => startTracking(cred.user.uid))
          .catch(err => console.error(err));
      }
    });
    // сохраняем профиль в Firebase
    
    set(userRef, {
           name, age, gender, message: msg,
           latitude: lat, longitude: lng,
           timestamp: Date.now()
         })

    // ставим флаг, чтобы при следующем заходе сразу открывать home
    localStorage.setItem('profileSent','true');
    localStorage.setItem('lastName', name);
    localStorage.setItem('lastAge',  age);

    // переходим на главный экран
    window.location.href = 'home.html';
  });
  function sendLocationToFirebase(lat, lng) {
    const uid = getAuth().currentUser.uid;
    const locRef = ref(db, `locations/${uid}`);
    set(locRef, {
      latitude:  lat,
      longitude: lng,
      timestamp: Date.now()
    });
  }

  let deviceId = localStorage.getItem('deviceId');
if (!deviceId) {
  deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2,9);
  localStorage.setItem('deviceId', deviceId);
}
const userRef = ref(db, 'users/' + deviceId);

let currentMarker = null;
onValue(userRef, snap => {
  const data = snap.val();
  if (!data) return;
  // удаляем старый маркер
  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker([data.latitude, data.longitude])
                     .addTo(map)
                     .bindPopup(`<strong>${data.name}, ${data.age} лет</strong>${data.message?`<br>${data.message}`:''}`)
                     .openPopup();
});

function saveProfile(name, age, gender, msg, lat, lng) {
    return set(userRef, {
      name, age, gender, message: msg,
      latitude: lat, longitude: lng,
      timestamp: Date.now()
    });
  }
  
  saveBtn.addEventListener('click', () => {
    // собираем поля, геопозицию…
    saveProfile(name, age, gender, msg, lat, lng)
      .then(() => {
        // отмечаем, запускаем watchPosition…
      });
  });

  navigator.geolocation.watchPosition(pos => {
    saveProfile(name, age, gender, msg, pos.coords.latitude, pos.coords.longitude);
  }, err => console.error(err), {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  });

  
