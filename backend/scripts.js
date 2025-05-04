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
    const card = document.createElement('div');
    card.className = 'game-card';
    card.id = `card-${game.id}`;
    if (game.locked) card.classList.add('locked');

    const imageUrl = typeof game.cover === 'string' ? game.cover : '';

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
      <button onclick="updateState('${game.id}', ${game.likes}, ${game.dislikes}, true)">⭐</button>
      <button onclick="vote('${game.id}', ${game.likes + 1}, ${game.dislikes})">👍 <span id="like-${game.id}">${game.likes}</span></button>
      <button onclick="vote('${game.id}', ${game.likes}, ${game.dislikes + 1})">👎 <span id="dislike-${game.id}">${game.dislikes}</span></button>
    `;
  }
}

async function updateState(id, likes, dislikes, locked) {
  try {
    const res = await fetch(`${API_BASE}/api/favorites/${id}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes, dislikes, locked })
    });

    if (res.ok) {
      const controls = document.getElementById(`controls-${id}`);
      controls.innerHTML = renderControls({ id, likes, dislikes, locked });

      const card = document.getElementById(`card-${id}`);
      if (locked) {
        card.classList.add('locked');
      } else {
        card.classList.remove('locked');
      }
    } else {
      console.error("Errore salvataggio:", await res.text());
    }
  } catch (error) {
    console.error("Errore connessione:", error);
  }
}

function vote(id, likes, dislikes) {
  document.getElementById(`like-${id}`).innerText = likes;
  document.getElementById(`dislike-${id}`).innerText = dislikes;
  updateState(id, likes, dislikes, false);
}
