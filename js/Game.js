import { firestoreDb, doc, updateDoc } from './firebaseConfig.js';
import { realtimeDb } from './firebaseConfig.js';
import { ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Variables de estado
let player1Score = 0;
let player2Score = 0;
let countdownInterval;
let eleccionJugador = null;
const roomId = localStorage.getItem('roomId');
const playerName = localStorage.getItem('playerName');
const player1Name = localStorage.getItem('player1Name');
const player2Name = localStorage.getItem('player2Name');

document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    const loader = document.getElementById('loader');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoTexto = document.getElementById('resultado-texto');
    const reiniciarBtn = document.getElementById('reiniciar-btn');
    const recordDiv = document.getElementById('record');
    const opciones = ['piedra', 'papel', 'tijeras'];
    let countdown = 5;

    document.querySelectorAll('.section-1 img').forEach(img => {
        img.addEventListener('click', (event) => {
            eleccionJugador = event.target.id;
            enviarEleccion(eleccionJugador);
        });
    });

    const enviarEleccion = async (choice) => {
        const field = playerName === player1Name ? 'player1Choice' : 'player2Choice';
        await updateDoc(doc(firestoreDb, 'rooms', roomId), {
            [field]: choice
        });
        updatePlayerChoiceRealtime(roomId, field, choice);
    };

    const updatePlayerChoiceRealtime = (roomId, player, choice) => {
        set(ref(realtimeDb, 'games/' + roomId + '/' + player), { choice });
    };
    const listenForChoices = (roomId) => {
        const gameRef = ref(realtimeDb, 'games/' + roomId);
        onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.player1Choice && data.player2Choice) {
                iniciarAnimacion(data.player1Choice, data.player2Choice);
            } else {
                // Aquí maneja el caso en que uno de los jugadores no elija dentro del tiempo permitido
                if (data) {
                    const jugador1Listo = data.player1Choice !== undefined;
                    const jugador2Listo = data.player2Choice !== undefined;
                    if (!jugador1Listo || !jugador2Listo) {
                        mostrarResultado(jugador1Listo ? data.player1Choice : null, jugador2Listo ? data.player2Choice : null);
                    }
                }
            }
        });
    };

    listenForChoices(roomId);

    const iniciarAnimacion = (choice1, choice2) => {
        const player1Element = document.getElementById(`Mano${getHandIndex(choice1)}`);
        const player2Element = document.getElementById(`Mano${getHandIndex(choice2)}`);

        if (player1Element && player2Element) {
            player1Element.classList.add('selected');
            player2Element.classList.add('selected');

            setTimeout(() => {
                mostrarResultado(choice1, choice2);
            }, 3000);
        } else {
            console.error("Uno de los elementos no se encontró");
        }
    };

    const getHandIndex = (choice) => {
        switch (choice) {
            case 'papel':
                return 0;
            case 'piedra':
                return 1;
            case 'tijeras':
                return 2;
            default:
                return -1;
        }
    };
    const mostrarResultado = (choice1, choice2) => {
        let resultText;
        resultadoDiv.classList.remove('verde', 'rojo', 'naranja');

        if (choice1 === null || choice2 === null) {
            resultText = choice1 === null ? 'Perdiste por no elegir' : '¡Ganaste!';
            resultadoDiv.classList.add(choice1 === null ? 'rojo' : 'verde');
            if (choice1 === null) {
                player2Score++;
            } else {
                player1Score++;
            }
        } else if (choice1 === choice2) {
            resultText = '¡Es un empate!';
            resultadoDiv.classList.add('naranja');
        } else if (
            (choice1 === 'piedra' && choice2 === 'tijeras') ||
            (choice1 === 'papel' && choice2 === 'piedra') ||
            (choice1 === 'tijeras' && choice2 === 'papel')
        ) {
            resultText = `¡Ganaste!`;
            if (playerName === player1Name) {
                player1Score++;
            } else {
                player2Score++;
            }
            resultadoDiv.classList.add('verde');
        } else {
            resultText = `Perdiste.`;
            if (playerName === player1Name) {
                player2Score++;
            } else {
                player1Score++;
            }
            resultadoDiv.classList.add('rojo');
        }

        resultadoTexto.innerHTML = resultText;
        recordDiv.innerHTML = `Ganadas: ${player1Score} | Perdidas: ${player2Score}`;
        resultadoDiv.classList.remove('hidden');
        reiniciarBtn.classList.remove('hidden');

        updateDoc(doc(firestoreDb, 'rooms', roomId), {
            player1Score,
            player2Score
        });
    };

    reiniciarBtn.addEventListener('click', () => {
        document.querySelectorAll('.section-1 img').forEach(img => {
            img.classList.remove('selected');
        });

        resultadoDiv.classList.add('hidden');
        reiniciarBtn.classList.add('hidden');

        update(ref(realtimeDb, 'games/' + roomId + '/' + playerName), { ready: false });

        const otherPlayer = playerName === player1Name ? player2Name : player1Name;
        onValue(ref(realtimeDb, 'games/' + roomId + '/' + otherPlayer), (snapshot) => {
            const data = snapshot.val();
            if (data && data.ready === true) {
                document.getElementById('mensaje-espera').textContent = `Esperando al jugador ${otherPlayer}`;
            }
        });

        update(ref(realtimeDb, 'games/' + roomId + '/' + playerName), { ready: true });

        onValue(ref(realtimeDb, 'games/' + roomId), (snapshot) => {
            const data = snapshot.val();
            if (data.player1.ready && data.player2.ready) {
                document.getElementById('mensaje-espera').textContent = '';
                countdown = 5;
                countdownElement.textContent = countdown;
                countdownElement.style.display = 'block';
                loader.style.display = 'block';
                iniciarCountdown();
            }
        });
    });

    const iniciarCountdown = () => {
        countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                loader.style.display = 'none';
            }
        }, 1000);
    };

    iniciarCountdown();
    listenForChoices(roomId);
});
