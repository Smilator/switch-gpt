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
    renderGames(games, type);
  } catch (err) {
    container.innerHTML = `<p>Errore nel caricamento: ${err.message}</p>`;
  }
}

function renderGames(games, type) {
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
    card.id = `card-${game.id}`;
    if (game.locked) card.classList.add('locked');

    card.innerHTML = `
      <h3>${game.name}</h3>
      ${imageUrl ? `<img src="${imageUrl}" alt="${game.name}" />` : ''}
      <div class="controls" id="controls-${game.id}">
        ${renderControls(game)}
      </div>
      <div class="buttons">
        <a href="${game.url || '#'}" target="_blank">Scheda IGDB</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderControls(game) {
  if (game.locked) {
    return `<button onclick="updateState('${game.id}', ${game.likes}, ${game.dislikes}, false)">🔓 Sblocca</button>`;
  } else {
    return `
      <button class="lock" onclick="updateState('${game.id}', ${game.likes}, ${game.dislikes}, true)">⭐</button>
      <button onclick="like('${game.id}', ${game.likes}, ${game.dislikes})">👍 <span class="counter" id="like-${game.id}">${game.likes}</span></button>
      <button onclick="dislike('${game.id}', ${game.likes}, ${game.dislikes})">👎 <span class="counter" id="dislike-${game.id}">${game.dislikes}</span></button>
    `;
  }
}

async function updateState(id, likes, dislikes, locked) {
  await fetch(`${API_BASE}/api/favorites/${id}/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes, dislikes, locked })
  });

  const controls = document.getElementById(`controls-${id}`);
  const game = { id, likes, dislikes, locked };
  controls.innerHTML = renderControls(game);

  const card = document.getElementById(`card-${id}`);
  if (locked) {
    card.classList.add('locked');
  } else {
    card.classList.remove('locked');
  }
}

function like(id, currentLikes, currentDislikes) {
  const newLikes = currentLikes + 1;
  document.getElementById(`like-${id}`).innerText = newLikes;
  updateState(id, newLikes, currentDislikes, false);
}

function dislike(id, currentLikes, currentDislikes) {
  const newDislikes = currentDislikes + 1;
  document.getElementById(`dislike-${id}`).innerText = newDislikes;
  updateState(id, currentLikes, newDislikes, false);
}
