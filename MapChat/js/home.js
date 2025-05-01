await includeHTML('#header', '../components/header.html');
const shown = {};


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
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
  
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
    
  let photoData = localStorage.getItem('photoData') || null;
  (async () => {
    await includeHTML('#header', '../components/header.html');
    await includeHTML('#footer', '../components/footer.html');
// удаление из списка блокировки

  const reverseBlocked = {};
  

  // делегируем клики по «Разблокировать»
  document.addEventListener('click', e => {
    if (e.target.matches('.decline-btn')) {
      declineRequest(e.target.dataset.from);
      return;
    }
    // — остальной ваш делегат (accept-btn, decline-btn, request-btn)…
  });





  // 0) Загрузка header/footer (если есть)
  await includeHTML('#header', '../components/header.html');
  await includeHTML('#footer', '../components/footer.html');

// 1) Тоггл панели
let deviceId = localStorage.getItem('deviceId');
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);
const toggleBlockedBtn = document.getElementById('toggleBlocked');
const blockedPanel     = document.getElementById('blockedPanel');
const requestsRef = ref(db, `requests/${deviceId}`);

const declined    = {};


let   requestFlag = 1;
const closeBlockedBtn  = document.getElementById('closeBlocked');
const btnMap = document.getElementById('btnMap');
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
  

  


  const markers = {};
  
  let allUsersCache = {};
  let blockedList = {};
  let shouldCenterOnMyMarker = false;
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
  const photoInput = document.getElementById('photoInput');
  if (photoInput) {
    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          // 1) Загружаем во временный Image
          const img = new Image();
          img.onload = () => {
            // 2) Вычисляем коэффициент масштабирования
            const maxDim = 100; // желаемый диаметр в пикселях
            const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
            const w = img.width * scale;
            const h = img.height * scale;
      
            // 3) Рисуем в canvas нужного размера
            const canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
      
            // 4) Обрезаем в круг: создаём круглый клип
            const size = Math.min(w, h);
            const circ = document.createElement('canvas');
            circ.width  = size;
            circ.height = size;
            const cctx = circ.getContext('2d');
            cctx.beginPath();
            cctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
            cctx.closePath();
            cctx.clip();
            // центрируем изображение в круге
            cctx.drawImage(canvas, (size - w)/2, (size - h)/2, w, h);
      
            // 5) Рисуем цветную рамку
            const gender = document.getElementById('gender').value;
            const borderColor = gender === 'female' ? '#ff69b4' : '#1e90ff';
            cctx.beginPath();
            cctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI*2);
            cctx.lineWidth   = 4;
            cctx.strokeStyle = borderColor;
            cctx.stroke();
      
            // 6) Экспортируем в dataURL и сохраняем
            photoData = circ.toDataURL('image/png');
            localStorage.setItem('photoData', photoData);
      
            // (если вы где-то сразу рендерите превью, обновите его, например,
            // document.getElementById('photoPreview').src = photoData;)
          };
          img.src = reader.result;
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
  const controlsContainer = document.createElement('div');
controlsContainer.classList.add('map-controls');
document.getElementById('map').appendChild(controlsContainer);

// Убираем встроенный контрол
if (map.zoomControl) {
  map.zoomControl.remove();
}
// Свой плюс
const zoomIn = L.DomUtil.create('a', 'leaflet-control-zoom-in', controlsContainer);
zoomIn.innerText = '+';
zoomIn.href = '#';
zoomIn.onclick = e => { e.preventDefault(); map.zoomIn(); };

// Свой минус
const zoomOut = L.DomUtil.create('a', 'leaflet-control-zoom-out', controlsContainer);
zoomOut.innerText = '–';
zoomOut.href = '#';
zoomOut.onclick = e => { e.preventDefault(); map.zoomOut(); };
  map.getContainer().addEventListener('click', e => {
    const btn = e.target.closest('.decline-btn');
    if (!btn) return;
    const fromId = btn.dataset.from;
    if (!fromId) return;              // guard against undefined
    declineRequest(fromId);
    e.stopPropagation();
  });
  L.control.zoom({
    position: 'topright'
  }).addTo(map);
  let showMe = localStorage.getItem('showMe') !== 'false';
// Глобальный ловец открытия *любого* попапа на карте
map.on('popupopen', e => {
  const popEl = e.popup.getElement();
  // Отфильтруем только наши «запросные» попапы
  if (!popEl.querySelector('.request-popup')) return;

  // Блокируем клики от хождения по карте
  L.DomEvent.disableClickPropagation(popEl);

  // Навешиваем слушатель «Принять»
  popEl.querySelector('.accept-btn')
    .addEventListener('click', ev => {
      ev.stopPropagation();
      const fromId = e.popup._source.options?.icon?._fromId; // см. ниже
      acceptRequest(fromId);
    });

  // Навешиваем слушатель «Отказать»
  popEl.querySelector('.decline-btn')
    .addEventListener('click', ev => {
      ev.stopPropagation();
      const fromId = e.popup._source.options?.icon?._fromId;
      declineRequest(fromId);
    });
});


// B) Функция, чтобы (re)сохранить профиль в БД

  
  

// C) Новый контрол “Показывать меня”
const ShowMeControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd(map) {
      const container = L.DomUtil.create('div', 'leaflet-control show-me-control');
      const chk = L.DomUtil.create('input', '', container);
      chk.type    = 'checkbox';
      chk.checked = showMe;
      const lbl = L.DomUtil.create('span', '', container);
      lbl.textContent = 'Показывать меня';
      L.DomEvent.disableClickPropagation(container)
                 .disableScrollPropagation(container);
  
      // получаем контейнер карты
      const mapEl = map.getContainer();
  
      chk.addEventListener('change', () => {
        // блокируем чекбокс до завершения записи
        chk.disabled = true;
      
        updateMyProfileVisibility(chk.checked)
          .catch(() => {
            // в случае ошибки восстанавливаем прежнее состояние
            chk.checked = !chk.checked;
          })
          .finally(() => {
            // разблокируем чекбокс
            chk.disabled = false;
          });
      
        // локально сразу убираем маркер, если выключили
        if (!chk.checked && myMarker) {
          map.removeLayer(myMarker);
          myMarker = null;
        }
      });
  
      return container;
    }
  });
  L.control.showMe = opts => new ShowMeControl(opts);
  L.control.showMe({ position: 'topright' }).addTo(map);
  
  const chk = document.querySelector('.leaflet-control.show-me-control input[type="checkbox"]');
