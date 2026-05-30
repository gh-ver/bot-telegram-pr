// Словарь соответствия качества скинов их коротким меткам
const qualityMap = {
  'field-tested': 'ft',
  'minimal wear': 'mw',
  'well-worn': 'ww',
  'battle-scarred': 'bs',
  'factory new': 'fn'
};

// Массив для хранения отфильтрованных скинов, подходящих под баланс
const datas = [];

// Парсинг параметров из URL-строки браузера
const urlParams = new URLSearchParams(window.location.search);

/**
 * Функция открытия модального окна подтверждения покупки скина
 * @param {number} skinId - Идентификатор скина в массиве datas
 */
function get(skinId) {
  // Находим и показываем модальное окно подтверждения
  const confirmModal = document.getElementById('confurm');
  confirmModal.style.display = 'flex';
  
  // Запускаем анимацию появления
  setTimeout(() => {
    confirmModal.style.animation = 'fadeIn 0.2s forwards';
  }, 64);

  // Находим данные выбранного скина в массиве
  const currentSkin = datas.find(item => item.qu === skinId);
  
  // Заполняем текстовое описание и вешаем обработчик на кнопку «Подтвердить»
  document.getElementById('texts').innerHTML = 'Нажмите кнопку подтвердить чтобы купить скин <br>' + currentSkin.hashs;
  document.getElementById('button').onclick = function() {
    getss(skinId);
  };
  
  // Устанавливаем изображение скина в модальном окне
  const skinImg = document.getElementById('skunss');
  skinImg.src = 'https://cdn2.csgo.com/item/image/width=500/' + encodeURIComponent(currentSkin.hashs) + '.png';
  skinImg.classList.add('skuns');
}

/**
 * Функция отправки данных о покупке в Telegram-бот через WebApp API
 * @param {number} skinId - Идентификатор скина в массиве datas
 */
function getss(skinId) {
  const selectedSkin = datas.find(item => item.qu === skinId);
  
  // Отправка JSON-строки с объектом скина обратно в чат-бот Telegram
  window.Telegram.WebApp.sendData('skuns_' + JSON.stringify(selectedSkin));
}

/**
 * Основная функция загрузки данных с маркета и генерации карточек
 */
function skuns() {
  // Получаем баланс пользователя из URL-параметра 'bal'
  const userBalance = parseFloat(urlParams.get('bal'));

  // Проверка-заглушка (в оригинале 1 > 2 всегда false, поэтому выполняется fetch)
  if (1 > 2) {
    console.error('Некорректный баланс');
  } else {
    // Запрос к API цен через прокси-сервер на Vercel
    fetch('https://yolo-bot.vercel.app/api/proxy?url=' + encodeURIComponent('https://csgo.com'))
      .then(response => response.json())
      .then(parsedData => {
        const itemsList = parsedData.items;
        let skinIdCounter = 0;
        
        // Элемент-контейнер на странице, куда будут добавляться карточки
        const backgroundContainer = document.getElementById('games_indexs-items');
        
        // Перебор всех предметов, пришедших из API
        itemsList.forEach((item, index) => {
          const skinPrice = parseFloat(item.price);
          
          // Фильтрация: цена скина должна быть в диапазоне от 70% до 90% от баланса пользователя
          if (skinPrice > (userBalance / 100 * 70) && (userBalance / 100 * 90) > skinPrice) {
            const marketHashName = item.market_hash_name;
            
            // Сохраняем подходящий скин в глобальный массив
            datas.push({
              'price': skinPrice,
              'hashs': marketHashName,
              'qu': skinIdCounter
            });
            
            // Создаем HTML-блок карточки товара
            let cardDiv = document.createElement('div');
            cardDiv.classList.add('container-skunss', 'skuns_');
            
            // Создаем элемент изображения скина
            let img = document.createElement('img');
            img.src = 'https://cdn2.csgo.com/item/image/width=500/' + encodeURIComponent(marketHashName) + '.png';
            img.classList.add('bal');
            
            // Создаем блок для отображения качества (износа)
            let qualityDiv = document.createElement('div');
            qualityDiv.classList.add('qualuty');
            
            // Если качество распознано, добавляем его текст на карточку
            if (shortenQuality(marketHashName)) {
              qualityDiv.innerText = shortenQuality(marketHashName);
              cardDiv.appendChild(qualityDiv);
            }
            
            // Привязываем вызов модального окна покупки по клику на карточку (замыкание счетчика)
            cardDiv.onclick = (function(id) {
              return function() {
                get(id);
              };
            })(skinIdCounter);
            
            // Собираем карточку и добавляем её на страницу
            cardDiv.append(img);
            backgroundContainer.append(cardDiv);
            
            skinIdCounter++;
          }
        });
      })
      .catch(error => {
        console.error('Ошибка при запросе данных:', error);
      });
  }
}

// Запуск инициализации при полной сборке DOM-дерева
document.addEventListener('DOMContentLoaded', () => {
  skuns(); // Загрузка и рендер скинов

  // Логика управления экраном загрузки и закрытия модальных окон после загрузки страницы
  window.onload = () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex';
    
    // Плавное исчезновение экрана загрузки через 1 секунду
    setTimeout(() => {
      loadingScreen.style.animation = 'fadeIn 1s forwards reverse';
    }, 1000);
    
    // Закрытие модального окна при клике на область 'confurm'
    document.getElementById('fadeIn 0.2s forwards').addEventListener('click', event => {
      if (event.target.id === 'confurm') {
        document.getElementById('fadeIn 0.2s forwards').style.display = 'none';
        setTimeout(() => {
          document.getElementById('fadeIn 0.2s forwards').style.animation = 'fadeOut 0.2s forwards';
        }, 100);
      }
    });
  };
});

/**
 * Функция поиска подстроки качества в названии скина
 * @param {string} skinName - Полное название скина с маркета
 * @returns {string|boolean} Короткая метка качества (fn, ft...) или false
 */
function shortenQuality(skinName) {
  for (let key in qualityMap) {
    let regex = new RegExp(key, 'i');
    if (regex.test(skinName)) {
      return qualityMap[key];
    }
  }
  return false;
}

