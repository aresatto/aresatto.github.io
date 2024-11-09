document.addEventListener('DOMContentLoaded', () => {
    const nuevoJuegoBtn = document.getElementById('nuevo-juego-btn');
    const ingresarSalaBtn = document.getElementById('ingresar-sala-btn');

    if (nuevoJuegoBtn) {
        nuevoJuegoBtn.addEventListener('click', () => {
            window.location.href = 'nombreJugador.html?mode=create';
        });
    }

    if (ingresarSalaBtn) {
        ingresarSalaBtn.addEventListener('click', () => {
            window.location.href = 'nombreJugador2.html';
        });
    }
});
