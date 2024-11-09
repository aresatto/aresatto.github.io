document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game-btn').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value;
        if (playerName.trim() !== "") {
            localStorage.setItem('player2Name', playerName);
            localStorage.setItem('playerName', playerName);
            window.location.href = `ingresar-sala.html`;
        } else {
            alert("Por favor, introduce un nombre válido.");
        }
    });
});
