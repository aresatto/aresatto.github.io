document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game-btn').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value;
        if (playerName.trim() !== "") {
            localStorage.setItem('player2Name', playerName);  // Almacenar nombre del jugador 2
            localStorage.setItem('playerName', playerName);   // Almacenar nombre para uso general
            window.location.href = `ingresar-sala.html`;
        } else {
            alert("Por favor, introduce un nombre válido.");
        }
    });
});
