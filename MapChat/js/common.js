export async function includeHTML(selector, url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      document.querySelector(selector).innerHTML = html;
    } catch (e) {
      console.error('Ошибка загрузки компонента', url, e);
    }
  }
  