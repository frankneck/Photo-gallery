const debug = (...args) => console.log('[DEBUG]', ...args);

let tags = new Set();

// Глобальные массивы для скроллинга тегов
let allTagsList = [];      // Массив всех тегов (включая 'all' в начале)
let visibleTagsList = [];  // Текущие видимые теги

// Функция определения числа видимых тегов
// На мобильных устройствах (≤480px) возвращаем все теги (то есть будем использовать native scrolling)
function getVisibleTagCount() {
  // Если экран ≤480px – показываем, например, 3 тега; иначе – 2 (или другое число, как вам нужно)
  return window.matchMedia('(max-width: 480px)').matches ? 3 : 10;
}

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  setupScroll();

  document.getElementById('addBtn').addEventListener('click', openModal);
  document.querySelector('.close').addEventListener('click', closeModal);
  document.getElementById('addForm').addEventListener('submit', handleSubmit);
});

// Инициализация галереи с начальными данными
function initGallery() {
  const initialData = [
    {
      title: "Горы",
      description: "Красивый горный пейзаж",
      tags: ["природа", "горы"],
      image: "https://picsum.photos/300/200?random=1"
    },
    {
      title: "Город",
      description: "Ночной город",
      tags: ["город", "ночь"],
      image: "https://picsum.photos/300/200?random=2"
    }
  ];
  initialData.forEach(item => addCardToGallery(item));
  // При первой загрузке сбрасываем прокрутку
  updateFilters(true);
}

// Добавление карточки в галерею и обновление тегов
function addCardToGallery(data) {
  const gallery = document.getElementById('gallery');
  const card = createCardElement(data);
  gallery.appendChild(card);
  data.tags.forEach(tag => tags.add(tag));
  // После добавления карточки обновляем фильтры без сброса прокрутки
  updateFilters(false);
}

// Создание элемента карточки
function createCardElement(data) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.tags = data.tags.join(',');
  card.innerHTML = `
    <img src="${data.image}" alt="${data.title}">
    <div class="card-body">
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <div class="card-tags">${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
    </div>
  `;
  return card;
}

// Обновление фильтров (списка тегов)
// Параметр resetScroll == true означает, что окно тегов сбрасывается с начала
function updateFilters(resetScroll = true) {
  const container = document.getElementById('tagsContainer');
  container.innerHTML = '';

  // Собираем все теги, включая 'all'
  allTagsList = ['all', ...Array.from(tags)];
  const count = getVisibleTagCount();
  
  if (window.matchMedia('(max-width: 480px)').matches) {
    // На телефонах показываем только count тегов (например, 3) даже при native scrolling,
    // если вам нужно ограничить набор тегов
    visibleTagsList = allTagsList.slice(0, count);
  } else {
    if (resetScroll || visibleTagsList.length === 0) {
      visibleTagsList = allTagsList.slice(0, count);
    } else {
      const currentStartIndex = allTagsList.indexOf(visibleTagsList[0]);
      visibleTagsList = allTagsList.slice(currentStartIndex, currentStartIndex + count);
    }
  }
  
  renderVisibleTags();
}

// Отрисовка кнопок тегов
function renderVisibleTags() {
  const container = document.getElementById('tagsContainer');
  container.innerHTML = '';
  visibleTagsList.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tag === 'all' ? 'Все' : tag;
    btn.dataset.filter = tag;
    btn.addEventListener('click', filterHandler);
    container.appendChild(btn);
  });
  updateScrollButtons();
}

// Обработчик фильтрации карточек по тегу
function filterHandler(e) {
  const filter = e.target.dataset.filter;
  debug('Выбран фильтр:', filter);
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  let visibleCount = 0;
  document.querySelectorAll('.card').forEach(card => {
    const cardTags = card.dataset.tags.split(',');
    const shouldShow = filter === 'all' || cardTags.includes(filter);
    card.classList.toggle('hidden', !shouldShow);
    if (shouldShow) visibleCount++;
  });
  debug(`Показано карточек: ${visibleCount} из ${document.querySelectorAll('.card').length}`);
  forceGridRefresh();
}

// Обновление сетки галереи (принудительное перерисовывание)
function forceGridRefresh() {
  const gallery = document.getElementById('gallery');
  debug('Перерисовка галереи');
  gallery.style.display = 'none';
  gallery.offsetHeight; // перезагрузка layout
  gallery.style.display = 'grid';
}

function openModal() {
  document.getElementById('modal').classList.add('show');
  debug('Открыто модальное окно');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  debug('Закрыто модальное окно');
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('addForm');
  const imageFile = document.getElementById('image').files[0];
  const title = document.getElementById('title').value;
  const desc = document.getElementById('desc').value;
  const tagsInput = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(Boolean);
  if (!imageFile || !title || !desc || tagsInput.length === 0) {
    alert('Заполните все поля!');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    addCardToGallery({
      title: title,
      description: desc,
      tags: tagsInput,
      image: event.target.result
    });
    closeModal();
    form.reset();
    debug('Добавлена новая карточка:', title);
  };
  reader.onerror = (error) => {
    alert('Ошибка при загрузке изображения!');
    debug('Ошибка чтения файла:', error);
  };
  reader.readAsDataURL(imageFile);
}

// ===== Логика дискретного скроллинга тегов =====

const tagsContainer = document.getElementById('tagsContainer');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

function setupScroll() {
  // Если мобильное устройство – скрываем кнопки, т.к. используется native scroll
  if (window.matchMedia('(max-width: 480px)').matches) {
    leftBtn.classList.add('hidden');
    rightBtn.classList.add('hidden');
    // И оставляем возможность прокрутки свайпом – CSS должен включать overflow-x: auto
  } else {
    // Для десктопа – добавляем обработчики для дискретного скроллинга
    leftBtn.addEventListener('click', () => scrollTags('left'));
    rightBtn.addEventListener('click', () => scrollTags('right'));
  }
}

// Функция сдвига окна тегов (применяется только на десктопе)
function scrollTags(direction) {
  const currentStartIndex = allTagsList.indexOf(visibleTagsList[0]);
  const count = getVisibleTagCount();
  if (direction === 'right') {
    if (currentStartIndex + count < allTagsList.length) {
      visibleTagsList = allTagsList.slice(currentStartIndex + 1, currentStartIndex + 1 + count);
      renderVisibleTags();
    }
  } else if (direction === 'left') {
    if (currentStartIndex > 0) {
      visibleTagsList = allTagsList.slice(currentStartIndex - 1, currentStartIndex - 1 + count);
      renderVisibleTags();
    }
  }
}

// Обновление состояния стрелок (для десктопа)
function updateScrollButtons() {
  // Если мобильное устройство, кнопки скрыты – ничего не делаем
  if (window.matchMedia('(max-width: 480px)').matches) {
    return;
  }
  const currentStartIndex = allTagsList.indexOf(visibleTagsList[0]);
  const currentEndIndex = allTagsList.indexOf(visibleTagsList[visibleTagsList.length - 1]);
  leftBtn.classList.toggle('hidden', currentStartIndex === 0);
  rightBtn.classList.toggle('hidden', currentEndIndex === allTagsList.length - 1);
}

// При изменении размеров окна пересчитываем список тегов
window.addEventListener('resize', () => {
  updateFilters(false);
  setupScroll();
});
