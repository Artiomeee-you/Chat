await includeHTML('#header', 'header.html');

const shown = {};


import { includeHTML } from './common.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
    getDatabase,
    ref,
    get,
    set,
    onValue,
    onDisconnect,
    push,
    update,
    onChildAdded,
    onChildChanged,
    onChildRemoved
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
  // переключатели пола
const genderBtns = document.querySelectorAll('.gender-btn');
const hiddenGender = document.getElementById('gender');

genderBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    genderBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hiddenGender.value = btn.dataset.gender;
  });
});

// ✅ Устанавливаем значение из активной кнопки при первой загрузке
const initiallyActiveBtn = document.querySelector('.gender-btn.active');
if (initiallyActiveBtn) {
  hiddenGender.value = initiallyActiveBtn.dataset.gender;
}
// === GEN PATCH END ===
// начальная активация по value hidden-поля


// при клике — переключаем
genderBtns.forEach(btn => {
  
  btn.addEventListener('click', () => {
    // убрать active у всех
    genderBtns.forEach(b => b.classList.remove('active'));
    // поставить этому
    btn.classList.add('active');
    // обновить скрытое поле (или любую переменную)
    hiddenGender.value = btn.dataset.gender;
  });
});

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
    
    await includeHTML('#header', 'header.html');
    await includeHTML('#footer', 'footer.html');
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
      deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2,9);
      localStorage.setItem('deviceId', deviceId);
    }
    
    
    
    
    
    const app = initializeApp(firebaseConfig);
    const db  = getDatabase(app);
    const searchQueueRef = ref(db, 'searchQueue');
    document.getElementById('searchButton').addEventListener('click', async () => {
      const genderFilter = document.getElementById('genderFilter').value;
      const minAge = parseInt(document.getElementById('minAge').value, 10);
      const maxAge = parseInt(document.getElementById('maxAge').value, 10);
      if ((!genderFilter && genderFilter !== '') || isNaN(minAge) || isNaN(maxAge) || minAge > maxAge) {
        return alert('Пожалуйста, заполните фильтры корректно');
      }
    
      // Читаем профиль из БД
      // Получаем одноразово профиль пользователя
const userRef = ref(db, `users/${deviceId}`);
const userSnap = await get(userRef);
if (!userSnap.exists()) {
  return alert('Профиль не найден в базе');
}
const { age: userAge, gender: userGender } = userSnap.val();

      if (userAge == null || !userGender) {
        return alert('Профиль не заполнен: укажите пол и возраст в разделе “Профиль”');
      }
    
      // Кладём запрос в очередь
      set(ref(db, `searchQueue/${deviceId}`), {
        genderFilter, minAge, maxAge,
        userAge, userGender,
        timestamp: Date.now()
      });
    
      document.getElementById('searchStatus').textContent = '⏳ Ожидание...';
      
      
      // Слушаем очередь и ищем пару
      onValue(searchQueueRef, snap => {
        const queue = snap.val() || {};
        for (let otherId in queue) {
          if (otherId === deviceId) continue;
          const o = queue[otherId];
           if (
               o.userAge   >= minAge && o.userAge   <= maxAge &&
               userAge     >= o.minAge  && userAge     <= o.maxAge &&
               // ваш фильтр (если не пустой) должен совпадать с полом другого
               (genderFilter === '' || genderFilter === o.userGender) &&
               // фильтр другого (если не пустой) должен совпадать с вашим полом
               (o.genderFilter === '' || o.genderFilter === userGender)
             ) {
            // Нашлась пара: удаляем оба запроса
            set(ref(db, `searchQueue/${deviceId}`), null);
            set(ref(db, `searchQueue/${otherId}`), null);
            // вместо редиректа
            const chatId = [deviceId, otherId].sort().join('_');
            openChat(chatId, otherId, 0);
            break;

          }
        }
      });
    });
    
    
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
  await includeHTML('#header', 'header.html');
  await includeHTML('#footer', 'footer.html');
