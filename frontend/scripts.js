const API_BASE = "https://switch-gpt.onrender.com";

async function loadFavoritesFromAPI() {
  const res = await fetch(`${API_BASE}/api/favorites`);
  const favorites = await res.json();
  renderGames(favorites);
}

function renderGames(games) {
  const container = document.getElementById('game-list');
  container.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <h3>${game.name}</h3>
      <img src="${game.cover}" alt="${game.name}" />
      <p><a href="${game.url}" target="_blank">Scheda IGDB</a></p>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadFavoritesFromAPI);
