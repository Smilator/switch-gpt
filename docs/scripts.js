const API_BASE = "https://switch-gpt.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('favorites')) {
    loadAndRender('favorites');
  } else if (window.location.pathname.includes('deleted')) {
    loadAndRender('deleted');
  }
});

async function loadAndRender(type) {
  const container = document.getElementById('game-list');
  container.innerHTML = "<p>Caricamento...</p>";
  try {
    const res = await fetch(`${API_BASE}/api/${type}`);
    const games = await res.json();
    renderGames(games);
  } catch (err) {
    container.innerHTML = `<p>Errore nel caricamento: ${err.message}</p>`;
  }
}

function renderGames(games) {
  const container = document.getElementById('game-list');
  container.innerHTML = '';
  if (!games.length) {
    container.innerHTML = '<p>Nessun gioco trovato.</p>';
    return;
  }

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <h3>${game.name}</h3>
      ${game.cover ? `<img src="${game.cover}" alt="${game.name}" />` : ''}
      <div class="buttons">
        <a href="${game.url}" target="_blank">Scheda IGDB</a>
      </div>
    `;
    container.appendChild(card);
  });
}
