document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game-btn').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value;
        if (playerName.trim() !== "") {
            localStorage.setItem('player1Name', playerName);  // Almacenar nombre del jugador 1
            localStorage.setItem('playerName', playerName);   // Almacenar nombre para uso general
            window.location.href = `codigo.html?playerName=${playerName}`;
        } else {
            alert("Por favor, introduce un nombre válido.");
        }
    });
});
