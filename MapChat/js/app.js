import { includeHTML } from './common.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

async function loadPage(page) {
    const res = await fetch(`pages/${page}.html`);
    document.getElementById('app').innerHTML = await res.text();
  }

window.onload = async () => {
  await includeHTML('#header','../components/header.html');
  await includeHTML('#footer','../components/footer.html');

  document.getElementById('startButton').addEventListener('click', () => {
    // если pages/home.html лежит относительно index.html в папке pages
    window.location.href = 'pages/home.html';
  });
};