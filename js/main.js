document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    document.getElementById('addBtn').addEventListener('click', openModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('addForm').addEventListener('submit', handleSubmit);
    new ResizeObserver(forceGridRefresh).observe(document.body);
});

let tags = new Set();

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
    updateFilters();
}

function addCardToGallery(data) {
    const gallery = document.getElementById('gallery');
    const card = createCardElement(data);
    gallery.appendChild(card);
    data.tags.forEach(tag => tags.add(tag));
}

function createCardElement(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.tags = data.tags.join(',');
    
    card.innerHTML = `
        <img src="${data.image}" alt="${data.title}">
        <div class="card-body">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <div class="card-tags">
                ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

function updateFilters() {
    const container = document.getElementById('tagsContainer');
    container.innerHTML = '';
    
    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = tag;
        btn.dataset.filter = tag;
        btn.addEventListener('click', filterHandler);
        container.appendChild(btn);
    });
}

function filterHandler(e) {
    const filter = e.target.dataset.filter;
    
    // Сбрасываем активное состояние всех кнопок
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Устанавливаем активное состояние для выбранной кнопки
    e.target.classList.add('active');

    // Обновляем отображение карточек
    document.querySelectorAll('.card').forEach(card => {
        const cardTags = card.dataset.tags.split(',');
        const shouldShow = filter === 'all' || cardTags.includes(filter);
        card.style.display = shouldShow ? 'block' : 'none';
    });

    // Пересчитываем сетку
    forceGridRefresh();
}

function forceGridRefresh() {
    const gallery = document.getElementById('gallery');
    const temp = gallery.style.display;
    gallery.style.display = 'none';
    gallery.offsetHeight; // Триггер рефлоу
    gallery.style.display = temp;
}

function openModal() {
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

async function handleSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('addForm'); // Получаем ссылку на форму
    const imageFile = document.getElementById('image').files[0];
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const tagsInput = document.getElementById('tags').value.split(',').map(t => t.trim());

    if (!imageFile || !title || !desc || tagsInput.length === 0) {
        alert('Заполните все поля!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        addCardToGallery({
            title: title,
            description: desc,
            tags: tagsInput,
            image: e.target.result
        });
        document.getElementById('modal').style.display = 'none';
        e.target.reset();
    };
    reader.readAsDataURL(imageFile);
}

function validateForm(data) {
    return data.image && data.title && data.description && data.tags.length > 0;
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}