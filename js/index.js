document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-game-btn');
    const rulesDiv = document.getElementById('rules');
    const gameTitle = document.getElementById('game-title');

    if(startBtn) {
        // Lógica para mostrar/ocultar las reglas del juego
        startBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que el enlace haga scroll o cambie de página inmediatamente
            // Alterna la visibilidad del texto de las reglas
            rulesDiv.classList.toggle('hidden');

            // Cambia el título y el texto del botón
            if (rulesDiv.classList.contains('hidden')) {
                gameTitle.innerHTML = 'Piedra <br> Papel ó<br> tijeras';
                startBtn.innerHTML = '¡Jugar! <span></span> <span></span>';
                // Redirige a Game.html
                window.location.href = "Game.html";
            } else {
                gameTitle.innerHTML = 'Reglas del Juego';
                startBtn.innerHTML = 'Jugar <span></span> <span></span>';
            }
        });
    }
});