if (chk) chk.checked = showMe;
updateMyProfileVisibility(showMe);

 
  // 5) Ваш маркер (зелёный или фото)
  let myMarker = null;
  onValue(userRef, snap => {
    const d = snap.val();
  if (!d || d.visible === false) {
    if (myMarker) { map.removeLayer(myMarker); myMarker = null; }
    return;
  }
  
    // 2) Синхронизируем photoData из БД
    if (d.photoData) {
      photoData = d.photoData;
      localStorage.setItem('photoData', photoData);
    }
  
    // 3) Удаляем старый маркер
    if (myMarker) {
      map.removeLayer(myMarker);
      myMarker = null;
    }
  
    // 4) Рисуем новый: фото-маркер или кружок
    if (d.photoData) {
      const borderColor = d.gender === 'female' ? '#ff69b4' : '#1e90ff';
      const size = markerSize * 2;
      const myIcon = L.divIcon({
        html: `
          <div class="user-photo"
               style="
                 background-image: url('${d.photoData}');
                 border: 2px solid ${borderColor};
               "></div>`,
        className: 'user-photo-marker',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
      myMarker = L.marker([d.latitude, d.longitude], { icon: myIcon })
                   .addTo(map)
                   .openPopup();
    } else {
      myMarker = L.circleMarker([d.latitude, d.longitude], {
        radius:     markerSize,
        color:      '#006400',
        fillColor:  '#00ff00',
        fillOpacity:1,
        weight:     2
      })
      
      if (typeof d.latitude !== 'number' || typeof d.longitude !== 'number') return;

      
    }
    if (shouldCenterOnMyMarker && myMarker) {
    map.setView(myMarker.getLatLng(), map.getZoom(), { animate: true });
    shouldCenterOnMyMarker = false;
  }
  });
  


  
  const allRef = ref(db, 'users');
  onValue(allRef, snap => {
    const users = snap.val() || {};
    allUsersCache = users;
  
    Object.entries(users).forEach(([id, u]) => {
      if (id === deviceId) return;
    
      // ——— ЗАЩИТА ОТ НЕВАЛИДНЫХ КООРДИНАТ ———
      if (typeof u.latitude !== 'number' || typeof u.longitude !== 'number') {
        // просто пропускаем этого пользователя
        if (markers[id]) {
          map.removeLayer(markers[id]);
          delete markers[id];
        }
        return;
      }



      

    
  
      const prev = markers[id];
  
      // если есть фото — ставим L.marker с divIcon
      if (u.photoData) {
        const borderColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
        const html = `
          <div class="user-photo"
               style="
                 background-image: url('${u.photoData}');
                 border: 2px solid ${borderColor};
               ">
          </div>`;
        // если предыдущий маркер — не L.Marker, или его иконка другая — пересоздаём
        if (!(prev instanceof L.Marker)) {
          if (prev) map.removeLayer(prev);
          markers[id] = L.marker([u.latitude, u.longitude], {
            icon: L.divIcon({ html, className: '', iconSize: [markerSize*2, markerSize*2] })
          }).addTo(map);
        } else {
          // просто обновляем HTML иконки
          prev.setIcon(L.divIcon({ html, className: '', iconSize: [markerSize*2, markerSize*2] }));
        }
  
      // иначе — рисуем круг
      } else {
        const isBlocked = !!blockedList[id] || !!reverseBlocked[id];
        const baseColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
        const col = isBlocked ? '#888888' : baseColor;
        const opts = {
          radius:     markerSize,
          color:      col,
          fillColor:  col,
          fillOpacity:isBlocked ? 0.6 : 1,
          weight:     isBlocked ? 1   : 2
        };
  
        // если предыдущий маркер был не кругом — пересоздаём
        if (!(prev instanceof L.CircleMarker)) {
          if (prev) map.removeLayer(prev);
          markers[id] = L.circleMarker([u.latitude, u.longitude], opts).addTo(map);
        } else {
          // обновляем стиль уже существующего кружка
          markers[id].setStyle(opts);
        }
      }
  
      // тултип (всегда висит)
      const labelHtml = `
        <strong>${u.name}, ${u.age} лет</strong>
        ${u.message ? `<br>${u.message}` : ''}
      `;
      markers[id].bindTooltip(labelHtml, {
        permanent: true,
        direction: 'top',
        className: 'user-tooltip'
      });
  
      // клики для открытия попапа
      markers[id].off('click').on('click', () => {
        const popupHtml =
          `<strong>${u.name}, ${u.age} лет</strong>` +
          (u.message ? `<br>${u.message}` : '') +
          `<br><button class="request-btn" data-to="${id}">Подать запрос</button>`;
        markers[id].bindPopup(popupHtml, { autoClose: true, closeOnClick: true }).openPopup();
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
  
  sizeInput.addEventListener('input', e => {
    markerSize = +e.target.value;
    sizeLabel.textContent = markerSize;
    localStorage.setItem('markerSize', markerSize);
    updateAllMarkersSize();
  });

  // после инициализации db и deviceId

  const requestsRef = ref(db, `requests/${deviceId}`);
  onChildAdded(requestsRef, snap => { /* …фильтруете через shown/declined/requestFlag и вызываете showIncomingRequest*/ });
onChildChanged(requestsRef, snap => {
  if (snap.val()?.status !== 'pending') {
    closeAndRebind(snap.key);
    clearBeacon();
  }
});
onChildRemoved(requestsRef, snap => {
  closeAndRebind(snap.key);
  clearBeacon();
});


  let requestFlag = 1;   
  const declined = {};
  // 1) Новый запрос
  onChildAdded(requestsRef, snap => {
    const req = snap.val();
     if (requestFlag===1 
      && req.status==='pending' 
      && !shown[snap.key] 
      && !declined[snap.key]) {
      shown[snap.key] = true;
      showIncomingRequest(snap.key);
  
      // включаем Beacon Flash
      btnMap.classList.add('beacon-flash');
    }
  }
  
  );
  
  // Функция для закрытия «pending»-попапа и восстановления дефолтного
  
  
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
  
  
});





// новый — просто удаляем запрос

  



  
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
  

  // 10) Цветовые акценты
  const squares = document.querySelectorAll('.color-square');
  let accent = localStorage.getItem('accent') || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  applyAccent(accent);
  squares.forEach(sq => sq.onclick = () => applyAccent(sq.dataset.color));
  

  // 11) Навигация по экранам
  const screensEl   = document.getElementById('screens');
  const btnFeat     = document.getElementById('btnFeatures');
  
  const btnProf     = document.getElementById('btnProfile');
  
  
  
  btnFeat.onclick = () => showScreen(0);
 
  btnProf.onclick = () => showScreen(2);
  // Единый обработчик для «Карта»
  
  
  btnMap.addEventListener('click', () => {
    updateMyProfileVisibility(true);
    showScreen(1);
    setTimeout(() => map.invalidateSize(), 300);
    if (myMarker) {
      map.setView(myMarker.getLatLng(), map.getZoom(), { animate: true });
    } else {
      shouldCenterOnMyMarker = true;
    }
  });

  showScreen(0);

  

  


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

function showScreen(idx) {
  screensEl.style.transform = `translateX(-${idx*100}vw)`;
  btnFeat.classList.toggle('active', idx===0);
  btnMap .classList.toggle('active', idx===1);
  btnProf.classList.toggle('active', idx===2);
  
 
}

function applyTheme(t) {
  localStorage.setItem('theme', t);
  document.body.classList.toggle('dark-theme', t==='dark');
  lightBtn.classList.toggle('active', t==='light');
  darkBtn .classList.toggle('active', t==='dark');
}

function applyAccent(c) {
  document.documentElement.style.setProperty('--primary', c);
  localStorage.setItem('accent', c);
  squares.forEach(sq => sq.classList.toggle('selected', sq.dataset.color===c));
}

function clearBeacon() {
  btnMap.classList.remove('beacon-flash');
}

onChildChanged(requestsRef, snap => {
  if (snap.val()?.status !== 'pending') clearBeacon();
});
onChildRemoved(requestsRef, snap => {
  clearBeacon();
});

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

function clearAttention() {
  btnMap.classList.remove('attention');
}
onChildChanged(requestsRef, snap => {
  if (snap.val()?.status !== 'pending') clearAttention();
});
onChildRemoved(requestsRef, snap => {
  clearAttention();
});

function save(name, age, gender, msg, lat, lng) {
  set(userRef, { 
      name, age, gender, message: msg, 
      photoData,
      visible: true,         // <— обязательно
      latitude: lat, longitude: lng,
      timestamp: Date.now() 
    })
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



// === 1) Надёжная updateMyProfileVisibility ===
function updateMyProfileVisibility(flag) {
  showMe = flag;
  localStorage.setItem('showMe', String(flag));

  // готовим апдейт: всегда обновляем видимость, и при включении — фото
  const updates = { visible: flag };
  if (flag && photoData) updates.photoData = photoData;

  // возвращаем Promise, чтобы можно было дождаться завершения
  return update(ref(db, `users/${deviceId}`), updates)
    .then(() => {
      // при скрытии — удаляем свой маркер сразу
      if (!flag && myMarker) {
        map.removeLayer(myMarker);
        myMarker = null;
      }
    })
    .catch(err => {
      console.error('Ошибка updateMyProfileVisibility:', err);
      throw err;
    });
}

function closeAndRebind(fromId) {
  const m = markers[fromId];
  if (!m) return;
  m.closePopup();
  m.unbindPopup();
  bindDefaultPopup(fromId);
  delete shown[fromId];      // теперь shown определён в области видимости
}


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

function clearMapButtonAnimation() {
  btnMap.classList.remove('pulse');
}

onChildChanged(requestsRef, snap => {
  const { status } = snap.val() || {};
  if (status !== 'pending') {
    clearMapButtonAnimation();
    closeAndRebind(snap.key);
  }
});

onChildRemoved(requestsRef, snap => {
  clearMapButtonAnimation();
  closeAndRebind(snap.key);
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






function declineRequest(fromId) {
  // сначала сразу убираем попап в UI
  closeAndRebind(fromId);
  clearBeacon();

  // потом удаляем запрос из БД
  set(ref(db, `requests/${deviceId}/${fromId}`), null)
    .catch(console.error);
}


document.addEventListener('click', e => {
  // если кликнули «Принять»
  if (e.target.matches('.accept-btn')) {
    e.stopPropagation();
    acceptRequest(e.target.dataset.from);
    return;
  }
  // если кликнули «Отказать»
  if (e.target.matches('.decline-btn')) {
    e.stopPropagation();
    declineRequest(e.target.dataset.from);
    return;
  }
});




function showIncomingRequest(fromId) {
  const m = markers[fromId];
  if (!m) return;

  const user = allUsersCache[fromId] || {};
  const borderColor = user.gender === 'female' ? '#ff69b4' : '#1e90ff';

  const popupContent = `
    <div class="request-popup" style="
      border: 2px solid ${borderColor};
      border-radius: 8px;
      padding: 10px;
      text-align: center;
      max-width: 200px;
    ">
      <p style="margin:0; font-weight:bold; color:${borderColor};">
        ${user.name}, ${user.age} лет
      </p>
      <p style="margin:8px 0 12px;">хочет с вами поговорить</p>
      <button class="accept-btn"  data-from="${fromId}">Принять</button>
      <button class="decline-btn" data-from="${fromId}">Отказать</button>
    </div>
  `;

  // Привязываем и открываем попап
  m.unbindPopup()
   .bindPopup(popupContent, {
    
     closeOnClick: false,
     autoClose:    false,
     closeButton:  false
   })
   .openPopup();

  // ← сразу после openPopup() получаем DOM-попапа
  const popEl = m.getPopup().getElement();

  // разрешаем кликам «пробиваться» через Leaflet
  L.DomEvent.disableClickPropagation(popEl);

  // навешиваем локальные обработчики на кнопки
  popEl.querySelector('.accept-btn').addEventListener('click', e => {
    e.stopPropagation();
    acceptRequest(fromId);
  });
  popEl.querySelector('.decline-btn').addEventListener('click', e => {
    e.stopPropagation();
    declineRequest(fromId);
  });
  
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
      // Находим кнопку «Карта» и вешаем на неё свой обработчик
      
      const overlay = document.getElementById('chatOverlay');

       
       overlay.style.display = 'flex';
       const showMeEl = document.querySelector('.leaflet-control.show-me-control');
if (showMeEl) showMeEl.style.display = 'none';
       document.querySelectorAll('.leaflet-control-zoom, .custom-zoom').forEach(el => el.style.display = 'none');
         
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
         <div id="messages" class="chat-messages"></div>
         <div class="chat-input">
           <button id="emojiBtn" class="emoji-btn">😀</button>
           <input id="msgInput" placeholder="Введите сообщение…" />
           <button id="sendMsg">Отправить</button>
           <div id="emojiPicker" class="emoji-picker"></div>
         </div>
       `
       ;
       // элементы
const emojiBtn    = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const msgInput    = document.getElementById('msgInput');
const chatInputEl = overlay.querySelector('.chat-input');
// 1) Список эмоджи (можете расширить)
const emojis = ['😀','😂','😊','😉','😍','🤔','😢','👍','🙏','🎉'];
emojiPicker.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');

// 2) Тоггл панели по клику
emojiBtn.addEventListener('click', e => {
  e.stopPropagation();
  emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
});

// 3) Вставка эмоджи в поле по клику
emojiPicker.addEventListener('click', e => {
  const span = e.target.closest('span');
  if (!span) return;
  msgInput.value += span.textContent;
  msgInput.focus();
});

// 4) Скрытие панели при клике вне
document.addEventListener('click', e => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
    emojiPicker.style.display = 'none';
  }
});


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
      document.querySelectorAll('.leaflet-control-zoom, .custom-zoom').forEach(el => el.style.display = '');
    });
    overlay.style.display = 'none';
  // возвращаем контрол
  if (showMeEl) showMeEl.style.display = '';
  // и теперь уже зум-кнопки…
  document.querySelectorAll('.leaflet-control-zoom, .custom-zoom')
          .forEach(el => el.style.display = '');
};

document.getElementById('blockChat').onclick = () => {
  set(ref(db, `blocked/${deviceId}/${peerId}`), {
      timestamp: Date.now()
    })
      .then(() => {
        overlay.style.display = 'none';
        document.querySelectorAll('.leaflet-control-zoom, .custom-zoom').forEach(el => el.style.display = '');
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
    const msgInput = document.getElementById('msgInput');
msgInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();                   // чтобы строка не разбивалась
    document.getElementById('sendMsg').click();
  }
});
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
      // отправка по нажатию Enter в поле
      msgInput = document.getElementById('msgInput');
      msgInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();           // чтобы не срабатывал перенос строки
          document.getElementById('sendMsg').click();
        }
      });
  
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

function unblockUser(id) {
  set(ref(db, `blocked/${deviceId}/${id}`), null)
    .then(() => {
      alert('Пользователь разблокирован');
      renderBlockedList();
    });
}

function styleMarker(id) {
  const u = allUsersCache[id];
  const m = markers[id];
  if (!u || !m) return;

  const byMe    = !!blockedList[id];
  const byThem  = !!reverseBlocked[id];
  const blocked = byMe || byThem;
  const base    = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
  const col     = blocked ? '#888888' : base;

  // 1) Если это круглый векторный маркер — обновляем его стиль
  if (m instanceof L.CircleMarker) {
    m.setStyle({
      radius:      markerSize,
      color:       col,
      fillColor:   col,
      fillOpacity: blocked ? 0.6 : 1,
      weight:      blocked ? 1   : 2
    });

  // 2) Если это L.Marker (divIcon с фото или цветным кругом) — обновляем icon
  } else if (m instanceof L.Marker) {
    // собираем HTML для иконки
    const html = u.photoData
      ? `<div class="user-photo" style="
           background-image: url('${u.photoData}');
           border: 2px solid ${col};
         "></div>`
      : `<div style="
           width: ${markerSize*2}px;
           height: ${markerSize*2}px;
           background: ${col};
           border-radius: 50%;
         "></div>`;

    // применяем новый divIcon
    m.setIcon(L.divIcon({
      html,
      className: '',
      iconSize:   [markerSize*2, markerSize*2],
      iconAnchor: [markerSize, markerSize]
    }));
  }
}



})();


