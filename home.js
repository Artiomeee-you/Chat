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
const genderBtns = document.querySelectorAll('.gender-btn');
const hiddenGender = document.getElementById('gender');

genderBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    genderBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hiddenGender.value = btn.dataset.gender;
  });
});

const initiallyActiveBtn = document.querySelector('.gender-btn.active');
if (initiallyActiveBtn) {
  hiddenGender.value = initiallyActiveBtn.dataset.gender;
}


genderBtns.forEach(btn => {
  
  btn.addEventListener('click', () => {
    genderBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hiddenGender.value = btn.dataset.gender;
  });
});

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


const connectedRef = ref(db, '.info/connected');
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    onDisconnect(userRef).update(
      {
      
      
      online:    null,
      visible:   false,

      timestamp: null
    });
    showMe = false;
    
    onDisconnect(ref(db, `activeUsers/${deviceId}`)).remove();
    set(ref(db, `users/${deviceId}/online`), true);
    update(ref(db, `users/${deviceId}`), { visible: true });
    set(ref(db, `activeUsers/${deviceId}`), { online: true });
  }
});



    const searchQueueRef = ref(db, 'searchQueue');
    document.getElementById('searchButton').addEventListener('click', async () => {
      const genderFilter = document.getElementById('genderFilter').value;
      const minAge = parseInt(document.getElementById('minAge').value, 10);
      const maxAge = parseInt(document.getElementById('maxAge').value, 10);
      if ((!genderFilter && genderFilter !== '') || isNaN(minAge) || isNaN(maxAge) || minAge > maxAge) {
        return alert('Пожалуйста, заполните фильтры корректно');
      }
    
const userRef = ref(db, `users/${deviceId}`);
const userSnap = await get(userRef);
if (!userSnap.exists()) {
  return alert('Профиль не найден в базе');
}
const { age: userAge, gender: userGender } = userSnap.val();

      if (userAge == null || !userGender) {
        return alert('Профиль не заполнен: укажите пол и возраст в разделе “Профиль”');
      }
    
      set(ref(db, `searchQueue/${deviceId}`), {
        genderFilter, minAge, maxAge,
        userAge, userGender,
        timestamp: Date.now()
      });
    
      document.getElementById('searchStatus').textContent = '⏳ Ожидание...';
      
      
      onValue(searchQueueRef, snap => {
        const queue = snap.val() || {};
        for (let otherId in queue) {
          if (otherId === deviceId) continue;
          const o = queue[otherId];
           if (
               o.userAge   >= minAge && o.userAge   <= maxAge &&
               userAge     >= o.minAge  && userAge     <= o.maxAge &&
               (genderFilter === '' || genderFilter === o.userGender) &&
               (o.genderFilter === '' || o.genderFilter === userGender)
             ) {
            set(ref(db, `searchQueue/${deviceId}`), null);
            
            const chatId = [deviceId, otherId].sort().join('_');
            openChat(chatId, otherId, 0);
            break;

          }
        }
      });
    });
    
    

  const reverseBlocked = {};
  

  document.addEventListener('click', e => {
    if (e.target.matches('.decline-btn')) {
      declineRequest(e.target.dataset.from);
      return;
    }
  });





  await includeHTML('#header', 'header.html');
  await includeHTML('#footer', 'footer.html');
const btnRandom = document.getElementById('genderRandom');
const btnMale   = document.getElementById('genderMale');
const btnFem    = document.getElementById('genderFemale');
const hiddenInp = document.getElementById('genderFilter');

const minRange = document.getElementById('minAgeRange');
const maxRange = document.getElementById('maxAgeRange');
const minInput = document.getElementById('minAge');
const maxInput = document.getElementById('maxAge');
const track    = document.querySelector('.age-range-slider .slider-track');

