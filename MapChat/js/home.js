// js/home.js

import { includeHTML } from './common.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
    getDatabase,
    ref,
    set,
    onValue,
    onDisconnect,
    push,
    update,
    onChildAdded,
    onChildChanged,
    onChildRemoved
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";(async () => {

// удаление из списка блокировки
function unblockUser(id) {
    set(ref(db, `blocked/${deviceId}/${id}`), null)
      .then(() => {
        alert('Пользователь разблокирован');
        renderBlockedList();
      });
  }
  const reverseBlocked = {};
  function styleMarker(id) {
    const u = allUsersCache[id];
    if (!u || !markers[id]) return;
    const byMe   = !!blockedList[id];
    const byThem = !!reverseBlocked[id];
    const blocked = byMe || byThem;
    const baseColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
    const col = blocked ? '#888888' : baseColor;
    markers[id].setStyle({
      radius:     markerSize,
      color:      col,
      fillColor:  col,
      fillOpacity: blocked ? 0.6 : 1,
      weight:     blocked ? 1   : 2
    });
  }

  // делегируем клики по «Разблокировать»
  document.addEventListener('click', e => {
    if (e.target.matches('.unblock-btn')) {
      unblockUser(e.target.dataset.id);
      return;
    }
    // — остальной ваш делегат (accept-btn, decline-btn, request-btn)…
  });





  // 0) Загрузка header/footer (если есть)
  await includeHTML('#header', '../components/header.html');
  await includeHTML('#footer', '../components/footer.html');

// 1) Тоггл панели
const toggleBlockedBtn = document.getElementById('toggleBlocked');
const blockedPanel     = document.getElementById('blockedPanel');
const closeBlockedBtn  = document.getElementById('closeBlocked');

