const initialPlaces = [
    { id: "1", name: "Омск", lat: 54.9884, lng: 73.3242 },
    { id: "2", name: "Санкт-Петербург", lat: 59.9342, lng: 30.3350 },
    { id: "3", name: "Москва", lat: 55.7558, lng: 37.6173 },
    { id: "4", name: "Кронштадт", lat: 59.9946, lng: 29.7678 },
    { id: "5", name: "Выборг", lat: 60.7091, lng: 28.7511 },
    { id: "6", name: "Великий Новгород", lat: 58.5255, lng: 31.2741 },
    { id: "7", name: "Петрозаводск", lat: 61.7849, lng: 34.3469 },
    { id: "8", name: "Каир", lat: 30.0444, lng: 31.2357 },
    { id: "9", name: "Шарм-Эль-Шейх", lat: 27.9158, lng: 34.3299 },
    { id: "10", name: "Гейнюк", lat: 36.6575, lng: 30.5594 },
    { id: "11", name: "Кемер", lat: 36.5986, lng: 30.5615 },
    { id: "12", name: "Сортавала", lat: 61.7018, lng: 30.6903 }
];

let placesData = JSON.parse(localStorage.getItem('my_travels_list_v2'));
if (!placesData) {
    placesData = initialPlaces;
    localStorage.setItem('my_travels_list_v2', JSON.stringify(placesData));
}

let map;
let markersGroup;

function initMap() {
    try {
        map = L.map('map').setView([45.0, 45.0], 3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        markersGroup = L.layerGroup().addTo(map);
        renderMapMarkers();
        renderPlacesList();
    } catch(e) {
        console.error("Ошибка карты:", e);
    }
}

function renderMapMarkers() {
    markersGroup.clearLayers();
    placesData.forEach(place => {
        L.marker([place.lat, place.lng]).addTo(markersGroup).bindPopup(`<b>${place.name}</b>`);
    });
}

window.focusOnPlace = function(lat, lng) {
    map.setView([lat, lng], 9, { animate: true, duration: 1 });
};

function renderPlacesList() {
    const listContainer = document.getElementById('places-list');
    if(!listContainer) return;
    listContainer.innerHTML = '';
    const sorted = [...placesData].sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <div class="place-name" onclick="focusOnPlace(${place.lat}, ${place.lng})">📍 ${place.name}</div>
            <div class="card-actions">
                <button class="edit-btn" onclick="openEditModal('${place.id}')">✏️</button>
                <button class="delete-btn" onclick="deletePlace('${place.id}')">❌</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

const modal = document.getElementById('form-modal');
document.getElementById('open-add-modal').addEventListener('click', () => {
    document.getElementById('modal-title').innerText = "Добавить место";
    document.getElementById('edit-id').value = "";
    document.getElementById('place-name').value = "";
    document.getElementById('place-lat').value = "";
    document.getElementById('place-lng').value = "";
    modal.classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', () => modal.classList.add('hidden'));

window.openEditModal = function(id) {
    const place = placesData.find(p => p.id === id);
    if (!place) return;
    document.getElementById('modal-title').innerText = "Редактировать место";
    document.getElementById('edit-id').value = place.id;
    document.getElementById('place-name').value = place.name;
    document.getElementById('place-lat').value = place.lat;
    document.getElementById('place-lng').value = place.lng;
    modal.classList.remove('hidden');
};

document.getElementById('save-place').addEventListener('click', () => {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('place-name').value.trim();
    const lat = parseFloat(document.getElementById('place-lat').value);
    const lng = parseFloat(document.getElementById('place-lng').value);

    if (!name || isNaN(lat) || isNaN(lng)) {
        alert('Заполните поля корректно!');
        return;
    }

    if (id) {
        const place = birthdaysData.find(p => p.id === id); // Фикс возможной путаницы
        const realPlace = placesData.find(p => p.id === id);
        if (realPlace) { realPlace.name = name; realPlace.lat = lat; realPlace.lng = lng; }
    } else {
        placesData.push({ id: Date.now().toString(), name, lat, lng });
    }

    localStorage.setItem('my_travels_list_v2', JSON.stringify(placesData));
    modal.classList.add('hidden');
    renderMapMarkers();
    renderPlacesList();
});

window.deletePlace = function(id) {
    if (confirm('Удалить это место?')) {
        placesData = placesData.filter(p => p.id !== id);
        localStorage.setItem('my_travels_list_v2', JSON.stringify(placesData));
        renderMapMarkers();
        renderPlacesList();
    }
};

window.addEventListener('load', initMap);