function syncAgeRange() {
  let min = parseInt(minRange.value, 10);
  let max = parseInt(maxRange.value, 10);
  if (min > max) [min, max] = [max, min];

  minInput.value = min;
  maxInput.value = max;

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

minRange.addEventListener('input', syncAgeRange);
maxRange.addEventListener('input', syncAgeRange);

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

syncAgeRange();


hiddenInp.value = '';
btnRandom.classList.add('active');

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



const blockedPanel     = document.getElementById('blockedPanel');
const requestsRef = ref(db, `requests/${deviceId}`);

const declined    = {};


let   requestFlag = 1;
const closeBlockedBtn  = document.getElementById('closeBlocked');
const btnMap = document.getElementById('btnMap');





    document.addEventListener('click', e => {
           if (e.target.matches('.accept-btn')) {
             acceptRequest(e.target.dataset.from);
             return;
           }
           if (e.target.matches('.decline-btn')) {
             declineRequest(e.target.dataset.from);
             return;
           }
        
           const btn = e.target.closest('.request-btn');
           if (btn) {
             sendChatRequest(btn.dataset.to);
           }
         });
  
  

  


  
  
  let allUsersCache = {};
  let blockedList = {};
  let shouldCenterOnMyMarker = false;
  let outgoingRequests = [];

  let markerSize = localStorage.getItem('markerSize') || 8;

/**
 * Возвращает L.divIcon в зависимости от данных пользователя
 * @param {{ photoData?: string, gender?: string }} d – данные пользователя из БД
 */
function getIconFor(d) {
  const size = markerSize * 2;
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

  

  
  const userRef = ref(db, 'users/' + deviceId);
  


      const blockedRef = ref(db, `blocked/${deviceId}`);
      const markers = {};
      let myMarker = null;




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




onValue(ref(db, 'users/' + deviceId), snapshot => {
  const data = snapshot.val();
  if (data) {
    console.log('Данные пришли из БД:', data);
    updateMarkerOnMap(data.latitude, data.longitude);
  }
});



      onValue(blockedRef, snap => {
       blockedList = snap.val() || {};
       console.log('=== blockedList updated ===', blockedList);


       console.log('markers keys:', Object.keys(markers));
       Object.keys(markers).forEach(id => styleMarker(id));
     });
      





  const photoInput = document.getElementById('photoInput');
  if (photoInput) {
    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const maxDim = 100;
            const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
            const w = img.width * scale;
            const h = img.height * scale;
      
            const canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
      
            const size = Math.min(w, h);
            const circ = document.createElement('canvas');
            circ.width  = size;
            circ.height = size;
            const cctx = circ.getContext('2d');
            cctx.beginPath();
            cctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
            cctx.closePath();
            cctx.clip();
            cctx.drawImage(canvas, (size - w)/2, (size - h)/2, w, h);
      
            const gender = document.getElementById('gender').value;
const borderColor = '#ffffff';

cctx.beginPath();
cctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
cctx.lineWidth = 4;
cctx.strokeStyle = borderColor;
cctx.stroke();
      
            photoData = circ.toDataURL('image/png');
            localStorage.setItem('photoData', photoData);
            document.getElementById('profilePhoto').src = photoData;

      
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

if (map.zoomControl) {
  map.zoomControl.remove();
}

  map.getContainer().addEventListener('click', e => {
    const btn = e.target.closest('.decline-btn');
    if (!btn) return;
    const fromId = btn.dataset.from;
    if (!fromId) return;
    declineRequest(fromId);
    e.stopPropagation();
  });
  L.control.zoom({
    position: 'topright'
  }).addTo(map);
  let showMe = localStorage.getItem('showMe') !== 'false';
map.on('popupopen', e => {
  const popEl = e.popup.getElement();
  if (!popEl.querySelector('.request-popup')) return;

  L.DomEvent.disableClickPropagation(popEl);

  popEl.querySelector('.accept-btn')
    .addEventListener('click', ev => {
      ev.stopPropagation();
      const fromId = e.popup._source.options?.icon?._fromId;
      acceptRequest(fromId);
    });

  popEl.querySelector('.decline-btn')
    .addEventListener('click', ev => {
      ev.stopPropagation();
      const fromId = e.popup._source.options?.icon?._fromId;
      declineRequest(fromId);
    });
});



  
  

const ShowMeControl = L.Control.extend({
  options: { position: 'topright' },
  onAdd(map) {
    const container = L.DomUtil.create('div', 'leaflet-control show-me-control');
    
    const chk = L.DomUtil.create('input', '', container);
    chk.type = 'checkbox';
    chk.checked = showMe;

    const lbl = L.DomUtil.create('span', '', container);
    lbl.textContent = '';

    const sizeContainer = L.DomUtil.create('div', '', container);
    const sizeLabel = L.DomUtil.create('span', '', sizeContainer);
    sizeLabel.textContent = '';

    const sizeInput = L.DomUtil.create('input', '', sizeContainer);
    sizeInput.type = 'range';
    sizeInput.min = '5';
    sizeInput.max = '30';
    sizeInput.value = markerSize;

    const sizeValue = L.DomUtil.create('span', '');
    sizeValue.textContent = markerSize + 'px';

    sizeInput.addEventListener('input', () => {
      markerSize = parseInt(sizeInput.value);
      sizeValue.textContent = markerSize + 'px';
      updateAllMarkersSize();;
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
          map.closePopup();
          myMarker = null;
        }
        
    });

    return container;
  }
});

L.control.showMe = opts => new ShowMeControl(opts);
L.control.showMe({ position: 'topleft' }).addTo(map);

  const chk = document.querySelector('.leaflet-control.show-me-control input[type="checkbox"]');
if (chk) chk.checked = showMe;
updateMyProfileVisibility(showMe);
const profilePhotoEl = document.getElementById('profilePhoto');
if (profilePhotoEl) {
}
 
  

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
  
    if (firstLoad) {
      if (d.gender) {
          genderBtns.forEach(b => b.classList.remove('active'));
          const activeBtn = [...genderBtns].find(btn => btn.dataset.gender === d.gender);
          if (activeBtn) {
              activeBtn.classList.add('active');
              hiddenGender.value = activeBtn.dataset.gender;
              console.log('✅ Из БД выставлен gender:', hiddenGender.value);
          }
      } else {
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
      
      
      if (validCoords(d.latitude, d.longitude)) {
        myMarker = L.marker([d.latitude, d.longitude], {icon: myIcon}).addTo(map);
      }
      
    
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
  
  const initiallyActiveBtn = document.querySelector('.gender-btn.active');
  if (initiallyActiveBtn) {
    hiddenGender.value = initiallyActiveBtn.dataset.gender;
  }
  
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


    if (u.visible === false) {
        const m = markers[id];
        if (m) {



          
          if (m.getTooltip()) {m.closeTooltip();}
          if (m.getPopup())   m.closePopup();
           m.unbindTooltip();
            m.unbindPopup();
            map.removeLayer(m);
            delete markers[id];
        }
        return;
      }



    

      if (typeof u.latitude !== 'number' || typeof u.longitude !== 'number') {
        if (markers[id]) {
          if (markers[id].getPopup()) {
            markers[id].closePopup();
            markers[id].unbindPopup();
          }
          
        }
        return;
      }
  



      

    
  
      const prev = markers[id];
  
      if (u.photoData) {
        const borderColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
        const html = `
          <div class="user-photo"
               style="
                 background-image: url('${u.photoData}');
                 border: 2px solid ${borderColor};
               ">
          </div>`;
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
          prev.setIcon(L.divIcon({ html, className: '', iconSize: [markerSize*2, markerSize*2] }));
        }
  
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
  
        if (!(prev instanceof L.CircleMarker)) {
          if (prev) {
                if (prev.getTooltip()) { prev.closeTooltip(); prev.unbindTooltip(); }
                if (prev.getPopup())   { prev.closePopup();   prev.unbindPopup();   }
                map.removeLayer(prev);
              }
          markers[id] = L.circleMarker([u.latitude, u.longitude], opts).addTo(map);
        } else {
          markers[id].setStyle(opts);
        }
      }
      
      const labelHtml = `
  <strong>${u.name}, ${u.age}</strong>
  ${u.message ? `<br>${u.message}` : ''}
`;

// ✅ предварительно удаляем старый tooltip, если он есть
if (markers[id].getTooltip()) {
  markers[id].unbindTooltip();
}

markers[id].bindTooltip(labelHtml, {
  permanent: true,
  direction: 'top',
  offset: [0, -markerSize],
  className: 'user-tooltip'
});

//ЭТОТОТОТОТОТОТОТОТОТОТО
  
      markers[id].off('click').on('click', () => {
        const popupHtml =
          `<strong>${u.name}, ${u.age} лет</strong>` +
          (u.message ? `<br>${u.message}` : '') +
          `<br><button class="request-btn" data-to="${id}">Подать запрос</button>`;
        markers[id].bindPopup(popupHtml, { autoClose: true, closeOnClick: true })
        .openPopup();
      });
    });
  
  

  


  const saveBtn = document.getElementById('saveProfile');
  
    if  (saveBtn.textContent == 'Cохранено') saveBtn.textContent = 'Сохранено'
    else { saveBtn.textContent = localStorage.getItem('profileSent') ? 'Обновить' : 'Сохранить';}
 

 saveBtn.addEventListener('click', () => {
  if (saveBtn.disabled) return;
  saveBtn.disabled = true;

  const name   = document.getElementById('username').value.trim();
  const age    = document.getElementById('age').value.trim();
  const gender = document.getElementById('gender').value;
  const msg    = document.getElementById('message').value.trim();
  if (!name || !age) {
    alert('Введите имя и возраст!');
    saveBtn.disabled = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      save(name, age, gender, msg, pos.coords.latitude, pos.coords.longitude)
        .then(() => {
          saveBtn.disabled = false;
        })
        .catch(err => {
          console.error(err);
          saveBtn.disabled = false;
        });
    },
    err => {
      console.error('Ошибка геолокации:', err);
      alert('Не удалось получить местоположение.');
      saveBtn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
  saveBtn.textContent = 'Cохранено';

});

  
  


  function save(name, age, gender, msg, lat, lng) {
    const earthRadius = 6371000;
  const radius = 2000;
  const randomDistance = Math.random() * radius;
  const randomAngle = Math.random() * 2 * Math.PI;
  const offsetLat = (randomDistance * Math.cos(randomAngle)) / earthRadius * (180 / Math.PI);
  const offsetLng = (randomDistance * Math.sin(randomAngle)) / 
                    (earthRadius * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);
  lat = lat + offsetLat;
  lng = lng + offsetLng;
    set(userRef, { 
        name, age, gender, message: msg, 
        photoData,
        visible: true,
        latitude: lat , longitude: lng,
        timestamp: Date.now() 
      })
      .then(() => {
        localStorage.setItem('profileSent','true');
        localStorage.setItem('lastName', name);
        localStorage.setItem('lastAge',  age);
        localStorage.setItem('lastGender', gender); 
        localStorage.setItem('lastMsg',  msg);
        

      })
      .catch(e => console.error(e) || alert('Не удалось сохранить профиль.'));
  }


  




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
  onChildAdded(requestsRef, snap => {
    const req = snap.val();
     if (requestFlag===1 
      && req.status==='pending' 
      && !shown[snap.key] 
      && !declined[snap.key]) {
      shown[snap.key] = true;
      showIncomingRequest(snap.key);
  
      btnMap.classList.add('beacon-flash');
    }
  }
  
  );
  
  
  
  onChildChanged(requestsRef, snap => {
    const { status } = snap.val() || {};
    if (status !== 'pending') closeAndRebind(snap.key);
  });
  
  onChildRemoved(requestsRef, snap => {
    closeAndRebind(snap.key);
  });
  
  
  
});






  



  


  const lightBtn = document.getElementById('lightMode');
  const darkBtn  = document.getElementById('darkMode');
  let theme = localStorage.getItem('theme') || 'light';
  applyTheme(theme);
  lightBtn.onclick = () => applyTheme('light');
  darkBtn .onclick = () => applyTheme('dark');
  

  const squares = document.querySelectorAll('.color-square');
  let accent = localStorage.getItem('accent') || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  applyAccent(accent);
  squares.forEach(sq => sq.onclick = () => applyAccent(sq.dataset.color));
  

  const screensEl   = document.getElementById('screens');
  const btnFeat     = document.getElementById('btnFeatures');
  
  const btnProf     = document.getElementById('btnProfile');
  
  
  
  btnFeat.onclick = () => showScreen(0);
 
  btnProf.onclick = () => showScreen(1);
  
  
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
            outgoingRequests.push(toId);
          })

       .then(() => {
             alert('Запрос отправлен');
             const myReqRef = ref(db, `requests/${toId}/${deviceId}`);
             onValue(myReqRef, snap => {
               if (snap.val()?.status === 'accepted') {
      const chatId = [deviceId, toId].sort().join('_');
      openChat(chatId, toId);
      outgoingRequests.forEach(otherId => {
        if (otherId !== toId) {
          set(ref(db, `requests/${otherId}/${deviceId}`), null);
        }
      });
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











function updateMyProfileVisibility(flag) {
  showMe = flag;
  localStorage.setItem('showMe', String(flag));

  const updates = { visible: flag };
  if (flag && photoData) updates.photoData = photoData;

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
  delete shown[fromId];
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

  updates[`chats/${chatId}/members/${deviceId}`] = true;
  updates[`chats/${chatId}/members/${fromId}`]   = true;
  updates[`requests/${deviceId}/${fromId}`] = {
    status:    'accepted',
    timestamp: Date.now()
  };
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


function validCoords(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng);
}



function declineRequest(fromId) {
  closeAndRebind(fromId);


  set(ref(db, `requests/${deviceId}/${fromId}`), null)
    .catch(console.error);
}


document.addEventListener('click', e => {
  if (e.target.matches('.accept-btn')) {
    e.stopPropagation();
    acceptRequest(e.target.dataset.from);
    return;
  }
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

  m.unbindPopup()
   .bindPopup(popupContent, {
    
     closeOnClick: false,
     autoClose:    false,
     closeButton:  false
   })
   .openPopup();

  const popEl = m.getPopup().getElement();

  L.DomEvent.disableClickPropagation(popEl);

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
  localStorage.setItem('markerSize', markerSize);

  const sizeValueEl = document.querySelector(
    '.leaflet-control.show-me-control input[type="range"] + span'
  );
  if (sizeValueEl) {
    sizeValueEl.textContent = markerSize + 'px';
  }

  if (myMarker) {
    if (photoData) {
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
      myMarker.setRadius(markerSize);
    }
  }

  Object.keys(markers).forEach(id => styleMarker(id));
}



document.getElementById('deletePhotoButton').addEventListener('click', () => {
  document.getElementById('profilePhoto').src = 'https://via.placeholder.com/240';
  localStorage.removeItem('photoData');

  const userRef = ref(database, `users/${deviceId}`);
  update(userRef, { photoData: null });
});



function openChat(chatId, peerId, screenIndex = 2) {
  updateMyProfileVisibility(false);
      showScreen(screenIndex);
 
      
      const overlay = document.getElementById('chatOverlay');
      overlay.style.display = 'flex';

       const showMeEl = document.querySelector('.leaflet-control.show-me-control');
  if (showMeEl) showMeEl.style.display = 'none';
  document
  .querySelectorAll('.leaflet-control-zoom, .custom-zoom')
  .forEach(el => el.style.display = 'none');





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
      
      <input id="msgInput" placeholder="Введите сообщение…" />
      <button id="sendMsg">  ➤  </button>
      <div id="emojiPicker" class="emoji-picker"></div>
    </div>
  </div>
`;


const emojiPicker = document.getElementById('emojiPicker');
const msgInput    = document.getElementById('msgInput');
const chatInputEl = overlay.querySelector('.chat-input');
const emojis = ['😀','😂','😊','😉','😍','🤔','😢','👍','🙏','🎉'];
emojiPicker.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');



emojiPicker.addEventListener('click', e => {
  const span = e.target.closest('span');
  if (!span) return;
  msgInput.value += span.textContent;
  msgInput.focus();
});




       const peerPresRef = ref(db, `chats/${chatId}/presence/${peerId}`);
onValue(peerPresRef, snap => {
  
  const inChat = snap.val() === true;
  const name = allUsersCache[peerId]?.name || peerId;
  const chatStatusEl = document.getElementById('chatStatus');
chatStatusEl.textContent = `${name} ${inChat ? 'в чате' : 'не в чате'}`;
chatStatusEl.style.color = inChat ? '' : 'red';
  document.getElementById('chatStatus').textContent =
    `${name} ${inChat ? 'в чате' : 'не в чате'}`;
});
  
     const mapSection = document.getElementById('welcome');

     document.getElementById('exitChat').onclick = () => {
      get(ref(db, `activeChats/${deviceId}`)).then(snap => {
        
        if (chatId) {
          const updates = {};
          const presenceRef = ref(db, `chats/${chatId}/presence/${peerId}`);
          
          get(presenceRef).then(snap => {
            const isPeerPresent = snap.exists() && snap.val() === true;
            if (!isPeerPresent) {
              updates[`activeChats/${deviceId}`] = null;
              updates[`activeChats/${peerId}`]   = null;
              updates[`chats/${chatId}`]         = null;
              update(ref(db), updates).then(() => {
                
              });
            } else {
              
            }
          });
        }
        
      })
      .then(() => {
        updateMyProfileVisibility(true).finally(() => window.location.reload());
      });
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



  const msgsRef = ref(db, `chats/${chatId}/messages`);
  onValue(msgsRef, snap => {
      const msgs = snap.val() || {};
      const box  = document.getElementById('messages');
      box.innerHTML = '';
      Object.entries(msgs).forEach(([mid, m]) => {
        const div = document.createElement('div');
        div.className = 'message ' + (m.from === deviceId ? 'me' : 'peer');
        div.textContent = m.text;
        box.appendChild(div);
      });
      box.scrollTop = box.scrollHeight;
    });
 
  
  document.getElementById('sendMsg').onclick = () => {
    const msgInput = document.getElementById('msgInput');
msgInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
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
      msgInput = document.getElementById('msgInput');
      msgInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
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
 
 
}

function onSaveError(err) {
  console.error('Ошибка сохранения профиля:', err);
  alert('Не удалось сохранить профиль.');
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

  const byMe   = !!blockedList[id];
  const byThem = !!reverseBlocked[id];
  const blocked = byMe || byThem;

  const baseColor = u.gender === 'female' ? '#ff69b4' : '#1e90ff';
  const col       = blocked ? '#888888' : baseColor;
  const opacity   = blocked ? 0.6      : 1;
  const weight    = blocked ? 1        : 2;

  if (m instanceof L.CircleMarker) {
    m.setStyle({
      radius:      markerSize,
      color:       col,
      fillColor:   col,
      fillOpacity: opacity,
      weight:      weight
    });
    

  } 
}





})();