toggleBlockedBtn.onclick = () => {
  renderBlockedList();
  blockedPanel.classList.add('open');
};
closeBlockedBtn.onclick = () => {
  blockedPanel.classList.remove('open');
};




    // 1. Слушаем все клики по документу
    document.addEventListener('click', e => {
          // 1) Сначала “Принять” / “Отказать” в попапе
           if (e.target.matches('.accept-btn')) {
             acceptRequest(e.target.dataset.from);
             return;
           }
           if (e.target.matches('.decline-btn')) {
             declineRequest(e.target.dataset.from);
             return;
           }
        
           // 2) Затем “Подать запрос” на маркере
           const btn = e.target.closest('.request-btn');
           if (btn) {
             sendChatRequest(btn.dataset.to);
           }
         });
  
  // 2. Функция отправки
  function sendChatRequest(toId) {
    const reqRef = ref(db, `requests/${toId}/${deviceId}`);
    set(reqRef, {
      status:    'pending',
      timestamp: Date.now()
    })

       .then(() => {
          // после успешной отправки — запоминаем, кому отправили
              outgoingRequests.push(toId);
            })

         .then(() => {
               alert('Запрос отправлен');
               // подписываемся на принятие и показываем чат на карте
               const myReqRef = ref(db, `requests/${toId}/${deviceId}`);
               onValue(myReqRef, snap => {
                 if (snap.val()?.status === 'accepted') {
                   // сначала открываем чат
        const chatId = [deviceId, toId].sort().join('_');
        openChat(chatId, toId);
        // потом удаляем все остальные висящие запросы
        outgoingRequests.forEach(otherId => {
          if (otherId !== toId) {
            set(ref(db, `requests/${otherId}/${deviceId}`), null);
          }
        });
        // сбрасываем массив — теперь активен только этот чат
        outgoingRequests = [toId];
                 }
               });



             })
             .catch(err => console.error(err) || alert('Ошибка отправки'));
  }

  
  // 1) Firebase
  const firebaseConfig = {
    apiKey:    "AIzaSyCVx5ivejptnndxViX--VF9fUVaEpfxg-s",
    authDomain:"wektorrrrr.firebaseapp.com",
    databaseURL:"https://wektorrrrr-default-rtdb.firebaseio.com",
    projectId: "wektorrrrr",
    storageBucket:"wektorrrrr.firebasestorage.app",
    messagingSenderId:"756460949205",
    appId:     "1:756460949205:web:6268c23460d3d65b2fdc5c",
    measurementId:"G-VJE6WCDDSM"
  };
  const app = initializeApp(firebaseConfig);
  const db  = getDatabase(app);

  const markers = {};

  let allUsersCache = {};
  let blockedList = {};
  // список ID тех, кому мы отправили запрос
  let outgoingRequests = [];

  // сразу объявляем и инициализируем маркер-сайзер
 let markerSize = +localStorage.getItem('markerSize') || 8;
 const sizeInput = document.getElementById('markerSizeInput');
 const sizeLabel = document.getElementById('markerSizeLabel');
 sizeInput.value = markerSize;
 sizeLabel.textContent = markerSize;
 sizeInput.addEventListener('input', e => {
   markerSize = +e.target.value;
   sizeLabel.textContent = markerSize;
   localStorage.setItem('markerSize', markerSize);
   updateAllMarkersSize();
 });

  // 2) Постоянный deviceId
  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2,9);
    localStorage.setItem('deviceId', deviceId);
  }
  const userRef = ref(db, 'users/' + deviceId);
  onDisconnect(userRef).remove(); // удаление при выходе

     //  —— блокированные мной

      const blockedRef = ref(db, `blocked/${deviceId}`);

      onValue(ref(db, 'users'), snap => {
        const users = snap.val() || {};
        Object.keys(users).forEach(id => {
          if (id === deviceId) return;
          onValue(ref(db, `blocked/${id}/${deviceId}`), rs => {
            reverseBlocked[id] = !!rs.val();
            styleMarker(id);
          });
        });
      });
      onValue(blockedRef, snap => {
       blockedList = snap.val() || {};
       console.log('=== blockedList updated ===', blockedList);


       console.log('markers keys:', Object.keys(markers));
       Object.keys(markers).forEach(id => styleMarker(id));
     });
      





  // 3) Фото пользователя
  let photoData = localStorage.getItem('photoData') || null;
  const photoInput = document.getElementById('photoInput');
  if (photoInput) {
    photoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        photoData = reader.result;
        localStorage.setItem('photoData', photoData);
      };
      reader.readAsDataURL(file);
    });
  }

  // 4) Инициализация карты
  const map = L.map('map', { zoomControl: false })
               .setView([55.751244, 37.618423], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    
  attribution: '© OpenStreetMap'
  }).addTo(map);

  // 5) Ваш маркер (зелёный или фото)
  let myMarker = null;
  onValue(userRef, snap => {
    const d = snap.val();
    if (!d) return;
    if (myMarker) map.removeLayer(myMarker);

    let markerOpts;
    if (photoData) {
      markerOpts = {
        icon: L.divIcon({
          html: `<div class="user-photo" style="
            background-image:url('${photoData}');
          "></div>`,
          className: '',
          iconSize: [50,50]
        })
      };
    }

    if (photoData) {
        const myIcon = L.divIcon({ /* ваш код по созданию divIcon */ });
        myMarker = L.marker([d.latitude, d.longitude], { icon: myIcon })
                     .addTo(map)
                     .openPopup();
      } else {
        // создаём круглый маркер, у которого есть setRadius
        myMarker = L.circleMarker([d.latitude, d.longitude], {
          radius: markerSize,
          color:  '#006400',
          fillColor: '#00ff00',
          fillOpacity: 1,
          weight: 2
        })
        .addTo(map)
        .openPopup();
      }
  });


  
  const allRef = ref(db, 'users');
