
// Attacca eventi click sui bottoni
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

// Inizializza stato locked al caricamento
document.querySelectorAll('.game-card').forEach(card => {
    if (card.dataset.locked === 'true') {
        card.classList.add('locked');
    }
});
