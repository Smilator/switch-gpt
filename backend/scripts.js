const API_BASE = "https://switch-gpt.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.includes('favorites')
    ? 'favorites'
    : window.location.pathname.includes('deleted')
    ? 'deleted'
    : null;
  if (page) loadAndRender(page);
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
    let imageUrl = '';
    if (typeof game.cover === 'object' && game.cover.image_id) {
      imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    } else if (typeof game.cover === 'string') {
      imageUrl = game.cover;
    }

    const card = document.createElement('div');
    card.className = 'game-card';
    if (game.locked) card.classList.add('locked');

    card.innerHTML = `
      <h3>${game.name}</h3>
      ${imageUrl ? `<img src="${imageUrl}" alt="${game.name}" />` : ''}
      <div class="controls">
        ${game.locked ? `
          <button onclick="updateState('${game.id}', ${game.likes}, ${game.dislikes}, false)">🔓 Sblocca</button>
        ` : `
          <button class="lock" onclick="updateState('${game.id}', ${game.likes}, ${game.dislikes}, true)">⭐</button>
          <button onclick="updateState('${game.id}', ${game.likes + 1}, ${game.dislikes}, false)">👍 <span class="counter">${game.likes}</span></button>
          <button onclick="updateState('${game.id}', ${game.likes}, ${game.dislikes + 1}, false)">👎 <span class="counter">${game.dislikes}</span></button>
        `}
      </div>
      <div class="buttons">
        <a href="${game.url || '#'}" target="_blank">Scheda IGDB</a>
      </div>
    `;
    container.appendChild(card);
  });
}

async function updateState(id, likes, dislikes, locked) {
  await fetch(`${API_BASE}/api/favorites/${id}/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes, dislikes, locked })
  });
  const page = window.location.pathname.includes('favorites') ? 'favorites' : 'deleted';
  loadAndRender(page);
}