// --- Инициализация кнопок поиска по полу ---
const btnRandom = document.getElementById('genderRandom');
const btnMale   = document.getElementById('genderMale');
const btnFem    = document.getElementById('genderFemale');
const hiddenInp = document.getElementById('genderFilter');

// элементы
const minRange = document.getElementById('minAgeRange');
const maxRange = document.getElementById('maxAgeRange');
const minInput = document.getElementById('minAge');
const maxInput = document.getElementById('maxAge');
const track    = document.querySelector('.age-range-slider .slider-track');

// функция для обновления и трека, и полей
function syncAgeRange() {
  let min = parseInt(minRange.value, 10);
  let max = parseInt(maxRange.value, 10);
  // не даём налазить
  if (min > max) [min, max] = [max, min];

  minInput.value = min;
  maxInput.value = max;

  // вычисляем проценты для градиента
  const minPct = (min - minRange.min) / (minRange.max - minRange.min) * 100;
  const maxPct = (max - maxRange.min) / (maxRange.max - maxRange.min) * 100;
  track.style.background = `
    linear-gradient(
      to right,
      #ddd 0%, #ddd ${minPct}%,
      var(--primary) ${minPct}%, var(--primary) ${maxPct}%,
      #ddd ${maxPct}%, #ddd 100%
    )
  `;
}

// события ползунков
minRange.addEventListener('input', syncAgeRange);
maxRange.addEventListener('input', syncAgeRange);

// события текстовых полей
minInput.addEventListener('change', () => {
  let v = parseInt(minInput.value, 10) || minRange.min;
  minRange.value = v;
  syncAgeRange();
});
maxInput.addEventListener('change', () => {
  let v = parseInt(maxInput.value, 10) || maxRange.max;
  maxRange.value = v;
  syncAgeRange();
});

// инициализация
syncAgeRange();


// по умолчанию «Случайный»
hiddenInp.value = '';
btnRandom.classList.add('active');

// сброс и установка active
function clearActive() {
  [btnRandom, btnMale, btnFem].forEach(b => b.classList.remove('active'));
}

btnRandom.addEventListener('click', () => {
  clearActive();
  btnRandom.classList.add('active');
  hiddenInp.value = '';
});
btnMale.addEventListener('click', () => {
  clearActive();
  btnMale.classList.add('active');
  hiddenInp.value = 'male';
});
btnFem.addEventListener('click', () => {
  clearActive();
  btnFem.classList.add('active');
  hiddenInp.value = 'female';
});

// 1) Тоггл панели


const blockedPanel     = document.getElementById('blockedPanel');
const requestsRef = ref(db, `requests/${deviceId}`);

const declined    = {};


let   requestFlag = 1;
const closeBlockedBtn  = document.getElementById('closeBlocked');
const btnMap = document.getElementById('btnMap');





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
  

  


  
  
  let allUsersCache = {};
  let blockedList = {};
  let shouldCenterOnMyMarker = false;
  // список ID тех, кому мы отправили запрос
  let outgoingRequests = [];

  // сразу объявляем и инициализируем маркер-сайзер
  let markerSize = +localStorage.getItem('markerSize') || 8;

/**
 * Возвращает L.divIcon в зависимости от данных пользователя
 * @param {{ photoData?: string, gender?: string }} d – данные пользователя из БД
 */
