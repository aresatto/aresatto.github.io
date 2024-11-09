import { firestoreDb, collection, addDoc } from './firebaseConfig.js';
import { realtimeDb } from './firebaseConfig.js';
import { ref, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

async function createRoom(playerName) {
    try {
        const roomRef = await addDoc(collection(firestoreDb, 'rooms'), {
            player1: playerName,
            player2: null,
            status: "waiting"
        });
        const roomId = roomRef.id;
        console.log(`Room created with ID: ${roomId}`);

        await update(ref(realtimeDb, 'games/' + roomId + '/player1'), { status: 'ready' });

        return roomId;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('playerName');

    if (playerName) {
        try {
            const roomId = await createRoom(playerName);
            if (roomId) {
                localStorage.setItem('playerName', playerName);
                localStorage.setItem('roomId', roomId);
                document.getElementById('game-code').textContent = roomId;

                const copyButton = document.getElementById('copy-code-btn');
                copyButton.addEventListener('click', function() {
                    navigator.clipboard.writeText(roomId).then(function() {
                        alert('¡Código copiado!');
                    }).catch(function(err) {
                        console.error('Error al copiar el código: ', err);
                    });
                });

                setTimeout(() => {
                    window.location.href = 'salaEspera.html';
                }, 5000);
            } else {
                alert("Hubo un problema al crear la sala. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error al crear la sala: ", error);
            alert("Hubo un problema al crear la sala. Intenta de nuevo.");
        }
    }
});
