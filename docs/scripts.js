const API_BASE = "https://switch-gpt.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('favorites')) {
    loadAndRender('favorites');
  } else if (window.location.pathname.includes('deleted')) {
    loadAndRender('deleted');
  }
});

function getLocalState(id) {
  return JSON.parse(localStorage.getItem("game-state-" + id) || "{}");
}

function setLocalState(id, state) {
  localStorage.setItem("game-state-" + id, JSON.stringify(state));
}

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
    const state = getLocalState(game.id);
    let imageUrl = '';
    if (typeof game.cover === 'object' && game.cover.image_id) {
      imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
    } else if (typeof game.cover === 'string') {
      imageUrl = game.cover;
    }

    const card = document.createElement('div');
    card.className = 'game-card';
    if (state.locked) card.classList.add('locked');

    card.innerHTML = `
      <h3>${game.name}</h3>
      ${imageUrl ? `<img src="${imageUrl}" alt="${game.name}" />` : ''}
      <div class="controls">
        ${state.locked ? `
          <button onclick="unlock('${game.id}', this)">🔓 Sblocca</button>
        ` : `
          <button class="lock" onclick="lock('${game.id}', this)">⭐</button>
          <button onclick="like('${game.id}', this)">👍 <span class="counter">${state.likes || 0}</span></button>
          <button onclick="dislike('${game.id}', this)">👎 <span class="counter">${state.dislikes || 0}</span></button>
        `}
      </div>
      <div class="buttons">
        <a href="${game.url || '#'}" target="_blank">Scheda IGDB</a>
      </div>
    `;

    container.appendChild(card);
  });
}

function lock(id, btn) {
  const state = getLocalState(id);
  state.locked = true;
  setLocalState(id, state);
  loadAndRender(window.location.pathname.includes('favorites') ? 'favorites' : 'deleted');
}

function unlock(id, btn) {
  const state = getLocalState(id);
  state.locked = false;
  setLocalState(id, state);
  loadAndRender(window.location.pathname.includes('favorites') ? 'favorites' : 'deleted');
}

function like(id, btn) {
  const state = getLocalState(id);
  state.likes = (state.likes || 0) + 1;
  setLocalState(id, state);
  btn.querySelector(".counter").innerText = state.likes;
}

function dislike(id, btn) {
  const state = getLocalState(id);
  state.dislikes = (state.dislikes || 0) + 1;
  setLocalState(id, state);
  btn.querySelector(".counter").innerText = state.dislikes;
}


document.querySelectorAll('.like-button').forEach(button => {
  button.addEventListener('click', () => {
    const gameId = button.dataset.id;
    fetch(`/api/games/${gameId}/like`, { method: 'POST' });
  });
});

document.querySelectorAll('.dislike-button').forEach(button => {
  button.addEventListener('click', () => {
    const gameId = button.dataset.id;
    fetch(`/api/games/${gameId}/dislike`, { method: 'POST' });
  });
});