function getIconFor(d) {
  const size = markerSize * 2;
  // Если есть фото — делаем див-иконку с фоном
  if (d.photoData) {
    const borderColor = d.gender === 'female' ? '#ff69b4' : '#1e90ff';
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-image: url('${d.photoData}');
          background-size: cover;
          border: 2px solid ${borderColor};
          border-radius: 50%;
        "></div>
      `,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  }
  // Иначе — простой цветной кружок
  const color = d.gender === 'female' ? '#ff69b4' : '#1e90ff';
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
      "></div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
}

  // 2) Постоянный deviceId
  

  
  const userRef = ref(db, 'users/' + deviceId);
  

     //  —— блокированные мной

      const blockedRef = ref(db, `blocked/${deviceId}`);
      const markers = {}; // для чужих
      let myMarker = null;




// сразу под import’ами или сразу после инициализации db/deviceId
let initialUsersLoaded = false;

function setupRequestListener() {
  const requestsRef = ref(db, `requests/${deviceId}`);

  onChildAdded(requestsRef, snap => {
    const fromId = snap.key, req = snap.val();
    if (req.status==='pending') {
      shown[fromId] = true;
      showIncomingRequest(fromId);
      btnMap.classList.add('beacon-flash');
    }
  });

  onChildChanged(requestsRef, snap => {
    if (snap.val()?.status !== 'pending') {
      clearBeacon();
      closeAndRebind(snap.key);
    }
  });

  onChildRemoved(requestsRef, snap => {
    clearBeacon();
    closeAndRebind(snap.key);
  });
}




// при получении данных от БД
onValue(ref(db, 'users'), snapshot => {
  const seenIds = [];

  snapshot.forEach(child => {
    const d = child.val(), id = child.key, coords = [d.latitude, d.longitude];
    // 1) Скрытый профиль
    if (d.visible === false) {
      destroyMarker(markers[id]);
      delete markers[id];
      return;
    }
    
    seenIds.push(id);

    // 2) Свой профиль (без подсказок)
    if (d.deviceId === deviceId) {
      destroyMarker(myMarker);
      myMarker = L.marker(coords, { icon: myIcon }).addTo(map);
      return;
    }

    // 3) Чужой профиль: создаём/обновляем
    let m = markers[id];
    if (m) {
      if (m.getTooltip()) m.unbindTooltip();
      if (m.getPopup())   m.unbindPopup();
      m.setLatLng(coords);
    } else {
      m = L.marker(coords, { icon: getIconFor(d) }).addTo(map);
    }

    // 4) Вешаем новый permanent-tooltip
    const label = `<strong>${d.name}, ${d.age} лет</strong>` +
                  (d.message ? `<br>${d.message}` : '');
    

   
    markers[id] = m;
  });

  // 6) Удаляем тех, кто ушёл
  Object.keys(markers).forEach(id => {
    if (!seenIds.includes(id)) {
      destroyMarker(markers[id]);
      delete markers[id];
    }
  });

  if (!initialUsersLoaded) {
       initialUsersLoaded = true;
       setupRequestListener();  // теперь слушатель запросов встанет после первичной отрисовки маркеров
     }



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
const borderColor = '#ffffff';

cctx.beginPath();
cctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
cctx.lineWidth = 4;
cctx.strokeStyle = borderColor;
cctx.stroke();
      
            // 6) Экспортируем в dataURL и сохраняем
            photoData = circ.toDataURL('image/png');
            localStorage.setItem('photoData', photoData);
            document.getElementById('profilePhoto').src = photoData;

      
            // (если вы где-то сразу рендерите превью, обновите его, например,
            // document.getElementById('photoPreview').src = photoData;)
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
      
  }
  const uploadPhotoButton = document.getElementById('uploadPhotoButton');
  
  
  uploadPhotoButton.onclick = (event) => {
    photoInput.click();
  };
  
  photoInput.onchange = (event) => {
    const file = event.target.files[0];
    if(file){
      console.log('Выбран файл:', file.name);
      uploadPhotoButton.textContent = `Выбрано`;
    }
  };
  // 4) Инициализация карты
  const map = L.map('map', { zoomControl: false })
               .setView([55.751244, 37.618423], 10);
               function destroyMarker(m) {
                if (!m) return;
                if (m.getTooltip()) m.closeTooltip(), m.unbindTooltip();
                if (m.getPopup())   m.closePopup(),   m.unbindPopup();
                map.removeLayer(m);
              }
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
    
    // чекбокс
    const chk = L.DomUtil.create('input', '', container);
    chk.type = 'checkbox';
    chk.checked = showMe;

    const lbl = L.DomUtil.create('span', '', container);
    lbl.textContent = 'Показывать меня';

    // ползунок размера маркера
    const sizeContainer = L.DomUtil.create('div', '', container);
    const sizeLabel = L.DomUtil.create('span', '', sizeContainer);
    sizeLabel.textContent = 'Размер маркера: ';

    const sizeInput = L.DomUtil.create('input', '', sizeContainer);
    sizeInput.type = 'range';
    sizeInput.min = '5';
    sizeInput.max = '30';
    sizeInput.value = markerSize; // переменная из твоего кода

    const sizeValue = L.DomUtil.create('span', '', sizeContainer);
    sizeValue.textContent = markerSize + 'px';

    // обновляем значение
    sizeInput.addEventListener('input', () => {
      markerSize = parseInt(sizeInput.value);
      sizeValue.textContent = markerSize + 'px';
      updateAllMarkersSize();; // твоя функция обновления размера маркера
    });

    L.DomEvent.disableClickPropagation(container)
               .disableScrollPropagation(container);

    chk.addEventListener('change', () => {
      chk.disabled = true;
      updateMyProfileVisibility(chk.checked)
        .catch(() => { chk.checked = !chk.checked; })
        .finally(() => { chk.disabled = false; });

        if (!chk.checked && myMarker) {
          map.removeLayer(myMarker);
          map.closePopup();    // ← добавляем закрытие
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
const profilePhotoEl = document.getElementById('profilePhoto');
if (profilePhotoEl) {
  //profilePhotoEl.src = 'https://via.placeholder.com/240/00ff00/ffffff?text=+';
}
 
  // 5) Ваш маркер (зелёный или фото)
  

  let firstLoad = true;

  onValue(userRef, snap => {
    const d = snap.val();
    
    console.log('📦 Получены данные из БД:', d);
    console.log('👉 Гендер из БД:', d.gender);

    




    if (!d || d.visible === false) {
      if (myMarker) { map.removeLayer(myMarker); myMarker = null; }
      return;
    }
  
    if (d.photoData) {
      photoData = d.photoData;
      localStorage.setItem('photoData', photoData);
    }
  
    const profilePhotoEl = document.getElementById('profilePhoto');
    if (profilePhotoEl && photoData) {
      profilePhotoEl.src = photoData;
    }
  
    const hiddenGender = document.getElementById('gender');
    const genderBtns = document.querySelectorAll('.gender-btn');
    const profileCard = document.getElementById('profileCard');
  
    // 1️⃣ При первой загрузке заполняем профиль
    if (firstLoad) {
      if (d.gender) {
          // Обновляем кнопки и hidden-поле
          genderBtns.forEach(b => b.classList.remove('active'));
          const activeBtn = [...genderBtns].find(btn => btn.dataset.gender === d.gender);
          if (activeBtn) {
              activeBtn.classList.add('active');
              hiddenGender.value = activeBtn.dataset.gender;
              console.log('✅ Из БД выставлен gender:', hiddenGender.value);
          }
      } else {
          // Не меняем hiddenGender.value
          console.log('❗ В БД нет gender — оставляем текущее hidden поле:', hiddenGender.value);
      }
  
      const usernameInput = document.getElementById('username');
      if (usernameInput && d.name !== undefined) {
          usernameInput.value = d.name;
      }
  
      const ageInput = document.getElementById('age');
      if (ageInput && d.age !== undefined) {
          ageInput.value = d.age;
      }
  
      console.log('✅ Профиль инициализирован из БД (частично или полностью)');
      firstLoad = false;
  }
  
  
    if (myMarker) {
      map.removeLayer(myMarker);
      myMarker = null;
    }
  
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
        iconAnchor: [size / 2, size / 2]
      });
      

      myMarker = L.marker([d.latitude, d.longitude], { icon: myIcon })
       .addTo(map);
    
    } else {
      if (typeof d.latitude !== 'number' || typeof d.longitude !== 'number') return;
      myMarker = L.circleMarker([d.latitude, d.longitude], {
        radius: markerSize,
        color: '#006400',
        fillColor: '#00ff00',
        fillOpacity: 1,
        weight: 2
      }).addTo(map);
    }
  
    if (shouldCenterOnMyMarker && myMarker) {
      map.setView(myMarker.getLatLng(), map.getZoom(), { animate: true });
      shouldCenterOnMyMarker = false;
    }
    console.log('✅ Получено d.gender из БД:', d.gender);
console.log('✅ Текущее скрытое поле #gender:', hiddenGender.value);
  });
  
  const genderBtns = document.querySelectorAll('.gender-btn');
  const hiddenGender = document.getElementById('gender');
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hiddenGender.value = btn.dataset.gender;
    });
  });
  
  // ✅ Устанавливаем значение из активной кнопки при первой загрузке
  const initiallyActiveBtn = document.querySelector('.gender-btn.active');
  if (initiallyActiveBtn) {
    hiddenGender.value = initiallyActiveBtn.dataset.gender;
  }
  // === GEN PATCH END ===
  
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hiddenGender.value = btn.dataset.gender;
    });
  });
  
  const allRef = ref(db, 'users');
  
  
  
  
  
  
  
  onValue(allRef, snap => {
    const users = snap.val() || {};

    allUsersCache = users;
  
    Object.entries(users).forEach(([id, u]) => {

          if (id === deviceId) return;


// 1) если пользователь временно скрыт — полностью убираем маркер + тултип
    if (u.visible === false) {
        const m = markers[id];
        if (m) {



          
          // Закрываем и удаляем тултип, если он был привязан
           // Закрываем все «окна» Leaflet перед удалением
if (m.getTooltip()) m.closeTooltip();
 if (m.getPopup())   m.closePopup();
 m.unbindTooltip();
 m.unbindPopup();
 map.removeLayer(m);
 delete markers[id];
        }
        return;
      }


    // Скрываем пользователей, у которых visible=false
        // Скрываем пользователей, у которых visible=false
        if (u.visible === false) {
          const m = markers[id];
          if (m) {
            // отвязываем тултип и попап
             // 1) Закрываем уже открытый тултип и попап
      if (m.getTooltip()) m.closeTooltip();
      if (m.getPopup())  m.closePopup();
      // 2) Отвязываем их, чтобы не привязались заново
      m.unbindTooltip();
      m.unbindPopup();
      // 3) Удаляем сам маркер
      map.removeLayer(m);
      delete markers[id];
          }
          return;
        }
    

      // ——— ЗАЩИТА ОТ НЕВАЛИДНЫХ КООРДИНАТ ———
      if (typeof u.latitude !== 'number' || typeof u.longitude !== 'number') {
        // просто пропускаем этого пользователя
        if (markers[id]) {
          if (markers[id].getPopup()) {
            markers[id].closePopup();    // закроет привязанный popup
            markers[id].unbindPopup();   // отвяжет шаблон, чтобы он не «висял» в кэше
          }
          
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
            if (prev) {
                if (prev.getTooltip()) { prev.closeTooltip(); prev.unbindTooltip(); }
                if (prev.getPopup())   { prev.closePopup();   prev.unbindPopup();   }
                map.removeLayer(prev);
              }
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
          if (prev) {
                if (prev.getTooltip()) { prev.closeTooltip(); prev.unbindTooltip(); }
                if (prev.getPopup())   { prev.closePopup();   prev.unbindPopup();   }
                map.removeLayer(prev);
              }
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
     // после labelHtml
markers[id].bindTooltip(labelHtml, {
  permanent: true,
  direction: 'top',
  offset: [0, -markerSize],   
  className: 'user-tooltip'
});

  
      // клики для открытия попапа
      markers[id].off('click').on('click', () => {
        const popupHtml =
          `<strong>${u.name}, ${u.age} лет</strong>` +
          (u.message ? `<br>${u.message}` : '') +
          `<br><button class="request-btn" data-to="${id}">Подать запрос</button>`;
        markers[id].bindPopup(popupHtml, { autoClose: true, closeOnClick: true })
      });
    });
  
  

  


  // 7) Сохранение/обновление профиля
  const saveBtn = document.getElementById('saveProfile');
  saveBtn.textContent = localStorage.getItem('profileSent') ? 'Обновить' : 'Сохранить';

  
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
        localStorage.setItem('lastGender', gender); 
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

  
 // Вместо onChildAdded — один раз и при любых изменениях
onValue(requestsRef, snap => {
  const pendingIds = [];
  snap.forEach(child => {
    const req = child.val();
    if (req.status === 'pending') {
      pendingIds.push(child.key);
    }
  });
  showAllIncomingRequests(pendingIds);
});


  // после инициализации db и deviceId

  const requestsRef = ref(db, `requests/${deviceId}`);
 
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

  



  
  if (localStorage.getItem('profileSent')&& localStorage.getItem('lastGender')) {
    startWatch(
      localStorage.getItem('lastName'),
      localStorage.getItem('lastAge'),
      localStorage.getItem('lastGender'),
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
 
  btnProf.onclick = () => showScreen(1);
  // Единый обработчик для «Карта»
  
  
  btnMap.addEventListener('click', () => {
    updateMyProfileVisibility(true);
    showScreen(2);
    setTimeout(() => map.invalidateSize(), 300);
    if (myMarker) {
      map.setView(myMarker.getLatLng(), map.getZoom(), { animate: true });
    } else {
      shouldCenterOnMyMarker = true;
    }
  });

  showScreen(1);

  

  


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
  btnMap .classList.toggle('active', idx===2);
  btnProf.classList.toggle('active', idx===1);
  
 
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
      // РЕДАКТИРУЕМ ЧАТ
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
  const dataToSave = {
    name,
    age,
    gender,  // ← всегда добавляем, как name
    message: msg,
    photoData,
    visible: true,
    latitude: lat,
    longitude: lng,
    timestamp: Date.now()
  };

  console.log('📦 Отправляем в БД:', dataToSave);

  set(userRef, dataToSave)
    .then(() => onSaveSuccess(name, age, gender, msg))
    .catch(err => {
      console.error('❌ Ошибка сохранения профиля:', err);
      alert('Не удалось сохранить профиль:\n' + (err.message || JSON.stringify(err)));
    });
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
    if (!flag && myMarker) {
      map.removeLayer(myMarker);
      map.closePopup();
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
const toggleThemePanelBtn = document.getElementById('toggleThemePanel');
const themePanel = document.getElementById('themePanel');

toggleThemePanelBtn.addEventListener('click', () => {
  themePanel.classList.toggle('open');
});


function acceptRequest(fromId) {
  clearBeacon()
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
  // 1) Сохранить новый размер
  localStorage.setItem('markerSize', markerSize);

  // 2) Обновить значение у ползунка
  const sizeValueEl = document.querySelector(
    '.leaflet-control.show-me-control input[type="range"] + span'
  );
  if (sizeValueEl) {
    sizeValueEl.textContent = markerSize + 'px';
  }

  // 3) Обновить ваш маркер
  if (myMarker) {
    if (photoData) {
      // пересоздаем divIcon с фотографией
      const borderColor = '#006400';
      const html = `
        <div style="
          width: ${markerSize*2}px;
          height: ${markerSize*2}px;
          border: 2px solid ${borderColor};
          border-radius: 50%;
          background-color: rgba(0,255,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${photoData}" style="
            width: ${markerSize*2 - 10}px;
            height: ${markerSize*2 - 10}px;
            border-radius: 50%;
            object-fit: cover;
          "/>
        </div>`;
      const myIcon = L.divIcon({
        html,
        className: '',
        iconSize:   [markerSize*2, markerSize*2],
        iconAnchor: [markerSize,    markerSize]
      });
      myMarker.setIcon(myIcon);

    } else if (typeof myMarker.setRadius === 'function') {
      // обычный векторный кружок
      myMarker.setRadius(markerSize);
    }
  }

  // 4) Обновить всех остальных через styleMarker
  Object.keys(markers).forEach(id => styleMarker(id));
}



document.getElementById('deletePhotoButton').addEventListener('click', () => {
  document.getElementById('profilePhoto').src = 'https://via.placeholder.com/240';
  localStorage.removeItem('photoData');

  // Если используешь Firebase, обнови данные там тоже:
  const userRef = ref(database, `users/${deviceId}`);
  update(userRef, { photoData: null });
});



function openChat(chatId, peerId, screenIndex = 2) {
  updateMyProfileVisibility(false);
      // переключаемся на экран “Карта” и показываем оверлей
      showScreen(screenIndex);
  // подсвечиваем кнопку навигации
 
      // Находим кнопку «Карта» и вешаем на неё свой обработчик
      
      const overlay = document.getElementById('chatOverlay');
      overlay.style.display = 'flex';

       const showMeEl = document.querySelector('.leaflet-control.show-me-control');
  if (showMeEl) showMeEl.style.display = 'none';
  document
  .querySelectorAll('.leaflet-control-zoom, .custom-zoom')
  .forEach(el => el.style.display = 'none');





         // 1) Публикуем, что мы в чате
         const myPresRef = ref(db, `chats/${chatId}/presence/${deviceId}`);
         
         set(myPresRef, true);
         onDisconnect(myPresRef).remove();
         overlay.innerHTML = `
  <div class="chat-window">
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
  </div>
`;

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
      updateMyProfileVisibility(true)
      .finally(() => window.location.reload());
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

function onSaveSuccess(name, age, gender, msg) {
  localStorage.setItem('profileSent', 'true');
  localStorage.setItem('lastName',  name);
  localStorage.setItem('lastAge',   age);
  localStorage.setItem('lastMsg',   msg);
  localStorage.setItem('lastGender', gender);
 
  startWatch(name, age, gender, msg);
}

function onSaveError(err) {
  console.error('Ошибка сохранения профиля:', err);
  alert('Не удалось сохранить профиль.');
}
// 8) Постоянное слежение
function startWatch(name, age, gender, msg) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const updates = {
          name,
          age,
          gender,  // ← всегда добавляем
          message: msg,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now()
        };
        update(userRef, updates)
          .catch(console.error);
      },
      error => {
        console.error('Гео-ошибка:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    console.warn('Геолокация не поддерживается в этом браузере');
  }
}

const genderSelect = document.getElementById('gender');


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

  // считаем, заблокировали ли мы или нас
  const byMe   = !!blockedList[id];
  const byThem = !!reverseBlocked[id];
  const blocked = byMe || byThem;

  // цвет по гендеру или серый, если blocked
  const baseColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
  const col       = blocked ? '#888888' : baseColor;
  const opacity   = blocked ? 0.6      : 1;
  const weight    = blocked ? 1        : 2;

  // 1) Если это векторный кружок
  if (m instanceof L.CircleMarker) {
    m.setStyle({
      radius:      markerSize,
      color:       col,
      fillColor:   col,
      fillOpacity: opacity,
      weight:      weight
    });
    

  // 2) Если это L.Marker с divIcon (фото или fallback-круг)
  } else if (m instanceof L.Marker) {
    // собираем html с нужным цветом рамки и прозрачностью
    let html;
    if (u.photoData) {
      html = `
        <div class="user-photo"
             style="
               background-image: url('${u.photoData}');
               border: 2px solid ${col};
               opacity: ${opacity};
             ">
        </div>`;
    // *** force rebind tooltip with new offset ***
const tt = m.getTooltip();
if (tt) {
  const content = tt.getContent();
  m.unbindTooltip();
  m.bindTooltip(content, {
    permanent: true,
    direction: 'top',
    offset: [0, -markerSize],    // ← теперь каждый раз берём актуальный markerSize
    className: 'user-tooltip'
  });
}
} else {
      html = `
        <div style="
             width: ${markerSize*2}px;
             height: ${markerSize*2}px;
             background: ${col};
             border-radius: 50%;
             opacity: ${opacity};
           ">
        </div>`;
    }

    m.setIcon(L.divIcon({
      html,
      className: '',
      iconSize:   [markerSize*2, markerSize*2],
      iconAnchor: [markerSize,    markerSize]
    }));
  }
}





})();