onValue(allRef, snap => {
  const users = snap.val() || {};
  allUsersCache = users;

  Object.entries(users).forEach(([id, u]) => {
    if (id === deviceId) return;
    const isBlocked = !!blockedList[id];
    const baseColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
    const opts = {
      radius:     markerSize,
      color:      isBlocked ? '#888888' : baseColor,
      fillColor:  isBlocked ? '#bbbbbb' : baseColor,
      fillOpacity:isBlocked ? 0.6       : 1,
      weight:     isBlocked ? 1         : 2
    };
    // проверяем, заблокировал ли меня этот пользователь
    Object.entries(users).forEach(([id, u]) => {
        if (id === deviceId) return;
        // 1) создаём маркер (если ещё нет)
        if (!markers[id]) {
          markers[id] = L.circleMarker([u.latitude, u.longitude], {})
                         .addTo(map);
        }
        // 2) окрашиваем в зависимости от блокировок
        styleMarker(id);
        // 3) строим попап
        const byThem = !!reverseBlocked[id];
        const popup = byThem
          ? `<strong>Вы заблокированы</strong>`
          : `<strong>${u.name}, ${u.age} лет</strong>`
            + (u.message ? `<br>${u.message}` : ``)
            + `<br><button class="request-btn" data-to="${id}">Подать запрос</button>`;
        markers[id].bindPopup(popup);
      });
    
  });

  
  
  sizeInput.value = markerSize;
  sizeLabel.textContent = markerSize;

  // 7) Сохранение/обновление профиля
  const saveBtn = document.getElementById('saveProfile');
  saveBtn.textContent = localStorage.getItem('profileSent') ? 'Обновить' : 'Сохранить';
  saveBtn.addEventListener('click', () => {
    const name   = document.getElementById('username').value.trim();
    const age    = document.getElementById('age').value.trim();
    const gender = document.getElementById('gender').value;
    const msg    = document.getElementById('message').value.trim();
    if (!name || !age) return alert('Введите имя и возраст!');
    navigator.geolocation.getCurrentPosition(
      pos => save(name, age, gender, msg, pos.coords.latitude, pos.coords.longitude),
      ()   => { const c = map.getCenter(); save(name, age, gender, msg, c.lat, c.lng); },
      { enableHighAccuracy:true, timeout:5000, maximumAge:0 }
    );
  });
  function save(name, age, gender, msg, lat, lng) {
    set(userRef, { name, age, gender, message: msg, latitude: lat, longitude: lng, timestamp: Date.now() })
      .then(() => {
        localStorage.setItem('profileSent','true');
        localStorage.setItem('lastName', name);
        localStorage.setItem('lastAge',  age);
        localStorage.setItem('lastMsg',  msg);
        saveBtn.textContent = 'Обновить';
        startWatch(name, age, gender, msg);
      })
      .catch(e => console.error(e) || alert('Не удалось сохранить профиль.'));
  }
  sizeInput.addEventListener('input', e => {
    markerSize = +e.target.value;
    sizeLabel.textContent = markerSize;
    localStorage.setItem('markerSize', markerSize);
    updateAllMarkersSize();
  });

  // после инициализации db и deviceId

  const requestsRef = ref(db, `requests/${deviceId}`);
  const shown = {};
  
  // 1) Новый запрос
  onChildAdded(requestsRef, snap => {
    const fromId = snap.key, req = snap.val();
    if (req.status === 'pending' && !shown[fromId]) {
      showIncomingRequest(fromId);
      shown[fromId] = true;
    }
  });
  
  // Функция для закрытия «pending»-попапа и восстановления дефолтного
  function closeAndRebind(fromId) {
    const m = markers[fromId];
    if (!m) return;
    m.closePopup();
    m.unbindPopup();
    bindDefaultPopup(fromId);
    delete shown[fromId];
  }
  
  // 2) Изменился статус (accepted или declined)
  onChildChanged(requestsRef, snap => {
    const { status } = snap.val() || {};
    if (status !== 'pending') closeAndRebind(snap.key);
  });
  
  // 3) Запись удалили (null)
  onChildRemoved(requestsRef, snap => {
    closeAndRebind(snap.key);
  });
  
  // Вспомогательный метод — привязывает обычный popup «info + Подать запрос»
  function bindDefaultPopup(id) {
    const u = allUsersCache[id] || {};
    const base = u.gender==='female'? '#ff69b4':'#1e90ff';
    const blocked = blockedList[id] || reverseBlocked[id];
    const html = blocked
      ? `<strong>Вы заблокированы</strong>`
      : `<strong style="color:${base}">${u.name}, ${u.age} лет</strong>`
        + (u.message? `<br>${u.message}` : '')
        + `<br><button class="request-btn" data-to="${id}">Подать запрос</button>`;
    markers[id].bindPopup(html);
  }
  
});



function acceptRequest(fromId) {
    const chatId = [deviceId, fromId].sort().join('_');
    const updates = {};
  
    // создаём участников чата
    updates[`chats/${chatId}/members/${deviceId}`] = true;
    updates[`chats/${chatId}/members/${fromId}`]   = true;
    // текущий запрос — accepted
    updates[`requests/${deviceId}/${fromId}`] = {
      status:    'accepted',
      timestamp: Date.now()
    };
    // удаляем все прочие исходящие pending
    outgoingRequests.forEach(otherId => {
      if (otherId !== fromId) {
        updates[`requests/${otherId}/${deviceId}`] = null;
      }
    });
  
    update(ref(db), updates)
      .then(() => {
        outgoingRequests = [fromId];
        openChat(chatId, fromId);
      })
      .catch(console.error);
  }

