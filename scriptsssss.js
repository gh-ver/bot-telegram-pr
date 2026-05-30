// Сопоставление названий износа с короткими метками
const qualityMap = {
  'field-tested': 'ft',
  'minimal wear': 'mw',
  'well-worn': 'ww',
  'battle-scarred': 'bs',
  'factory new': 'fn'
};

const datas = [];
const urlParams = new URLSearchParams(window.location.search);

// Главный адрес вашего прокси на Netlify
const PROXY_URL = 'https://netlify.app';
const CSGO_MARKET_API = 'https://csgo.com';

// Функция определения износа по названию скина
function shortenQuality(skinName) {
  for (let key in qualityMap) {
    let regex = new RegExp(key, 'i');
    if (regex.test(skinName)) {
      return qualityMap[key];
    }
  }
  return false;
}

// Показ модального окна покупки
function get(id) {
  const confirmModal = document.getElementById('confurm');
  confirmModal.style.display = 'flex';
  
  setTimeout(() => {
    confirmModal.style.animation = 'fadeIn 0.2s forwards';
  }, 64);

  const currentSkin = datas.find(item => item.qu === id);
  
  document.getElementById('texts').innerHTML = 'Нажмите кнопку подтвердить чтобы купить скин <br>' + currentSkin.hashs;
  document.getElementById('button').onclick = function() {
    getss(id);
  };
  
  const skinImg = document.getElementById('skunss');
  skinImg.src = 'https://csgo.com' + encodeURIComponent(currentSkin.hashs) + '.png';
  skinImg.classList.add('skuns');
}

// Отправка данных в Telegram-бот при покупке
function getss(id) {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.error('Telegram WebApp не найден');
    return;
  }
  const selectedSkin = datas.find(item => item.qu === id);
  tg.sendData(JSON.stringify(selectedSkin));
}

// Загрузка скинов и фильтрация по балансу
function loadSkins() {
  const userBalance = parseFloat(urlParams.get('bal'));
  if (isNaN(userBalance)) {
    console.error('Некорректный баланс в URL параметрах');
    return;
  }

  // Формируем запрос через ваш новый прокси Netlify
  const requestUrl = `${PROXY_URL}?url=${encodeURIComponent(CSGO_MARKET_API)}`;

  fetch(requestUrl)
    .then(response => {
      if (!response.ok) throw new Error('Сетевая ошибка при запросе к прокси');
      return response.json();
    })
    .then(data => {
      if (!data || !data.items) {
        console.error('Данные от API не содержат список товаров');
        return;
      }

      const container = document.getElementById('games_indexs-items');
      let skinIdCounter = 0;

      data.items.forEach(item => {
        const price = parseFloat(item.price);
        
        // Фильтрация: скин должен стоить от 70% до 90% от внутриботового баланса пользователя
        if (price > (userBalance / 100 * 70) && price < (userBalance / 100 * 90)) {
          const skinName = item.market_hash_name;
          
          datas.push({
            price: price,
            hashs: skinName,
            qu: skinIdCounter
          });

          // Создание карточки товара
          let itemDiv = document.createElement('div');
          itemDiv.classList.add('container-skunss', 'skuns_');

          let img = document.createElement('img');
          img.src = 'https://cdn2.csgo.com/item/image/width=500/' + encodeURIComponent(skinName) + '.png';
          img.classList.add('bal');

          let qualityDiv = document.createElement('div');
          qualityDiv.classList.add('qualuty');

          const shortQual = shortenQuality(skinName);
          if (shortQual) {
            qualityDiv.innerText = shortQual;
            itemDiv.appendChild(qualityDiv);
          }

          // Навешиваем событие клика для вызова окна подтверждения
          itemDiv.onclick = ((id) => () => get(id))(skinIdCounter);
          
          itemDiv.append(img);
          container.append(itemDiv);
          
          skinIdCounter++;
        }
      });
    })
    .catch(error => {
      console.error('Ошибка при запросе данных:', error);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadSkins();

  window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
      setTimeout(() => {
        loadingScreen.style.animation = 'fadeIn 1s forwards reverse';
      }, 1000);
    }

    const confirmContainer = document.getElementById('fadeIn 0.2s forwards');
    if (confirmContainer) {
      confirmContainer.addEventListener('click', (event) => {
        if (event.target.id === 'confurm') {
          confirmContainer.style.display = 'none';
          setTimeout(() => {
            confirmContainer.style.animation = 'fadeOut 0.2s forwards';
          }, 100);
        }
      });
    }
  };
});
