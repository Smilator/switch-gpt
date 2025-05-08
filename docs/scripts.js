
fetch('/api/favorites')
    .then(res => res.json())
    .then(games => {
        const list = document.getElementById('favorites-list');
        list.innerHTML = '';
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card' + (game.locked ? ' locked' : '');
            card.dataset.id = game.id;

            const name = document.createElement('h3');
            name.textContent = game.name;
            card.appendChild(name);

            const likeBtn = document.createElement('button');
            likeBtn.className = 'like-btn';
            likeBtn.dataset.id = game.id;
            likeBtn.innerHTML = `Like (<span class="like-count" data-id="${game.id}">${game.likes}</span>)`;
            card.appendChild(likeBtn);

            const dislikeBtn = document.createElement('button');
            dislikeBtn.className = 'dislike-btn';
            dislikeBtn.dataset.id = game.id;
            dislikeBtn.innerHTML = `Dislike (<span class="dislike-count" data-id="${game.id}">${game.dislikes}</span>)`;
            card.appendChild(dislikeBtn);

            const lockBtn = document.createElement('button');
            lockBtn.className = 'lock-btn';
            lockBtn.dataset.id = game.id;
            lockBtn.textContent = 'Lock';
            card.appendChild(lockBtn);

            list.appendChild(card);
        });

        attachEvents();
    });

function attachEvents() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.id;
            fetch(`/api/games/${gameId}/like`, { method: 'POST' })
                .then(res => {
                    if (res.ok) {
                        const count = document.querySelector(`.like-count[data-id="${gameId}"]`);
                        count.textContent = parseInt(count.textContent) + 1;
                    }
                });
        });
    });

    document.querySelectorAll('.dislike-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.id;
            fetch(`/api/games/${gameId}/dislike`, { method: 'POST' })
                .then(res => {
                    if (res.ok) {
                        const count = document.querySelector(`.dislike-count[data-id="${gameId}"]`);
                        count.textContent = parseInt(count.textContent) + 1;
                    }
                });
        });
    });

    document.querySelectorAll('.lock-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.id;
            fetch(`/api/games/${gameId}/lock`, { method: 'POST' })
                .then(res => {
                    if (res.ok) {
                        const card = document.querySelector(`.game-card[data-id="${gameId}"]`);
                        card.classList.toggle('locked');
                    }
                });
        });
    });
}
