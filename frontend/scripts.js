
async function fetchAndRender(type) {
  const res = await fetch(`/api/${type}`);
  const data = await res.json();
  renderGames(data, type);
}

function renderGames(games, type) {
  const container = document.getElementById('game-list');
  if (!container) return;
  container.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <h3>${game.name}</h3>
      <img src="${game.cover}" alt="${game.name}" />
      <div class="buttons">
        <a href="${game.url}" target="_blank">Scheda IGDB</a>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('favorites')) {
    fetchAndRender('favorites');
  } else if (window.location.pathname.includes('deleted')) {
    fetchAndRender('deleted');
  }
});