// новый — просто удаляем запрос
function declineRequest(fromId) {
    const path = `requests/${deviceId}/${fromId}`;
    // 1) Удаляем запрос в БД
    set(ref(db, path), null)
      .catch(err => console.error('Ошибка отмены запроса:', err))
      .finally(() => {
        // 2) Локально закрываем и отвязываем попап
        const m = markers[fromId];
        if (m) {
          m.closePopup();
          m.unbindPopup();
          bindDefaultPopup(fromId);
          // и если вы храните shown[fromId], удаляем его
          delete shown[fromId];
        }
      });
  }

function showIncomingRequest(fromId) {
    const marker = markers[fromId];
    if (!marker) return;
  
    // берём данные пользователя из кэша
    const user = allUsersCache[fromId] || {};
    const userName = user.name || fromId;
    const userAge  = user.age  ? `${user.age} лет` : '';
    // выбираем цвет рамки: синий для мужчин, розовый для женщин
    const borderColor = user.gender === 'female' ? '#ff69b4' : '#1e90ff';
  
    const popupContent = `
      <div style="
        border: 2px solid ${borderColor};
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        max-width: 200px;
      ">
        <p style="margin:0; font-weight:bold; color:${borderColor};">
          ${userName}${userAge ? `, ${userAge}` : ''}
        </p>
        <p style="margin:8px 0 12px;">хочет с вами поговорить</p>
        <button class="accept-btn"  data-from="${fromId}">Принять</button>
        <button class="decline-btn" data-from="${fromId}">Отказать</button>
      </div>
    `;
  
    marker
      .unbindPopup()
      .bindPopup(popupContent, {
        closeOnClick: false,
        autoClose:    false,
        closeButton:  false
      })
      .openPopup();
  }
  



  function updateAllMarkersSize() {
    // ваш маркер
    if (myMarker && !photoData) {
      myMarker.setRadius(markerSize);
    }
    // если фото-иконка — меняем iconSize и iconAnchor
    if (myMarker && photoData) {
      const html = `
        <div style="
          width: ${markerSize*2}px;
          height: ${markerSize*2}px;
          border: 2px solid #006400;
          border-radius: 50%;
          background-color: rgba(0,255,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${photoData}" style="
            width: ${markerSize*2-10}px;
            height: ${markerSize*2-10}px;
            border-radius: 50%;
            object-fit: cover;
          "/>
        </div>`;
      const myIcon = L.divIcon({
        html,
        className: '',
        iconSize: [markerSize*2, markerSize*2],
        iconAnchor: [markerSize, markerSize]
      });
      myMarker.setIcon(myIcon);
    }
  
    // маркеры остальных
    Object.values(markers).forEach(m => {
      m.setRadius(markerSize);
    });
  }
  function openChat(chatId, peerId) {
  
        // переключаемся на экран “Карта” и показываем оверлей
        showScreen(1);
        const overlay = document.getElementById('chatOverlay');

         
         overlay.style.display = 'flex';
           
           // 1) Публикуем, что мы в чате
           const myPresRef = ref(db, `chats/${chatId}/presence/${deviceId}`);
           set(myPresRef, true);
           onDisconnect(myPresRef).remove();
             overlay.innerHTML = `
               <div class="chat-header">
                <span id="chatStatus">…</span>
           <div>
             <button id="exitChat">Выйти</button>
             <button id="blockChat">Заблокировать</button>
           </div>
         </div>
         <div id="messages"></div>
         <div class="chat-input">
           <input id="msgInput" placeholder="Введите сообщение…" />
           <button id="sendMsg">Отправить</button>
         </div>
       `;

         // 2) Подписываемся на статус присутствия собеседника
         const peerPresRef = ref(db, `chats/${chatId}/presence/${peerId}`);
  onValue(peerPresRef, snap => {
    const inChat = snap.val() === true;
    const name = allUsersCache[peerId]?.name || peerId;
    document.getElementById('chatStatus').textContent =
      `${name} ${inChat ? 'в чате' : 'не в чате'}`;
  });
       310    // слушаем Exit и Block
    
       const mapSection = document.getElementById('welcome'); // контейнер карты

document.getElementById('exitChat').onclick = () => {
      // удаляем свой статус
      set(myPresRef, null).finally(() => {
        overlay.style.display = 'none';
      });
 };

document.getElementById('blockChat').onclick = () => {
    set(ref(db, `blocked/${deviceId}/${peerId}`), {
        timestamp: Date.now()
      })
        .then(() => {
          overlay.style.display = 'none';
          alert('Пользователь заблокирован');
          renderBlockedList();
        })
    .catch(err => console.error(err) || alert('Ошибка блокировки'));
};



    // слушаем новые сообщения
    const msgsRef = ref(db, `chats/${chatId}/messages`);
    onValue(msgsRef, snap => {
        const msgs = snap.val() || {};
        const box  = document.getElementById('messages');
        box.innerHTML = '';
        Object.entries(msgs).forEach(([mid, m]) => {
          const div = document.createElement('div');
          div.className = 'message ' + (m.from === deviceId ? 'me' : 'peer');
          div.textContent = m.text;
          box.appendChild(div);          // <- вставляем в контейнер
        });
        box.scrollTop = box.scrollHeight;
      });
   
    
    // отправка
    document.getElementById('sendMsg').onclick = () => {
      const text = document.getElementById('msgInput').value.trim();
      if (!text) return;
      const newMsgRef = push(msgsRef);
      set(newMsgRef, {
        from:      deviceId,
        text,
        timestamp: Date.now()
      });
      document.getElementById('msgInput').value = '';
    };
  }
  

  // 8) Постоянное слежение
  function startWatch(name, age, gender, msg) {
    navigator.geolocation.watchPosition(
      p => set(userRef, {
        name, age, gender, message: msg,
        latitude:  p.coords.latitude,
        longitude: p.coords.longitude,
        timestamp: Date.now()
      }).catch(console.error),
      err => console.error('Гео-ошибка:', err),
      { enableHighAccuracy:true, timeout:5000, maximumAge:0 }
    );
  }
  if (localStorage.getItem('profileSent')) {
    startWatch(
      localStorage.getItem('lastName'),
      localStorage.getItem('lastAge'),
      document.getElementById('gender').value,
      localStorage.getItem('lastMsg')
    );
  }

  // 9) Тема светлая/тёмная
  const lightBtn = document.getElementById('lightMode');
  const darkBtn  = document.getElementById('darkMode');
  let theme = localStorage.getItem('theme') || 'light';
  applyTheme(theme);
  lightBtn.onclick = () => applyTheme('light');
  darkBtn .onclick = () => applyTheme('dark');
  function applyTheme(t) {
    localStorage.setItem('theme', t);
    document.body.classList.toggle('dark-theme', t==='dark');
    lightBtn.classList.toggle('active', t==='light');
    darkBtn .classList.toggle('active', t==='dark');
  }

  // 10) Цветовые акценты
  const squares = document.querySelectorAll('.color-square');
  let accent = localStorage.getItem('accent') || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  applyAccent(accent);
  squares.forEach(sq => sq.onclick = () => applyAccent(sq.dataset.color));
  function applyAccent(c) {
    document.documentElement.style.setProperty('--primary', c);
    localStorage.setItem('accent', c);
    squares.forEach(sq => sq.classList.toggle('selected', sq.dataset.color===c));
  }

  // 11) Навигация по экранам
  const screensEl   = document.getElementById('screens');
  const btnFeat     = document.getElementById('btnFeatures');
  const btnMap      = document.getElementById('btnMap');
  const btnProf     = document.getElementById('btnProfile');
  function showScreen(idx) {
    screensEl.style.transform = `translateX(-${idx*100}vw)`;
    btnFeat.classList.toggle('active', idx===0);
    btnMap .classList.toggle('active', idx===1);
    btnProf.classList.toggle('active', idx===2);
    if(idx===1) document.getElementById('toMap').click();
  }
  btnFeat.onclick = () => showScreen(0);
  btnMap .onclick = () => showScreen(1);
  btnProf.onclick = () => showScreen(2);
  showScreen(0);

  // 12) «Открыть карту»
  document.getElementById('toMap').onclick = () => {
    document.querySelector('#welcome .overlay').style.display = 'none';
    map.invalidateSize();
  };

  
  document.getElementById('toMap').onclick = () => {
    document.querySelector('#welcome .overlay').style.display = 'none';
    map.invalidateSize();
  };

 // рендер списка заблокированных в профиле
 function renderBlockedList() {
    const ul = document.getElementById('blockedList');
    ul.innerHTML = '';
    Object.entries(blockedList).forEach(([id, data]) => {
      const name = allUsersCache[id]?.name || id;
      const time = data?.timestamp
        ? new Date(data.timestamp).toLocaleString()
        : '';
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="blocked-item">
          <span class="blocked-name">${name}</span>
          ${time ? `<small class="blocked-time">${time}</small>` : ''}
          <button class="unblock-btn" data-id="${id}">Разблокировать</button>
        </div>`;
      ul.appendChild(li);
    });
  }
  

})();